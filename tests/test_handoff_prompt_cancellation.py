"""Actual handoff policy and monitor with fake OS boundaries; no native side effects."""
import ast,asyncio,ctypes,os,types,unittest
from ctypes import wintypes
from pathlib import Path
SOURCE=Path(__file__).parents[1]/"main.py"

async def _controlled_owned_handoff_flow(prompt=False):
 source=SOURCE;tree=ast.parse(source.read_text(encoding='utf-8-sig'));cls=next(x for x in tree.body if isinstance(x,ast.ClassDef) and x.name=='Plugin')
 method_names={'_monitor_foreground','_launch_process_is_current','_launch_handoff_allowed','_modern_presented_game_ready','_modern_foreground_release_reason','_modern_loading_target_possible','_modern_launch_retirement_due'}
 methods=[x for x in cls.body if isinstance(x,(ast.FunctionDef,ast.AsyncFunctionDef)) and x.name in method_names]
 natives=[x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name=='_focus_game_window_for_handoff'];assert len(methods)==len(method_names) and len(natives)==1

 clock={'wall':10.,'mono':10.,'ticks':0};fg={'hwnd':99,'pid':5,'process':'steam.exe','title':'Steam'};calls=[];backend=None
 class NativeFn:
  def __init__(self,fn):self.fn=fn
  def __call__(self,*args):return self.fn(*args)
 def activate(hwnd):
  calls.append(('activate',int(getattr(hwnd,'value',hwnd)),bool(backend.native_prompt_visible),clock['mono']));fg.update(hwnd=int(getattr(hwnd,'value',hwnd)),pid=7,process='game.exe',title='Game');return 1
 # Native queue functions are inert; the actual production helper is retained.
 user32=types.SimpleNamespace(IsIconic=NativeFn(lambda hwnd:False),SetForegroundWindow=NativeFn(activate),AttachThreadInput=NativeFn(lambda current,other,active:1),PeekMessageW=NativeFn(lambda *args:0),BringWindowToTop=NativeFn(lambda hwnd:1),SetActiveWindow=NativeFn(lambda hwnd:1),SetFocus=NativeFn(lambda hwnd:1))
 snapshot={7:{'process':'game.exe'},5:{'process':'steam.exe'}}
 async def sleep(seconds):
  clock['ticks']+=1;clock['wall']+=max(float(seconds),.05);clock['mono']+=max(float(seconds),.05)
  if prompt and clock['ticks']==3:backend.native_prompt_visible=False;calls.append(('prompt-dismissed',clock['mono']))
  if clock['ticks']>=25:backend.settings['auto_mode']=False
 async def nothing(*args,**kw):pass
 async def false(*args,**kw):return False
 def presented(hwnd,pid,require_foreground=False):
  return (0,0,1920,1080,'Game') if(hwnd,pid)==(11,7) and(not require_foreground or fg['hwnd']==11 and fg['pid']==7) else None
 scope={'os':os,'time':types.SimpleNamespace(time=lambda:clock['wall'],monotonic=lambda:clock['mono'],sleep=lambda seconds:None),'asyncio':types.SimpleNamespace(sleep=sleep),'ctypes':types.SimpleNamespace(windll=types.SimpleNamespace(user32=user32,kernel32=types.SimpleNamespace(GetCurrentThreadId=NativeFn(lambda:40))),POINTER=ctypes.POINTER,byref=ctypes.byref),'wintypes':wintypes,
 'STEAM_PROCESS_NAMES':{'steam.exe','steamwebhelper.exe'},'DEFAULT_SETTINGS':{'launcher_processes':[],'game_settle_seconds':0.,'timeout_enabled':False},'MODERN_UNKNOWN_TARGET_SECONDS':8.,'MODERN_PRESENTED_STABLE_SECONDS':.35,'MODERN_FAIL_OPEN_SECONDS':75.,'LAUNCHER_TITLE_HINTS':[],
 '_int_or_zero':int,'_is_windows':lambda:True,'_window_pid':lambda hwnd:7 if hwnd==11 else 5 if hwnd==99 else 0,'_window_is_root':lambda hwnd:hwnd in (11,99),'_process_created_filetime':lambda pid:700 if pid==7 else 500 if pid==5 else 0,'_window_thread_id':lambda hwnd:70 if hwnd==11 else 50 if hwnd==99 else 0,'_window_class_name':lambda hwnd:'Game' if hwnd==11 else 'Steam' if hwnd==99 else '','_process_started_at':lambda pid:1. if pid==5 else 2. if pid==7 else 0.,'_process_image_path':lambda pid:'C:/game.exe' if pid==7 else 'C:/steam.exe',
 '_windows_for_pid':lambda pid,limit:[11] if pid==7 else [99], '_presented_game_window':presented,'_window_has_input_focus':lambda hwnd:fg['hwnd']==hwnd,'_foreground_window':lambda:dict(fg),'_process_snapshot':lambda:dict(snapshot),'_async_key_down':lambda key:False,'_window_is_fullscreen':lambda hwnd:hwnd==11,'_modern_handoff_settle_seconds':lambda process,settle:0.,'_log_info':lambda value:None,'_log_warning':lambda value:calls.append(('warning',value))}
 mod=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0),*natives,ast.ClassDef(name='Actual',bases=[],keywords=[],body=methods,decorator_list=[])],type_ignores=[]);exec(compile(ast.fix_missing_locations(mod),str(source),'exec'),scope)
 backend=scope['Actual']();backend.settings={'auto_mode':True,'curtain_mode':'modern','min_visible_seconds':.1,'game_settle_seconds':0.,'timeout_enabled':False}
 attrs={'modern_active':True,'modern_started_at':1.,'modern_release_after':9.,'modern_handoff_pid':7,'modern_handoff_hwnd':11,'current_launch_mode':'modern','current_launch_game_settle_seconds':0.,'modern_escape_down':False,'native_prompt_visible':prompt,'game_seen_since':1.,'last_modern_cover_refocus_at':0.,'launch_pending_until':20.,'modern_handoff_attempts':set(),'current_launch_app_id':123,'launch_request_started_at':1.,'modern_steam_topmost_hwnd':99,'modern_hidden_launcher_windows':{},'modern_launch_processes':{},'modern_presented_probe':None,'active_game_pids':{},'launch_game_candidates':{7:{'birth':2.,'image':'C:/game.exe','process':'game.exe','app_id':123}}}
 for key,value in attrs.items():setattr(backend,key,value)
 backend._monitor_has_work=lambda:True;backend._monitor_exit_tracking_only=lambda:False;backend._poll_verified_uwp_launch=nothing;backend._monitor_process_launches=nothing;backend._poll_loading_progress=nothing;backend._release_unconfirmed_modern_launch=false;backend._restore_steam_focus_after_game_exit=nothing
 backend._find_fullscreen_game_window=lambda *args:{'pid':7,'hwnd':11,'process':'game.exe','ready_kind':'fullscreen'}
 backend._soundbite_blocks_curtain_close=lambda:False;backend._protect_modern_curtain=lambda *args:None;backend._is_curtain_running=lambda:False
 def release(reason,*args,**kw):calls.append(('release',reason,clock['mono']));backend.modern_steam_topmost_hwnd=0;return True
 backend._release_modern_steam_topmost=release
 async def finish():
  assert(fg['hwnd'],fg['pid'])==(11,7);assert backend.modern_presented_probe is not None;assert backend._modern_launch_retirement_due();calls.append(('terminal-after-verified-foreground',clock['mono']));backend.modern_active=False;backend.settings['auto_mode']=False
 backend._finish_modern_launch=finish
 async def hide(**kw):calls.append(('unexpected-hide',kw));backend.modern_active=False;backend.settings['auto_mode']=False
 backend.hide_curtain=hide
 await backend._monitor_foreground()
 assert not any(c[0]=='warning' for c in calls),calls
 activations=[c for c in calls if c[0]=='activate'];assert len(activations)==1,('one accepted activation only',calls);assert activations[0][2] is False,('prompt must veto activation',calls)
 assert sum(c[0]=='terminal-after-verified-foreground' for c in calls)==1,calls
 assert backend.modern_active is False and fg['hwnd']==11
 return{'promptInitiallyVisible':prompt,'activations':len(activations),'terminalOnlyAfterForegroundProof':True,'calls':calls}

