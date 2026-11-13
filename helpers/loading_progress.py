"""Passive loading metadata for an already admitted, exact launch child.

No process discovery, window actions or authentication decisions occur here.
The only accepted tree is the complete progress-only shape observed on Windows.
"""
import asyncio
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time
import uuid

MAX_AGE = .250
PINS = {'LaunchCurtainProgressUia.exe': '39CE253A2A1DF1773D5934906508B0D32BA1826E5346A31C297D36C39C51FC58'}

# index, parent, depth, ControlType, AutomationId, ClassName, focusable,
# offscreen, enabled, invoke, selection, expand, password, range-pattern.
_SHAPE = (
    (0,-1,0,50032,"","GAMINGSERVICESUI_HOSTING_WINDOW_CLASS",True,False,True,False,False,False,False,False),
    (1,0,1,50033,"","DRAG_BAR_WINDOW_CLASS",False,False,True,False,False,False,False,False),
    (2,0,1,50033,"","Windows.UI.Composition.DesktopWindowContentBridge",False,False,True,False,False,False,False,False),
    (3,2,2,50033,"","Windows.UI.Input.InputSite.WindowClass",False,False,True,False,False,False,False,False),
    (4,3,3,50006,"","Image",False,False,True,False,False,False,False,False),
    (5,3,3,50020,"SigningIn","TextBlock",False,False,True,False,False,False,False,False),
    (6,3,3,50012,"","ProgressRing",False,False,True,False,False,False,False,False),
    (7,3,3,50020,"","TextBlock",False,False,True,False,False,False,False,False),
    (8,3,3,50000,"MinimizeButton","Button",True,False,True,True,False,False,False,False),
    (9,3,3,50000,"CloseButton","Button",True,False,True,True,False,False,False,False),
    (10,0,1,50037,"TitleBar","",False,False,True,False,False,False,False,False),
    (11,10,2,50010,"SystemMenuBar","",True,False,True,False,False,False,False,False),
    (12,11,3,50011,None,"",True,False,True,False,False,True,False,False),
    (13,10,2,50000,"Minimize","",False,True,True,True,False,False,False,False),
    (14,10,2,50000,"Maximize","",False,True,False,True,False,False,False,False),
    (15,10,2,50000,"Close","",False,True,True,True,False,False,False,False),
)
# Complete second signature from both bounded native COM observations.
_NATIVE_SHAPE = (
    (0, -1, 0, 50032, '', 'GAMINGSERVICESUI_HOSTING_WINDOW_CLASS', True, False, True, False, False, False, False, False),
    (1, 0, 1, 50033, '', 'DRAG_BAR_WINDOW_CLASS', True, False, True, False, False, False, False, False),
    (2, 0, 1, 50033, '', 'Windows.UI.Composition.DesktopWindowContentBridge', False, False, True, False, False, False, False, False),
    (3, 2, 2, 50033, '', 'Windows.UI.Input.InputSite.WindowClass', False, False, True, False, False, False, False, False),
    (4, 3, 3, 50006, '', 'Image', False, False, True, False, False, False, False, False),
    (5, 3, 3, 50020, 'SigningIn', 'TextBlock', False, False, True, False, False, False, False, False),
    (6, 3, 3, 50012, '', 'ProgressRing', False, False, True, False, False, False, False, False),
    (7, 3, 3, 50020, '', 'TextBlock', False, False, True, False, False, False, False, False),
    (8, 3, 3, 50000, 'MinimizeButton', 'Button', True, False, True, True, False, False, False, False),
    (9, 3, 3, 50000, 'CloseButton', 'Button', True, False, True, True, False, False, False, False),
    (10, 0, 1, 50037, 'TitleBar', '', True, True, True, False, False, False, False, False),
    (11, 10, 2, 50010, 'SystemMenuBar', '', True, False, True, False, False, False, False, False),
    (12, 11, 3, 50011, '', '', True, False, True, True, False, True, False, False),
    (13, 10, 2, 50000, 'Minimize-Restore', '', False, True, True, True, False, False, False, False),
    (14, 10, 2, 50000, 'Maximize-Restore', '', False, True, False, True, False, False, False, False),
    (15, 10, 2, 50000, 'Close', '', False, True, True, True, False, False, False, False),
)
_FIELDS = ("index","parent","depth","controlType","automationId","className",
           "focusable","offscreen","enabled","invokeAvailable","selectionItemAvailable",
           "expandCollapseAvailable","isPassword","progressPattern")

