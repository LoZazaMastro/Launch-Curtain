"""Full production monitor + hide/reset, with only OS/clock boundaries replaced."""
import ast,asyncio,importlib.util,os,unittest
from pathlib import Path
from types import SimpleNamespace
SOURCE=Path(__file__).parents[1]/'main.py'
spec=importlib.util.spec_from_file_location('actual_first_content',SOURCE.parent/'helpers/first_content.py')
actor_module=importlib.util.module_from_spec(spec);spec.loader.exec_module(actor_module)
def fixture(path=SOURCE,*,release=True,min_visible=.5,settle=.7,stable=3.,elapsed=10.,sound=False):
 names={'_monitor_foreground','_modern_launch_retirement_due','_finish_modern_launch','hide_curtain','_reset_launch_state','_restore_modern_launcher_windows','get_status','_modern_underlay_close_reason'}
 tree=ast.parse(path.read_text(encoding='utf-8-sig'));methods=[m for c in tree.body if isinstance(c,ast.ClassDef) and c.name=='Plugin' for m in c.body if isinstance(m,(ast.FunctionDef,ast.AsyncFunctionDef)) and m.name in names]
 calls=[];clock=SimpleNamespace(now=200.,mono=200.);b=None;ticks=0
 async def no(*args,**kwargs):pass
 async def false(*args,**kwargs):return False
 async def sleep(delay):
  nonlocal ticks
  ticks+=1;calls.append(('sleep',delay))
  if ticks>=2:b.settings['auto_mode']=False
 def forbidden(*args,**kwargs):raise AssertionError('No focus/input/game activation permitted')
 scope=dict(os=os,time=SimpleNamespace(time=lambda:clock.now,monotonic=lambda:clock.mono),asyncio=SimpleNamespace(sleep=sleep),
  _process_snapshot=lambda:{7:dict(process='game.exe'),1:dict(process='steam.exe')},
  _foreground_window=lambda:dict(hwnd=11,pid=7,process='game.exe'),_async_key_down=lambda key:False,_is_windows=lambda:True,
  _log_info=lambda text:calls.append(('log',text)),_log_warning=lambda text:calls.append(('warning',text)),
  _process_started_at=lambda pid:80.,_process_image_path=lambda pid:'game.exe',
  DEFAULT_SETTINGS={'launcher_processes':[],'game_settle_seconds':.7},MODERN_PRESENTED_STABLE_SECONDS=.35,
  _window_is_fullscreen=forbidden,_focus_window=forbidden,_focus_game_window_for_handoff=forbidden)
 module=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0),ast.ClassDef(name='Backend',bases=[],keywords=[],body=methods,decorator_list=[])],type_ignores=[])
 exec(compile(ast.fix_missing_locations(module),str(path),'exec'),scope);b=scope['Backend']()
 for method in methods:
  for node in ast.walk(method):
   if isinstance(node,ast.Attribute) and isinstance(node.value,ast.Name) and node.value.id=='self' and not hasattr(b,node.attr):setattr(b,node.attr,0)
 b.settings=dict(auto_mode=True,curtain_mode='modern',min_visible_seconds=min_visible,game_settle_seconds=settle)
 for k,v in dict(modern_active=True,modern_started_at=clock.now-elapsed,current_launch_mode='modern',modern_underlay_active=False,
  current_launch_app_id=123,launch_request_started_at=100.,launch_request_confirmed=True,modern_launch_processes={},known_processes={7:{}},
  modern_underlay_identity=None,modern_presented_probe=((123,7,80.,'game.exe',11),clock.mono-stable),
  current_launch_game_settle_seconds=None,modern_escape_down=False,native_prompt_visible=False,launch_pending_until=1000.,
  launch_game_candidates={7:dict(birth=80.,image='game.exe')},active_game_pids={7:80.},
  modern_hidden_launcher_windows={},modern_steam_topmost_hwnd=99,loading_progress_probe=None,pending_steam_refocus_until=0.,pending_steam_refocus_not_before=0.).items():setattr(b,k,v)
 b._monitor_has_work=lambda:True;b._monitor_exit_tracking_only=lambda:False
 b._poll_verified_uwp_launch=no;b._monitor_process_launches=no;b._poll_loading_progress=no;b._release_unconfirmed_modern_launch=false
 b._restore_steam_focus_after_game_exit=no;b._modern_foreground_release_reason=lambda *args:'tracked root game surface is visible and foreground-stable'
 def unpin(reason,**kwargs):calls.append(('unpin',kwargs));b.modern_steam_topmost_hwnd=0 if release else 99;return release
 b._release_modern_steam_topmost=unpin;b._soundbite_blocks_curtain_close=lambda:sound
 b._is_curtain_running=lambda:False;b._find_any_tracked_game_window=forbidden;b._soundbite_is_playing=lambda:False
 b._stop_soundbite_player=lambda *args:calls.append(('audio stopped',))
 async def stop(*args):calls.append(('overlay stopped',));b.settings['auto_mode']=False
 b._stop_overlay_process=stop
 async def black():calls.append(('black stopped',))
 b.hide_black_cover=black
 async def publish(body):calls.append(('native publish',body));return None
 actor=actor_module.FirstContent(lambda *args:None,publish);actor.begin(123,'epoch','main-owner',100000);actor.receipt={'nonce':'a'*32}
 b.first_content_actor=actor;b._first_content_actor=lambda:actor
 return b,calls,clock

