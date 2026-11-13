import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const file = fs.readFileSync(process.env.PLAYHUB_LC_SOURCE || new URL('../src/PlayButtonLaunchHook.ts', import.meta.url), 'utf8');
const text = file.slice(file.indexOf('class NativeSteamLaunchProgress'), file.indexOf('// Hook del pulsante Play'));
const ctx=vm.createContext({ Number, Array, Error });
vm.runInContext(text+'\nglobalThis.Gate=NativeSteamLaunchProgress;',ctx);
let checks=0;
function fixture() {
  let now=1000, unregisters=0, yields=0; const callbacks={}, replies=[];
  const apps={GetGameActionDetails:(id,callback)=>replies.push({id,callback})};
  for(const suffix of ['Start','End','UserRequest','ShowUI','ShowError','TaskChange']) apps['RegisterForGameAction'+suffix]=callback=>{
    callbacks[suffix]=callback;return {unregister:()=>{unregisters++;}};
  };
  const source={sent:true,launch:{appId:42,triggerAt:1234,owner:'owned'}};
  const owner={patchedApps:apps, instanceId:'owned', instantCurtainVisible:true, isModernMode:()=>true,
    activeInstantAppId:42,lastTriggerAt:1234,modernHandoffGeneration:5,
    firstContentSource:{held:source,current:()=>true},extractAppIdFromUnknown:value=>value==='game42'?42:999,
    readReactAppId:()=>42};
  owner.suspendInstantCurtainForPrompt=()=>{yields++};
  const keys=['GameLaunchingDialog','Layout','LeftColumn','RightColumn','PortraitContainer','GameName','StatusWrapper','Launching','OpenSteamButton'];
  const classes=Object.fromEntries(keys.map(key=>[key,key]));
  const action={classList:{contains:key=>key==='OpenSteamButton'}};
  const portrait={querySelectorAll:()=>[]};
  const prompt={classList:{contains:key=>key==='GameLaunchingDialog'}, contains:node=>node===action,
    querySelector:selector=>selector.includes('PortraitContainer')?portrait:null,
    querySelectorAll:()=>[{}]};
  const gate=new ctx.Gate(owner,apps,()=>now,()=>classes);
  assert.equal(gate.start(),true);
  const details={strActionName:'LaunchApp',strTaskName:'CreatingProcess',bWaitingForUI:false,gameid:'game42',nGameActionID:9};
  const begin=()=>callbacks.Start(9,'game42','LaunchApp');
  const reply=(extra={})=>replies.at(-1).callback({...details,...extra});
  return {gate,owner,source,apps,callbacks,replies,prompt,action,classes,details,begin,reply,
    tick:value=>{now+=value},setNow:value=>{now=value},unregisters:()=>unregisters,yields:()=>yields};
}
function test(name,run){run();checks++;console.log('PASS '+name)}
test('native passive action + exact popup + retained original Main permits only the progress distinction',()=>{
  const f=fixture();assert.equal(f.gate.allow(f.prompt,[f.action]),false);f.begin();f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),true);
});
for(const task of ['UpdatingAppInfo','UpdatingDRM','GettingLegacyKey','SynchronizingCloud','VerifyingFiles','CreatingProcess','WaitingGameWindow','DownloadingDepots','DownloadingWorkshop','ProcessingShaderCache','DelayLaunch','CheckShaderDepotManifest','RunningInstallScript','SynchronizingStats','ShowInterstitials','SynchronizingControllerConfig','ShowNoControllerConfig','SiteLicenseSeatCheckout'])
  test('native passive task '+task,()=>{const f=fixture();f.begin();f.reply({strTaskName:task});assert.equal(f.gate.allow(f.prompt,[f.action]),true)});
for(const extra of [{bWaitingForUI:undefined},{strTaskName:'ShowEula'},
  {strTaskName:''},{strActionName:'InstallApp'},{strError:'error'},{gameid:'foreign'},{nGameActionID:10}])
  test('required/unknown/foreign native action yields '+JSON.stringify(extra),()=>{const f=fixture();f.begin();f.reply(extra);assert.equal(f.gate.allow(f.prompt,[f.action]),false)});