_LOADING_STATES = ("SigningIn", "CheckingForUpdates", "SyncingCloudSaves", "Launching")

def _field_matches(field, actual, wanted, expected):
    if (field == "automationId" and expected[:6] == (5, 3, 3, 50020, "SigningIn", "TextBlock")
            and type(actual) is str and actual in _LOADING_STATES):
        return True
    return type(actual) is type(wanted) and actual == wanted

def progress_only(report, target):
    if not isinstance(report, dict) or report.get("target") != target:
        return False
    if report.get("nativeIdentityBeforeAndAfter") is not True:
        return False
    result = report.get("result")
    if (not isinstance(result, dict) or result.get("complete") is not True
            or result.get("state") != "interactive-controls-observed"
            or "reason" not in result or result["reason"] is not None
            or type(result.get("visibleProgressBars")) is not int
            or type(result.get("interactiveEditOrButtons")) is not int
            or result.get("visibleProgressBars") != 1
            or result.get("interactiveEditOrButtons") != 2):
        return False
    rows = result.get("elements")
    if not isinstance(rows, list) or len(rows) != len(_SHAPE):
        return False
    for signature in (_SHAPE, _NATIVE_SHAPE):
        matched = True
        for row, expected in zip(rows, signature):
            if not isinstance(row, dict) or any(field not in row for field in _FIELDS):
                return False
            if any(not _field_matches(field, row[field], wanted, expected)
                   for field, wanted in zip(_FIELDS, expected)):
                matched = False
                break
        if matched:
            return True
    return False

HELPER_REVISION = "lc-native-loading-states-v4"
try:
    HELPER_SHA256 = hashlib.sha256(Path(__file__).read_bytes()).hexdigest().upper()
except OSError:
    HELPER_SHA256 = None

def _shape_mismatch(report):
    """Metadata-only diagnostic; never participates in an admission decision."""
    result = report.get("result") if isinstance(report, dict) else None
    rows = result.get("elements") if isinstance(result, dict) else None
    if not isinstance(rows, list):
        return {"signature":"none", "row":None, "field":"elements", "expectedType":"list", "actualType":type(rows).__name__, "expected":None, "actual":None}
    known = {v for shape in (_SHAPE, _NATIVE_SHAPE) for row in shape for v in row if type(v) is str} | set(_LOADING_STATES)
    def value(raw):
        if raw is None or type(raw) is bool or type(raw) is int and -1 <= raw <= 0xffffffff:
            return raw
        if type(raw) is str:
            return raw if raw in known else "<other-metadata>"
        return None
    candidates = []
    for name, shape in (("managed", _SHAPE), ("native", _NATIVE_SHAPE)):
        differences = []
        if len(rows) != len(shape):
            differences.append({"signature":name, "row":None, "field":"rowCount", "expectedType":"int", "actualType":"int", "expected":len(shape), "actual":len(rows) if len(rows)<=64 else None})
        for index, (row, wanted) in enumerate(zip(rows, shape)):
            if not isinstance(row, dict):
                differences.append({"signature":name, "row":index, "field":"row", "expectedType":"dict", "actualType":type(row).__name__, "expected":None, "actual":None})
                continue
            for field, expected in zip(_FIELDS, wanted):
                actual = row.get(field)
                if field not in row or not _field_matches(field, actual, expected, wanted):
                    differences.append({"signature":name, "row":index, "field":field, "expectedType":type(expected).__name__, "actualType":type(actual).__name__ if field in row else "missing", "expected":value(expected), "actual":value(actual)})
        candidates.append(differences)
    closest = min(candidates, key=len)
    return closest[0] if closest else None

