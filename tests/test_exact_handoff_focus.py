"""Owned launch activation with an inert Win32 boundary and actual production bodies."""
import ast, ctypes, os, types, unittest
from ctypes import wintypes
from pathlib import Path
SOURCE = Path(__file__).parents[1] / "main.py"

class Fn:
 def __init__(self, fn): self.fn = fn
 def __call__(self, *args): return self.fn(*args)
def number(value): return int(getattr(value, "value", value) or 0)

class Boundary:
 def __init__(self):
  self.events=[];self.attached=[];self.queue=False;self.foreground=99;self.focus=99;self.allowed=True
  self.minimized=False;self.action_raises=None;self.attach_fail=None;self.detach_fail=False;self.lose_focus_on_detach=False
  self.after_event=None;self.styles={99:33816576,11:8};self.next_windows={11:33,33:99};self.owner=0;self.moves=0
  self.births={7:700,5:500};self.images={7:'C:/game.exe',5:'C:/steam.exe'};self.pids={11:7,99:5};self.threads={11:70,99:50};self.classes={11:'Game',99:'Steam'}
 def event(self,name,*args):
  self.events.append((name,*args))
  if self.after_event:self.after_event(name,args)
 def attach(self, current, other, active):
  current,other,active=number(current),number(other),bool(active);self.event('attach',current,other,active)
  if active:
   if not self.queue or self.attach_fail==other:return 0
   self.attached.append(other);return 1
  if other in self.attached:self.attached.remove(other)
  if self.lose_focus_on_detach:self.foreground=self.focus=99
  return int(not self.detach_fail)
 def peek(self,*args): self.queue=True;self.event('peek');return 0
 def action(self,name,hwnd):
  self.event(name,number(hwnd))
  if self.action_raises==name:raise RuntimeError('controlled native failure')
  if name=='foreground' and self.queue and set(self.attached)=={70,50}:self.foreground=11
  if name=='focus' and self.foreground==11:self.focus=11
  return 1
 def sleep(self,seconds):
  assert not self.attached,('queue attachment escaped native activation',self.events)
  self.event('sleep',seconds)
 def fg(self):return {'hwnd':self.foreground,'pid':self.pids.get(self.foreground,8),'process':'steam.exe' if self.foreground==99 else 'game.exe' if self.foreground==11 else 'other.exe'}
 def getwindow(self,hwnd,command):
  self.event('getwindow',number(hwnd),command)
  return self.owner if command==4 else self.next_windows.get(number(hwnd),0)
 def move(self,*args): self.moves+=1;self.event('move');self.styles[99]=33816576;self.next_windows={11:99};return 1
 def load(self):
  tree=ast.parse(SOURCE.read_text(encoding='utf-8-sig'))
  names={'_focus_game_window_for_handoff','_set_owned_window_behind_game'}
  methods=[x for x in tree.body if isinstance(x,ast.FunctionDef) and x.name in names]
  assert len(methods)==2
  u=types.SimpleNamespace(IsIconic=Fn(lambda h:self.minimized),IsWindow=Fn(lambda h:number(h) in (11,99)),GetWindow=Fn(self.getwindow),SetWindowPos=Fn(self.move),AttachThreadInput=Fn(self.attach),PeekMessageW=Fn(self.peek))
  for native,name in [('BringWindowToTop','bring'),('SetForegroundWindow','foreground'),('SetActiveWindow','active'),('SetFocus','focus')]:setattr(u,native,Fn(lambda h,n=name:self.action(n,h)))
  c=types.SimpleNamespace(windll=types.SimpleNamespace(user32=u,kernel32=types.SimpleNamespace(GetCurrentThreadId=Fn(lambda:40))),POINTER=ctypes.POINTER,byref=ctypes.byref,c_int=ctypes.c_int,c_uint=ctypes.c_uint)
  g={'ctypes':c,'wintypes':wintypes,'time':types.SimpleNamespace(sleep=self.sleep),'os':os,'_int_or_zero':number,'_is_windows':lambda:True,'_window_has_input_focus':lambda h:self.foreground==h and self.focus==h,'_window_pid':lambda h:self.pids.get(h,0),'_window_is_root':lambda h:h in (11,99),'_process_created_filetime':lambda p:self.births.get(p,0),'_process_image_path':lambda p:self.images.get(p,''),'_window_class_name':lambda h:self.classes.get(h,''),'_window_thread_id':lambda h:self.threads.get(h,0),'_foreground_window':self.fg,'STEAM_PROCESS_NAMES':{'steam.exe','steamwebhelper.exe'},'_window_extended_style':lambda h:self.styles.get(h,0),'SWP_NOMOVE':2,'SWP_NOSIZE':1,'SWP_NOACTIVATE':16,'SWP_NOOWNERZORDER':512}
  mod=ast.Module(body=[ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0),*methods],type_ignores=[])
  exec(compile(ast.fix_missing_locations(mod),str(SOURCE),'exec'),g);return g
 def activate(self):return self.load()['_focus_game_window_for_handoff'](11,7,allow_focus=lambda:self.allowed)
 def release(self,current=None):return self.load()['_set_owned_window_behind_game'](99,11,current or(lambda:self.allowed))