for(const suffix of ['ShowError'])
  test('native '+suffix+' revokes before the next DOM poll',()=>{const f=fixture();f.begin();f.reply();f.callbacks[suffix](9);assert.equal(f.gate.allow(f.prompt,[f.action]),false);assert.equal(f.yields(),suffix==='End'?0:1)});
for(const mutate of [f=>f.owner.lastTriggerAt++,f=>f.owner.activeInstantAppId=99,f=>f.owner.modernHandoffGeneration++,
  f=>f.owner.instanceId='foreign',f=>f.owner.promptSuspended=true,f=>f.owner.instantCurtainVisible=false,
  f=>f.owner.isModernMode=()=>false,f=>f.owner.patchedApps={},f=>f.owner.firstContentSource.held={...f.source},
  f=>f.owner.firstContentSource.current=()=>false,f=>f.source.sent=false])
  test('request/renderer lifetime drift refuses an otherwise current native callback',()=>{const f=fixture();f.begin();mutate(f);f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),false)});
test('late same-app reply cannot attach to a replacement launch',()=>{
  const f=fixture();f.begin();const old=f.replies[0];f.owner.modernHandoffGeneration++;f.begin();
  old.callback(f.details);assert.equal(f.gate.allow(f.prompt,[f.action]),false);f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),true);
});
test('callback latency never relabels old work as fresh',()=>{const f=fixture();f.begin();f.tick(181);f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),false)});
test('a pending query cannot renew an old fact beyond its original 200ms budget',()=>{
  const f=fixture();f.begin();f.reply();f.tick(120);assert.equal(f.gate.allow(f.prompt,[f.action]),true);f.tick(81);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('clock reversal refuses',()=>{const f=fixture();f.begin();f.setNow(999);f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),false)});