class ProgressProbe:
    """One owned worker; bounded recovery never grants cover by itself."""
    MAX_STARTS = 3
    def __init__(self, directory=None, clock=time.monotonic, spawn=asyncio.create_subprocess_exec):
        self.directory = Path(directory or Path(__file__).parent / "progress-uia")
        self.clock, self.spawn = clock, spawn
        self.process = None
        self.start_task = None
        self.query_task = None
        self.closed = False
        self.receipt = None
        self.starts = 0
        self.next_start = 0.0
        self.retryable = True
        self.retiring = False
        self.last_reason = "idle"
        self.last_duration_ms = 0.0
        self.last_error_type = None
        self.last_winerror = None
        self.last_rows = None
        self.loop_type = None
        self.last_decision = None

    def _note(self, reason, began=None, error=None, rows=None):
        self.last_reason = reason
        self.last_duration_ms = round(max(0.0, self.clock()-began)*1000, 3) if began is not None else 0.0
        self.last_error_type = type(error).__name__ if error is not None else None
        code = getattr(error, "winerror", None)
        self.last_winerror = code if type(code) is int else None
        self.last_rows = rows if type(rows) is int and 0 <= rows <= 64 else None

    def diagnostic(self):
        return dict(reason=self.last_reason, durationMs=self.last_duration_ms,
                    starts=self.starts, startLimit=self.MAX_STARTS,
                    errorType=self.last_error_type, winerror=self.last_winerror,
                    rows=self.last_rows, loopType=self.loop_type, helperRevision=HELPER_REVISION, helperSha256=HELPER_SHA256,
                    probeClosed=bool(self.closed),
                    decision=dict(self.last_decision) if self.last_decision is not None else None)

    def _failure(self, reason, began=None, error=None):
        self.receipt = None
        self.next_start = self.clock() + .250 * (2 ** max(0, self.starts-1))
        self._note(reason, began, error)

    def prewarm(self):
        if self.closed or not self.retryable or self.query_task is not None:
            return
        if self.start_task is not None and not self.start_task.done():
            return
        if self.process is not None:
            if self.process.returncode is None:
                return  # Healthy or still retiring: never overlap children.
            self.process = None
            self.retiring = False
            self.start_task = None
            self._failure("worker-exited")
        elif self.start_task is not None:
            self.start_task = None
        if self.starts >= self.MAX_STARTS:
            self._note("restart-limit")
            return
        if self.clock() < self.next_start:
            self._note("restart-cooldown")
            return
        self.starts += 1
        self.start_task = asyncio.create_task(self._start())

    async def _start(self):
        began = self.clock()
        try:
            self.loop_type = type(asyncio.get_running_loop()).__name__
            if not PINS or any(hashlib.sha256((self.directory/name).read_bytes()).hexdigest().upper() != digest
                               for name,digest in PINS.items()):
                self.retryable = False
                self._note("binary-pin", began)
                return False
            process = await self.spawn(str(self.directory/"LaunchCurtainProgressUia.exe"), "--server",
                stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.DEVNULL, limit=32769,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
            self.process = process
            self.retiring = False
            if self.closed:
                await self._stop_process()
                return False
            line = await asyncio.wait_for(process.stdout.readline(), 2.0)
            hello = json.loads(line)
            if (not isinstance(hello,dict) or set(hello) != {"ready","protocol"}
                    or hello["ready"] is not True or type(hello["protocol"]) is not int or hello["protocol"] != 1):
                self._failure("startup-response", began)
                await self._stop_process()
                return False
            self._note("worker-ready", began)
            return not self.closed
        except asyncio.CancelledError:
            await self._stop_process()
            return False
        except Exception as error:
            self._failure("startup-error", began, error)
            await self._stop_process()
            return False

    async def read(self, key, target):
        self.receipt = None
        self.last_decision = None
        target = dict(target)
        self.prewarm()
        if self.closed or self.query_task is not None:
            return None
        if self.start_task is None or self.retiring:
            return None
        task = asyncio.current_task()
        self.query_task = task
        began = self.clock()
        stage = "startup"
        try:
            if not await asyncio.wait_for(asyncio.shield(self.start_task), .180):
                return None  # _start recorded the actual bounded failure.
            if task.cancelling():
                raise asyncio.CancelledError
            process = self.process
            if self.closed or process is None or process.returncode is not None:
                self._failure("worker-unavailable", began)
                return None
            request_id = uuid.uuid4().hex
            scalar = (request_id,str(target['hwnd']),str(target['pid']),str(target['birth']),
                      base64.b64encode(target['image'].encode('utf-16-le')).decode('ascii'),
                      base64.b64encode(target['windowClass'].encode('utf-16-le')).decode('ascii'))
            payload = '\t'.join(scalar).encode('ascii')
            if len(payload) > 16384:
                self._note("request-cap", began)
                return None
            stage = "query"
            process.stdin.write(payload+b"\n")
            await asyncio.wait_for(process.stdin.drain(), .040)
            if task.cancelling():
                raise asyncio.CancelledError
            elapsed = self.clock()-began
            if elapsed < 0 or elapsed >= .200:
                self._failure("query-budget", began)
                await self._stop_process()
                return None
            line = await asyncio.wait_for(process.stdout.readline(), .200-elapsed)
            if task.cancelling():
                raise asyncio.CancelledError
            if len(line)>32768:
                self._failure("response-cap", began)
                await self._stop_process()
                return None
            report = json.loads(line)
            if (not isinstance(report,dict) or report.get('id') != request_id
                    or self.process is not process):
                self._failure("response-binding", began)
                await self._stop_process()
                return None
            report['target'] = target
            age = self.clock()-began
            accepted = progress_only(report,target)
            result = report.get("result")
            def count(field):
                v = result.get(field) if isinstance(result,dict) else None
                return v if type(v) is int and 0 <= v <= 64 else None
            state = result.get("state") if isinstance(result,dict) else None
            self.last_decision = dict(closedAtDecision=bool(self.closed), shapeAccepted=accepted,
                nativeIdentityBeforeAfter=report.get("nativeIdentityBeforeAndAfter") if type(report.get("nativeIdentityBeforeAndAfter")) is bool else None,
                complete=result.get("complete") if isinstance(result,dict) and type(result.get("complete")) is bool else None,
                rowCount=len(result["elements"]) if isinstance(result,dict) and isinstance(result.get("elements"),list) and len(result["elements"])<=64 else None,
                visibleProgressBars=count("visibleProgressBars"), interactiveEditOrButtons=count("interactiveEditOrButtons"),
                state=state if state in ("unknown","interactive-controls-observed","busy-progress-evidence","no-positive-busy-evidence") else "<other>",
                reasonAbsent=isinstance(result,dict) and "reason" in result and result["reason"] is None,
                mismatch=None if accepted else _shape_mismatch(report))
            if not self.closed and 0 <= age <= .200 and accepted:
                self.receipt = (key, dict(target), began)
                self._note("query-positive", began, rows=16)
                return self.receipt
            result = report.get("result")
            reasons = {"identity-before","identity-after","native-before","native-final",
                       "uia-root-identity","uia-root-unavailable","provider-facts",
                       "provider-child","provider-sibling","element-cap","depth-cap"}
            reason = result.get("reason") if isinstance(result,dict) else None
            rows = result.get("elements") if isinstance(result,dict) else None
            code = ("probe-closed" if self.closed else "query-stale" if age < 0 or age > .200
                    else "native-"+reason if reason in reasons else "native-identity-rejected"
                    if report.get("nativeIdentityBeforeAndAfter") is not True else "tree-incomplete"
                    if not isinstance(result,dict) or result.get("complete") is not True else "shape-rejected")
            self._note(code, began, rows=len(rows) if isinstance(rows,list) else None)
            return None
        except asyncio.CancelledError:
            self._note("caller-cancelled", began)
            await self._stop_process()
            raise
        except asyncio.TimeoutError as error:
            self._failure(stage+"-timeout", began, error)
            await self._stop_process()
            return None
        except Exception as error:
            self._failure(stage+"-error", began, error)
            await self._stop_process()
            return None
        finally:
            self.query_task = None

    def current(self, key, target):
        receipt = self.receipt
        return bool(not self.closed and not self.retiring and receipt and receipt[0]==key and receipt[1]==target
                    and 0 <= self.clock()-receipt[2] < MAX_AGE)

    async def _stop_process(self):
        self.receipt = None
        process = self.process
        if process is None:
            return True
        self.retiring = True
        if process.returncode is None:
            try:
                process.kill()
            except ProcessLookupError:
                pass
            except OSError as error:
                self._note("stop-unconfirmed", error=error)
                return False
        try:
            await asyncio.wait_for(process.wait(), .500)
        except asyncio.TimeoutError:
            self._note("stop-unconfirmed")
            return False  # Keep the owned handle; never start a second worker.
        if self.process is process:
            self.process = None
            self.retiring = False
        return True

    async def close(self):
        self.closed = True
        self.receipt = None
        # query_task is the LC monitor/caller, not a disposable worker task.
        if self.start_task and self.start_task is not asyncio.current_task() and not self.start_task.done():
            self.start_task.cancel()
        await self._stop_process()

    def retire(self):
        self.closed = True
        self.receipt = None
        process = self.process
        if process is not None and process.returncode is None:
            try:
                process.kill()
            except ProcessLookupError:
                pass
        asyncio.create_task(self.close())