class CompleteRetirement(unittest.IsolatedAsyncioTestCase):
 async def run_monitor(self,**kwargs):
  b,c,t=fixture(**kwargs);await asyncio.wait_for(b._monitor_foreground(),2)
  self.assertFalse(any(x[0]=='warning' and 'Monitor tick failed' in x[1] for x in c),c)
  return b,c,t
 async def test_full_monitor_after_qualifies_unpins_closes_and_preserves_exit_tracking(self):
  b,c,t=await self.run_monitor()
  self.assertFalse(b.modern_active);self.assertFalse(b.modern_underlay_active);self.assertEqual(b.modern_steam_topmost_hwnd,0)
  self.assertIn(('overlay stopped',),c);self.assertIn(('black stopped',),c);self.assertIn(('audio stopped',),c)
  self.assertIsNone(b.first_content_actor.receipt);self.assertIsNone(b.first_content_actor.launch)
  self.assertEqual(b.active_game_pids,{7:80.});self.assertEqual(b.pending_steam_refocus_until,0.)
  status=await b.get_status();self.assertFalse(status['modern_curtain_show']);self.assertTrue(status['modern_launch_confirmed'])
  self.assertEqual((status['modern_launch_app_id'],status['modern_launch_started_at'],status['modern_launch_owner'],status['modern_launch_trigger']),(123,100.,'main-owner',100000))
 async def test_actual_old_monitor_retains_passive_cover_for_whole_game(self):
  path=os.environ.get('PLAYHUB_LC_RETIRE_BEFORE')
  if not path:self.skipTest('before fixture not supplied')
  b,c,t=fixture(Path(path));await asyncio.wait_for(b._monitor_foreground(),2)
  self.assertTrue(b.modern_active);self.assertTrue(b.modern_underlay_active);self.assertNotIn(('overlay stopped',),c)
 async def test_exact_unpin_failure_keeps_current_launch(self):
  b,c,t=await self.run_monitor(release=False);self.assertTrue(b.modern_active);self.assertFalse(b.modern_underlay_active);self.assertNotIn(('overlay stopped',),c)
 async def test_configured_thresholds_and_soundbite_hold_without_entering_permanent_underlay(self):
  for kwargs in [dict(min_visible=2.,elapsed=1.99),dict(settle=2.,stable=1.99),dict(stable=.34),dict(sound=True),dict(stable=-1.),dict(elapsed=-1.)]:
   with self.subTest(kwargs=kwargs):
    b,c,t=await self.run_monitor(**kwargs);self.assertTrue(b.modern_active);self.assertFalse(b.modern_underlay_active);self.assertNotIn(('overlay stopped',),c)
 async def test_per_game_exit_delay_overrides_global_without_using_max_timeout(self):
  b,c,t=fixture(settle=50.,stable=1.);b.current_launch_game_settle_seconds=.5;b.settings['curtain_timeout']=50
  await asyncio.wait_for(b._monitor_foreground(),2);self.assertFalse(b.modern_active)
 async def test_no_configured_or_unknown_probe_is_not_a_completion_claim(self):
  b,c,t=fixture();b.modern_presented_probe=None;self.assertFalse(b._modern_launch_retirement_due())
 async def test_terminal_tombstone_survives_reset_and_throttled_main_until_new_launch(self):
  b,c,t=await self.run_monitor();t.now+=3600;t.mono+=3600
  status=await b.get_status();self.assertEqual(status['modern_launch_trigger'],100000)
  b.modern_terminal_launch=None;status=await b.get_status();self.assertIsNone(status['modern_launch_owner'])
  self.assertIn('self.modern_terminal_launch = None',SOURCE.read_text(encoding='utf-8-sig'))
if __name__=='__main__':unittest.main()