class ExactFocusTests(unittest.TestCase):
 def test_denied_plain_foreground_becomes_one_owned_activation(self):
  b=Boundary();self.assertTrue(b.activate());self.assertEqual((b.foreground,b.focus),(11,11));self.assertEqual(sum(e[0]=='foreground' for e in b.events),1);self.assertFalse(b.attached)
  attachments=[e for e in b.events if e[0]=='attach'];self.assertEqual(attachments,[('attach',40,70,True),('attach',40,50,True),('attach',40,50,False),('attach',40,70,False)])
  self.assertLess(next(i for i,e in enumerate(b.events) if e[0]=='peek'),next(i for i,e in enumerate(b.events) if e[0]=='attach'))
  self.assertGreater(next(i for i,e in enumerate(b.events) if e[0]=='sleep'),max(i for i,e in enumerate(b.events) if e[0]=='attach'))
 def test_already_focused_has_no_native_side_effect(self):
  b=Boundary();b.foreground=b.focus=11;self.assertTrue(b.activate());self.assertEqual(b.events,[])
 def test_cancelled_has_no_native_side_effect(self):
  b=Boundary();b.allowed=False;self.assertFalse(b.activate());self.assertEqual(b.events,[])
 def test_minimized_game_stays_minimized(self):
  b=Boundary();b.minimized=True;self.assertFalse(b.activate());self.assertEqual(b.events,[])
 def test_foreign_foreground_not_stolen(self):
  b=Boundary();b.foreground=88;self.assertFalse(b.activate());self.assertEqual(b.events,[])
 def test_unknown_identity_fails_closed(self):
  for name,key,value in [('births',7,0),('images',7,''),('classes',11,''),('threads',11,0),('births',5,0),('images',5,''),('classes',99,''),('threads',99,0)]:
   with self.subTest(name=name,key=key):
    b=Boundary();getattr(b,name)[key]=value;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertFalse(any(e[0]=='foreground' for e in b.events))
 def test_queue_created_but_authority_revoked_before_join(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'allowed',False) if n=='peek' else None;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertFalse(any(e[0]=='attach' for e in b.events))
 def test_second_attach_failure_detaches_first(self):
  b=Boundary();b.attach_fail=50;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertIn(('attach',40,70,False),b.events);self.assertFalse(any(e[0]=='foreground' for e in b.events))
 def test_native_action_exception_still_detaches_both(self):
  for action in ['bring','foreground','active','focus']:
   with self.subTest(action=action):
    b=Boundary();b.action_raises=action;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertIn(('attach',40,50,False),b.events);self.assertIn(('attach',40,70,False),b.events)
 def test_prompt_mid_attach_detaches_without_foreground_request(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'allowed',False) if n=='attach' and a[-1] else None;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertFalse(any(e[0]=='foreground' for e in b.events))
 def test_replaced_process_or_window_cannot_receive_focus(self):
  for name,key,value in [('births',7,701),('images',7,'C:/replacement.exe'),('pids',11,8),('classes',11,'Changed'),('threads',11,71),('births',5,501),('images',5,'C:/imposter.exe'),('pids',99,8),('classes',99,'Changed'),('threads',99,51)]:
   with self.subTest(name=name,key=key):
    b=Boundary()
    def mutate(n,a):
     if n=='peek':getattr(b,name)[key]=value
    b.after_event=mutate;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertFalse(any(e[0]=='foreground' for e in b.events))
 def test_foreign_window_appearing_during_join_is_not_stolen(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'foreground',88) if n=='attach' and a[-1] else None;self.assertFalse(b.activate());self.assertFalse(b.attached);self.assertFalse(any(e[0]=='foreground' for e in b.events))
 def test_focus_lost_after_detach_is_not_success(self):
  b=Boundary();b.lose_focus_on_detach=True;self.assertFalse(b.activate());self.assertFalse(b.attached)
 def test_detach_failure_is_not_success(self):
  b=Boundary();b.detach_fail=True;self.assertFalse(b.activate());self.assertFalse(b.attached)
 def test_prompt_during_readback_is_not_success(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'allowed',False) if n=='sleep' else None;self.assertFalse(b.activate());self.assertFalse(b.attached)
 def test_no_callback_retains_legacy_single_foreground_attempt(self):
  b=Boundary();self.assertFalse(b.load()['_focus_game_window_for_handoff'](11,7));self.assertEqual([e[0] for e in b.events],['foreground','sleep'])

class ExactRetirementTests(unittest.TestCase):
 def test_topmost_game_with_steam_already_below_is_success_without_write(self):
  b=Boundary();self.assertTrue(b.release());self.assertEqual(b.moves,0);self.assertEqual(b.styles[11],8)
 def test_topmost_game_wrong_order_does_not_mutate(self):
  b=Boundary();b.next_windows={11:33};self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_unknown_steam_style_is_not_positive_retirement(self):
  b=Boundary();b.styles[99]=0;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_still_topmost_steam_does_not_borrow_topmost_game(self):
  b=Boundary();b.styles[99]|=8;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_owned_game_not_used_for_retirement(self):
  b=Boundary();b.owner=44;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_cancel_during_order_read_fails_closed(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'allowed',False) if n=='getwindow' and a[-1]==2 else None;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_steam_becoming_topmost_during_order_read_cannot_retire(self):
  b=Boundary();b.after_event=lambda n,a:b.styles.update({99:33816584}) if n=='getwindow' and a[-1]==2 else None;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_game_gaining_an_owner_during_order_read_cannot_retire(self):
  b=Boundary();b.after_event=lambda n,a:setattr(b,'owner',44) if n=='getwindow' and a[-1]==2 else None;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_mutating_non_topmost_case_keeps_original_path(self):
  b=Boundary();b.styles[11]=0;b.styles[99]|=8;b.next_windows={11:33};self.assertTrue(b.release());self.assertEqual(b.moves,1)
 def test_false_current_does_not_mutate(self):
  b=Boundary();b.allowed=False;self.assertFalse(b.release());self.assertEqual(b.moves,0)
 def test_unbounded_or_cyclic_order_has_no_false_success(self):
  b=Boundary();b.next_windows={11:33,33:11};self.assertFalse(b.release());self.assertEqual(b.moves,0)

if __name__=='__main__':unittest.main()