def _guard_fixture():
 tree=ast.parse(SOURCE.read_text(encoding='utf-8-sig'));cls=next(x for x in tree.body if isinstance(x,ast.ClassDef) and x.name=='Plugin')
 methods=[x for x in cls.body if isinstance(x,ast.FunctionDef) and x.name in {'_launch_process_is_current','_launch_handoff_allowed'}]
 fg={'hwnd':99,'pid':5,'process':'steam.exe'};births={5:1.,7:2.};images={7:'C:/game.exe'}
 scope={'os':os,'STEAM_PROCESS_NAMES':{'steam.exe','steamwebhelper.exe'},'_process_started_at':lambda pid:births.get(pid,0),'_process_image_path':lambda pid:images.get(pid,''),'_windows_for_pid':lambda pid,limit:[11] if pid==7 else [99], '_presented_game_window':lambda hwnd,pid:(0,0,1920,1080,'Game') if(hwnd,pid)==(11,7) else None,'_foreground_window':lambda:dict(fg)}
 mod=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0),ast.ClassDef(name='Actual',bases=[],keywords=[],body=methods,decorator_list=[])],type_ignores=[]);exec(compile(ast.fix_missing_locations(mod),str(SOURCE),'exec'),scope)
 b=scope['Actual']();b.modern_active=True;b.native_prompt_visible=False;b.current_launch_app_id=123;b.launch_request_started_at=10.;b.launch_game_candidates={7:{'birth':2.,'image':'C:/game.exe','process':'game.exe','app_id':123}}
 origin={'hwnd':99,'pid':5,'process':'steam.exe','birth':1.};snapshot={7:{'process':'game.exe'},5:{'process':'steam.exe'}}
 return b,fg,births,scope,origin,snapshot

