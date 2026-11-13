# SPDX-License-Identifier: MIT
"""LC's private rendered-Main receipt and owned Agent cover publisher.

Only observe(), wired to the retained original Main render callback, can mint.
No public RPC accepts a HWND, publisher PID, game identity or a ready boolean.
"""
from __future__ import annotations
import asyncio
import time
import uuid


def _hex(value):
    return isinstance(value, str) and len(value) == 32 and all(c in '0123456789abcdef' for c in value)


class FirstContent:
    def __init__(self, native, publish, clock=time.monotonic, report=lambda text: None, tick=None):
        self.native, self.publish, self.clock = native, publish, clock
        self.report = report
        self.tick = tick if tick is not None else lambda: int(clock() * 1000)
        self.revision = 0
        self.launch = None
        self.receipt = None
        self.retired = set()
        self.task = None
        self.result = None

    def begin(self, app_id, epoch, owner, trigger):
        self.retire()
        self.revision += 1
        self.launch = {'appId': app_id, 'requestEpoch': str(epoch), 'requestId': uuid.uuid4().hex,
                       'challenge': uuid.uuid4().hex, 'revision': str(self.revision), 'owner': owner, 'triggerAt': trigger}
        self.result = None

    def status(self):
        return dict(self.launch) if self.launch is not None and self.result is None else None

    def observe(self, payload):
        if not isinstance(payload, dict) or set(payload) != {'action', 'requestId', 'challenge', 'revision', 'receipt'}:
            return {'ok': False}
        launch = self.launch
        if (launch is None or self.result is not None or payload['action'] not in ('rendered', 'renew', 'revoke')
                or any(payload[key] != launch[key] for key in ('requestId', 'challenge', 'revision'))
                or not _hex(payload['receipt'])):
            return {'ok': False}
        nonce = payload['receipt']
        if payload['action'] == 'revoke':
            self.retired.add(nonce)
            if self.receipt is not None and self.receipt['nonce'] == nonce:
                self.receipt = None
                self.result = 'revoked'
            return {'ok': True}
        if nonce in self.retired:
            return {'ok': False}
        if self.receipt is None:
            if payload['action'] != 'rendered':
                return {'ok': False}
            started = self.clock()
            native = self.native(None, True)
            if native is None or self.launch is not launch or self.clock() < started or self.clock() - started > .25:
                self.retired.add(nonce)
                return {'ok': False}
            self.receipt = {'nonce': nonce, 'native': native, 'expires': self.clock() + .7, 'observedTick': self.tick(), 'launch': launch}
            self.task = asyncio.create_task(self._run(self.receipt))
        else:
            held = self.receipt
            if (held['nonce'] != nonce or held['launch'] is not launch or held['expires'] <= self.clock()
                    or self.native(held['native'], False) is not held['native'] or self.launch is not launch
                    or self.receipt is not held or held['expires'] <= self.clock()):
                self.retired.add(held['nonce'])
                self.receipt = None
                self.result = 'revoked'
                return {'ok': False}
            held['expires'] = self.clock() + .7
            held['observedTick'] = self.tick()
        return {'ok': True}

    def current(self, held):
        return (self.receipt is held and self.launch is held['launch'] and self.result is None
                and held['nonce'] not in self.retired and held['expires'] > self.clock()
                and self.native(held['native'], False) is held['native']
                and self.receipt is held and self.launch is held['launch']
                and held['expires'] > self.clock())

    async def _run(self, held):
        lease = None
        launch = held['launch']
        last_state = None
        try:
            while self.current(held):
                if lease is None:
                    body = {'protocol': 1, 'action': 'begin', 'appId': launch['appId'],
                            'requestId': launch['requestId'], 'requestEpoch': launch['requestEpoch'],
                            'sourceReceipt': held['nonce'], 'surfaceRevision': launch['revision'],
                            'sourceObservedAt': str(held['observedTick']), **held['native']['wire']}
                else:
                    body = {'protocol': 1, 'action': 'renew', 'requestId': launch['requestId'],
                            'requestEpoch': launch['requestEpoch'], 'lease': lease, 'sourceObservedAt': str(held['observedTick'])}
                reply = await self.publish(body)
                # A late reply never re-creates a revoked local render receipt.
                if not self.current(held):
                    if isinstance(reply, dict) and _hex(reply.get('lease')):
                        lease = reply['lease']
                    break
                if isinstance(reply, dict) and reply.get('available') is False:
                    self.result = 'unavailable'
                    break
                if isinstance(reply, dict) and reply.get('ok') is True and _hex(reply.get('lease')):
                    if (reply.get('requestId') != launch['requestId'] or reply.get('requestEpoch') != launch['requestEpoch']
                            or reply.get('appId') != launch['appId'] or reply.get('gameReadyClaimed') is not False
                            or reply.get('inputAuthorityClaimed') is not False):
                        break
                    lease = reply['lease']
                    state = (reply.get('state'), reply.get('nativePhase'), reply.get('cleanupComplete'))
                    if state != last_state:
                        last_state = state
                        safe = state[0] if state[0] in ('preparing', 'presented', 'first-content-observed', 'retired') else 'unknown'
                        phase = state[1] if type(state[1]) is int and 0 <= state[1] <= 3 else -1
                        self.report(f'First-content cover state={safe} native_phase={phase}; no game-ready/input claim')
                    if reply.get('state') in ('first-content-observed', 'retired'):
                        self.result = reply['state']
                        break
                # No native admission before the existing server association and game FG exist.
                await asyncio.sleep(.1)
        except (OSError, ValueError, asyncio.TimeoutError):
            pass
        finally:
            self.retired.add(held['nonce'])
            if self.launch is launch and self.result is None:
                self.result = 'retired'
            if self.receipt is held:
                self.receipt = None
            if lease is not None:
                try:
                    await self.publish({'protocol': 1, 'action': 'close', 'requestId': launch['requestId'],
                                        'requestEpoch': launch['requestEpoch'], 'lease': lease})
                except (OSError, ValueError, asyncio.TimeoutError):
                    pass  # The Agent's independent 1 s intent and 250 ms source pulse expire.

    def retire(self):
        if self.receipt is not None:
            self.retired.add(self.receipt['nonce'])
        self.receipt = None
        self.launch = None
        self.result = None
        # Do not cancel a shared Decky caller or leave a late begin reply unclosed.
        # The owned task sees revocation after its bounded request and closes its lease.