test('unknown required native reply revokes the prior positive fact immediately',()=>{
  const f=fixture();f.begin();f.reply();f.tick(120);f.gate.allow(f.prompt,[f.action]);f.reply({bWaitingForUI:true,strTaskName:'ShowEula'});assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
for(const mutate of [f=>f.classes.StatusWrapper=undefined,f=>f.classes.Layout='bad class',f=>f.owner.readReactAppId=()=>999,
  f=>f.owner.readReactAppId=()=>undefined,f=>f.prompt.contains=()=>false,f=>f.action.classList.contains=()=>false,
  f=>f.prompt.querySelector=()=>({}),f=>f.prompt.querySelectorAll=()=>[{},{}]])
  test('unknown popup / extra actions / form / foreign app retains ordinary attention yield',()=>{
    const f=fixture();f.begin();f.reply();mutate(f);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  });
test('multiple visible actions always yield',()=>{const f=fixture();f.begin();f.reply();assert.equal(f.gate.allow(f.prompt,[f.action,f.action]),false)});
test('disposed registrations cannot reauthorize',()=>{
  const f=fixture();f.begin();const late=f.replies[0];f.gate.dispose();late.callback(f.details);f.begin();
  assert.equal(f.unregisters(),6);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('repeated Steam startup checks keep one registration owner',()=>{
  const f=fixture();f.gate.start();f.gate.start();f.gate.dispose();assert.equal(f.unregisters(),6);
});
test('native API startup absence is retried without an additional timer',()=>{
  const f=fixture();f.gate.dispose();const start=f.apps.RegisterForGameActionStart;delete f.apps.RegisterForGameActionStart;
  const gate=new ctx.Gate(f.owner,f.apps,()=>1000,()=>f.classes);assert.equal(gate.start(),false);
  f.apps.RegisterForGameActionStart=start;assert.equal(gate.start(),true);gate.dispose();assert.equal(f.unregisters(),12);
});
test('native task transition retires the previous pending callback and fact',()=>{
  const f=fixture();f.begin();const old=f.replies[0];f.reply();f.callbacks.TaskChange(9);
  old.callback(f.details);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  f.reply();assert.equal(f.gate.allow(f.prompt,[f.action]),true);
});
test('native metadata can arrive first but never authorizes before the accepted Main receipt',()=>{
  const f=fixture();f.owner.firstContentSource.held=undefined;f.begin();f.reply();
  assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  f.owner.firstContentSource.held=f.source;assert.equal(f.gate.allow(f.prompt,[f.action]),true);
});
test('old native prompt event cannot suspend a newer launch generation',()=>{
  const f=fixture();f.begin();f.owner.modernHandoffGeneration++;f.callbacks.UserRequest(9);assert.equal(f.yields(),0);
});
assert.match(file,/nativeLaunchProgress\?\.allow\(prompt, actions\) === true\) continue/);
assert.match(file,/nativeLaunchProgress\?\.dispose\(\)/);
const hookText=file.slice(file.indexOf('// Hook del pulsante Play'),file.indexOf('const playButtonHook ='));
const mainDoc={documentElement:{},querySelector:()=>null}, popupDoc={documentElement:{},querySelector:()=>null};
const popup={window:{document:popupDoc}};
const discover=vm.createContext({Map,Set,Array,Boolean,document:mainDoc,
  window:{document:mainDoc,g_PopupManager:{GetPopups:()=>[popup].values()}}});
vm.runInContext(hookText+'\nglobalThis.Hook=PlayButtonLaunchHook;',discover);
test('production discovery finds the current Steam PopupManager .window document',()=>{
  const hook=Object.create(discover.Hook.prototype),docs=hook.getAllSteamDocuments();
  assert.equal(docs.includes(popupDoc),true);assert.equal(docs.includes(mainDoc),true);
  assert.equal(docs.length,2);
});

// Exercise registered callbacks, not only the isolated allow predicate. Steam's
// actual ShowInterstitials handler can await continuation with no visible dialog.
for(const suffix of ['UserRequest','ShowUI']) {
  test('automatic '+suffix+' retains matching progress through native refresh',()=>{
    const f=fixture();f.begin();f.reply();
    f.owner.visibleSteamAttentionPrompt=()=>f.gate.allow(f.prompt,[f.action])?undefined:{prompt:f.prompt};
    f.callbacks[suffix](9,'game42','LaunchApp','ShowInterstitials','');
    f.reply({strTaskName:'ShowInterstitials',bWaitingForUI:true});
    assert.equal(f.yields(),0);assert.equal(f.gate.allow(f.prompt,[f.action]),true);
  });
  test('first actual choice during '+suffix+' yields synchronously',()=>{
    const f=fixture();f.begin();f.reply();
    f.owner.visibleSteamAttentionPrompt=()=>({prompt:{},actions:[{},{}]});
    f.callbacks[suffix](9,'game42','LaunchApp','ShowInterstitials','');
    assert.equal(f.yields(),1);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  });
  test('unknown metadata alone during '+suffix+' is not a fabricated dialog',()=>{
    const f=fixture();f.begin();f.reply();f.owner.visibleSteamAttentionPrompt=()=>undefined;
    f.callbacks[suffix](9);f.reply({strTaskName:'ShowEula',bWaitingForUI:true});
    assert.equal(f.yields(),0);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  });
  test('old '+suffix+' cannot attach to newer generation',()=>{
    const f=fixture();f.begin();f.reply();f.owner.modernHandoffGeneration++;
    f.callbacks[suffix](9);assert.equal(f.yields(),0);
  });
}
test('native waiting flag alone is not an interactive dialog',()=>{
  const f=fixture();f.begin();f.reply({bWaitingForUI:true,strTaskName:'ShowInterstitials'});
  assert.equal(f.gate.allow(f.prompt,[f.action]),true);
  assert.equal(f.gate.allow(f.prompt,[f.action,f.action]),false);
  f.prompt.querySelector=()=>({});assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('async prior metadata cannot overwrite post-event refresh',()=>{
  const f=fixture();f.begin();const old=f.replies[0];f.callbacks.UserRequest(9);
  old.callback(f.details);assert.equal(f.gate.held.facts,undefined);assert.equal(f.gate.allow(f.prompt,[f.action]),true);
  f.reply({bWaitingForUI:true,strTaskName:'ShowInterstitials'});assert.equal(f.gate.allow(f.prompt,[f.action]),true);
});
test('error callback still yields synchronously despite a prior passive fact',()=>{
  const f=fixture();f.begin();f.reply();f.callbacks.ShowError(9);assert.equal(f.yields(),1);
});


for(const suffix of ['UserRequest','ShowUI']) {
 test('taskchanged then '+suffix+' before async reply retains exact progress only',()=>{
  const f=fixture();f.begin();f.reply();
  f.owner.visibleSteamAttentionPrompt=()=>f.gate.allow(f.prompt,[f.action])?undefined:{prompt:f.prompt};
  f.callbacks.TaskChange(9);f.callbacks[suffix](9);assert.equal(f.yields(),0);
  assert.equal(f.gate.allow(f.prompt,[f.action,f.action]),false);
  f.reply({strTaskName:'ShowInterstitials',bWaitingForUI:true});assert.equal(f.yields(),0);
 });
 test('async '+suffix+' pending window is bounded to its original event',()=>{
  const f=fixture();f.begin();f.callbacks[suffix](9);assert.equal(f.gate.allow(f.prompt,[f.action]),true);
  f.tick(181);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
  f.tick(100);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
 });
 test('form during async '+suffix+' pending yields immediately',()=>{
  const f=fixture();f.begin();f.reply();f.callbacks.TaskChange(9);
  f.prompt.querySelector=()=>({});
  f.owner.visibleSteamAttentionPrompt=()=>f.gate.allow(f.prompt,[f.action])?undefined:{prompt:f.prompt};
  f.callbacks[suffix](9);assert.equal(f.yields(),1);
 });
}


test('native End retains only its exact passive progress for Steam 3000ms lifetime',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);assert.equal(f.yields(),0);
 assert.equal(f.gate.allow(f.prompt,[f.action]),true);
 assert.equal(f.gate.allow(f.prompt,[f.action,f.action]),false);
 f.tick(3000);assert.equal(f.gate.allow(f.prompt,[f.action]),true);
 f.tick(1);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('repeated End and DOM polls cannot extend terminal popup lifetime',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);f.tick(2000);f.callbacks.End(9);
 assert.equal(f.gate.allow(f.prompt,[f.action]),true);f.tick(1001);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('Completed metadata preserves terminal progress without stale asynchronous refresh',()=>{
 const f=fixture();f.begin();f.reply({strTaskName:'Completed'});assert.equal(f.gate.allow(f.prompt,[f.action]),true);
 const count=f.replies.length;f.tick(2000);f.gate.allow(f.prompt,[f.action]);assert.equal(f.replies.length,count);
 f.tick(1001);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('retained End cannot classify a real form or a foreign app progress popup',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);f.owner.readReactAppId=()=>999;
 assert.equal(f.gate.allow(f.prompt,[f.action]),false);f.owner.readReactAppId=()=>42;
 f.prompt.querySelector=()=>({});assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('native error revokes retained End immediately',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);f.callbacks.ShowError(9);
 assert.equal(f.yields(),1);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});
test('fresh launch and old generation retire terminal progress ownership',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);f.owner.modernHandoffGeneration++;
 assert.equal(f.gate.allow(f.prompt,[f.action]),false);
 f.callbacks.Start(10,'game42','LaunchApp');f.callbacks.End(9);assert.equal(f.gate.held.id,10);
 assert.equal(f.gate.held.endedAt,undefined);
});
test('clock reversal cannot authorize retained End progress',()=>{
 const f=fixture();f.begin();f.reply();f.callbacks.End(9);f.setNow(999);assert.equal(f.gate.allow(f.prompt,[f.action]),false);
});

console.log(`${checks} actual native-progress gate checks PASS; fake callbacks/DOM/clock, no OS or Steam mutations`);