class HandoffCancellationTests(unittest.TestCase):
 def test_exact_current_owned_game_from_retained_steam_foreground_is_allowed(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture();self.assertTrue(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_native_user_prompt_vetoes_activation(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture();b.native_prompt_visible=True;self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_retired_curtain_cannot_activate_a_game(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture();b.modern_active=False;self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_replaced_game_pid_cannot_activate(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture();births[7]=3.;self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_foreign_user_foreground_is_not_stolen(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture();fg.update(hwnd=88,pid=8,process='other.exe');self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_prompt_appearing_during_final_native_query_revokes_activation(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture()
  def read(pid):
   if pid==5:b.native_prompt_visible=True
   return births.get(pid,0)
  scope['_process_started_at']=read;self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))
 def test_cancellation_during_final_native_query_revokes_activation(self):
  b,fg,births,scope,origin,snapshot=_guard_fixture()
  def read(pid):
   if pid==5:b.modern_active=False
   return births.get(pid,0)
  scope['_process_started_at']=read;self.assertFalse(b._launch_handoff_allowed(11,7,snapshot,origin))

class FullMonitorHandoffTests(unittest.IsolatedAsyncioTestCase):
 async def test_one_exact_activation_then_foreground_stable_terminal(self):
  await _controlled_owned_handoff_flow(False)
 async def test_prompt_preserves_one_activation_budget_until_dismissed(self):
  await _controlled_owned_handoff_flow(True)

if __name__=="__main__":unittest.main()
