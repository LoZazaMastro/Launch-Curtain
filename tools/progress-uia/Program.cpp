// SPDX-License-Identifier: MIT
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <ole2.h>
#include <UIAutomation.h>
#include <wrl/client.h>
#include <cstdio>
#include <iostream>
#include "ProgressCore.h"
#pragma comment(lib,"ole32.lib")
#pragma comment(lib,"oleaut32.lib")
#pragma comment(lib,"uiautomationcore.lib")
#pragma comment(lib,"uuid.lib")
#pragma comment(lib,"user32.lib")
using Microsoft::WRL::ComPtr;

namespace {
struct Handle {HANDLE value{};~Handle(){if(value&&value!=INVALID_HANDLE_VALUE)CloseHandle(value);}};
class NativeGuard {
 const progress::Target& target;Handle process;HWND window;DWORD thread{},session{};
public:
 explicit NativeGuard(const progress::Target& t):target(t),window(reinterpret_cast<HWND>(static_cast<ULONG_PTR>(t.hwnd))){
  process.value=OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION|SYNCHRONIZE,FALSE,t.pid);
  DWORD pid{};thread=GetWindowThreadProcessId(window,&pid);
  if(!ProcessIdToSessionId(GetCurrentProcessId(),&session)||pid!=t.pid)thread=0;
 }
 bool Current(){
  if(!thread||!process.value||process.value==INVALID_HANDLE_VALUE||GetProcessId(process.value)!=target.pid
   ||WaitForSingleObject(process.value,0)!=WAIT_TIMEOUT)return false;
  FILETIME born{},exit{},kernel{},user{};
  if(!GetProcessTimes(process.value,&born,&exit,&kernel,&user)
   ||((static_cast<std::uint64_t>(born.dwHighDateTime)<<32)|born.dwLowDateTime)!=target.birth)return false;
  wchar_t image[32768]{};DWORD length=32768;
  if(!QueryFullProcessImageNameW(process.value,0,image,&length)||length==0||length>=32768
   ||CompareStringOrdinal(image,static_cast<int>(length),target.image.c_str(),static_cast<int>(target.image.size()),TRUE)!=CSTR_EQUAL)return false;
  wchar_t name[257]{};int classLength=GetClassNameW(window,name,257);
  if(classLength<=0||target.windowClass!=std::wstring_view(name,static_cast<std::size_t>(classLength)))return false;
  DWORD pid{},actualSession{};DWORD actualThread=GetWindowThreadProcessId(window,&pid);
  if(!ProcessIdToSessionId(pid,&actualSession))return false;
  progress::Identity identity{target.hwnd,target.birth,pid,actualThread,actualSession,
   WaitForSingleObject(process.value,0)==WAIT_TIMEOUT,IsWindow(window)&&GetAncestor(window,GA_ROOT)==window,
   target.image,std::wstring(name,static_cast<std::size_t>(classLength))};
  return progress::Match(target,identity,thread,session)&&GetProcessId(process.value)==target.pid;
 }
 bool Foreground()const{return GetForegroundWindow()==window;}
};
struct Node {ComPtr<IUIAutomationElement> element,parent;};
class Tree {
 IUIAutomation* automation;IUIAutomationTreeWalker* walker;
 static bool Available(IUIAutomationElement* element,PROPERTYID property,bool& result){
  VARIANT value;VariantInit(&value);HRESULT hr=element->GetCurrentPropertyValue(property,&value);
  bool known=SUCCEEDED(hr)&&value.vt==VT_BOOL;
  result=known&&value.boolVal==VARIANT_TRUE;VariantClear(&value);return known;
 }
 static bool Identifier(IUIAutomationElement* element,bool className,std::optional<std::string>& result){
  BSTR value{};HRESULT hr=className?element->get_CurrentClassName(&value):element->get_CurrentAutomationId(&value);
  if(FAILED(hr)){SysFreeString(value);return false;}
  UINT length=value?SysStringLen(value):0;
  result=length>64?std::nullopt:progress::Identifier(value?std::wstring_view(value,length):std::wstring_view());
  SysFreeString(value);return true;
 }
public:
 Tree(IUIAutomation* a,IUIAutomationTreeWalker* w):automation(a),walker(w){}
 bool Facts(const Node& node,progress::Row& facts){
  if(!node.element)return false;
  if(node.parent){ComPtr<IUIAutomationElement> actual;BOOL same=FALSE;
   if(FAILED(walker->GetParentElement(node.element.Get(),&actual))||!actual
    ||FAILED(automation->CompareElements(node.parent.Get(),actual.Get(),&same))||!same)return false;}
  CONTROLTYPEID type{};BOOL focus{},offscreen{},enabled{},password{};
  if(FAILED(node.element->get_CurrentControlType(&type))||FAILED(node.element->get_CurrentIsKeyboardFocusable(&focus))
   ||FAILED(node.element->get_CurrentIsOffscreen(&offscreen))||FAILED(node.element->get_CurrentIsEnabled(&enabled))
   ||FAILED(node.element->get_CurrentIsPassword(&password)))return false;
  facts.controlType=type;facts.focusable=focus!=FALSE;facts.offscreen=offscreen!=FALSE;
  facts.enabled=enabled!=FALSE;facts.isPassword=password!=FALSE;
  if(!Identifier(node.element.Get(),false,facts.automationId)||!Identifier(node.element.Get(),true,facts.className)
   ||!Available(node.element.Get(),UIA_IsInvokePatternAvailablePropertyId,facts.invokeAvailable)
   ||!Available(node.element.Get(),UIA_IsSelectionItemPatternAvailablePropertyId,facts.selectionItemAvailable)
   ||!Available(node.element.Get(),UIA_IsExpandCollapsePatternAvailablePropertyId,facts.expandCollapseAvailable))return false;
  if(type==50012){ComPtr<IUnknown> pattern;HRESULT hr=node.element->GetCurrentPattern(UIA_RangeValuePatternId,&pattern);
   if(FAILED(hr)&&hr!=UIA_E_NOTSUPPORTED)return false;facts.progressPattern=SUCCEEDED(hr)&&pattern!=nullptr;}
  return true;
 }
 bool First(const Node& node,Node& child,bool& has){
  HRESULT hr=walker->GetFirstChildElement(node.element.Get(),&child.element);child.parent=node.element;
  has=SUCCEEDED(hr)&&child.element!=nullptr;return SUCCEEDED(hr);
 }
 bool Next(const Node& node,Node& sibling,bool& has){
  if(!node.parent)return false;
  HRESULT hr=walker->GetNextSiblingElement(node.element.Get(),&sibling.element);sibling.parent=node.parent;
  has=SUCCEEDED(hr)&&sibling.element!=nullptr;return SUCCEEDED(hr);
 }
};
bool Line(std::string& text){
 text.clear();for(int c;(c=std::getchar())!=EOF;){if(c=='\n'){if(!text.empty()&&text.back()=='\r')text.pop_back();return true;}
  if(c<0||c>127||text.size()>=16384)return false;text.push_back(static_cast<char>(c));}
 return false;
}
void Emit(const std::string& text){std::cout<<(text.size()<=32768?text:"{\"state\":\"unknown\"}")<<'\n'<<std::flush;}
std::string Observe(const progress::Target& target,IUIAutomation* automation,IUIAutomationTreeWalker* walker){
 NativeGuard native(target);bool before=native.Current(),after=false,foreground=false;progress::Result result;
 if(before){
  ComPtr<IUIAutomationElement> element;
  if(SUCCEEDED(automation->ElementFromHandle(reinterpret_cast<UIA_HWND>(static_cast<ULONG_PTR>(target.hwnd)),&element))&&element){
   int pid{};UIA_HWND hwnd{};
   if(SUCCEEDED(element->get_CurrentProcessId(&pid))&&SUCCEEDED(element->get_CurrentNativeWindowHandle(&hwnd))
    &&pid>0&&static_cast<std::uint32_t>(pid)==target.pid&&reinterpret_cast<ULONG_PTR>(hwnd)==target.hwnd){
    Tree tree(automation,walker);result=progress::Scan(Node{element,{}},tree,[&]{return native.Current();});
   }else result.reason="uia-root-identity";
  }else result.reason="uia-root-unavailable";
 }else result.reason="native-before";
 after=native.Current();foreground=native.Foreground();
 if(!after){result.complete=false;result.reason="native-final";}
 return "{\"id\":\""+target.id+"\",\"result\":"+progress::Json(result)
  +",\"nativeIdentityBeforeAndAfter\":"+(before&&after?"true":"false")
  +",\"foregroundExactAfter\":"+(foreground?"true":"false")+",\"coverAuthorized\":false}";
}
}
int RunChecks();
int wmain(int argc,wchar_t** argv){
 if(argc==2&&std::wstring_view(argv[1])==L"--checks")return RunChecks();
 if(argc==1){Emit("{\"planOnly\":true,\"requires\":\"--server\",\"nativeQueries\":0}");return 0;}
 if(argc!=2||std::wstring_view(argv[1])!=L"--server")return 2;
 HRESULT initialized=CoInitializeEx(nullptr,COINIT_MULTITHREADED);
 if(FAILED(initialized))return 2;
 int exitCode=0;
 {
  ComPtr<IUIAutomation> automation;ComPtr<IUIAutomationTreeWalker> walker;
  if(FAILED(CoCreateInstance(CLSID_CUIAutomation8,nullptr,CLSCTX_INPROC_SERVER,IID_PPV_ARGS(&automation)))
   ||FAILED(automation->get_RawViewWalker(&walker))||!walker)exitCode=2;
  else{
   Emit("{\"ready\":true,\"protocol\":1}");auto began=GetTickCount64();std::string line;
   for(unsigned count=0;count<4096&&GetTickCount64()-began<120000&&Line(line);++count){
    if(GetTickCount64()-began>=120000)break;
    progress::Target target;
    try{if(!progress::Parse(line,target)){Emit("{\"state\":\"unknown\"}");continue;}
     Emit(Observe(target,automation.Get(),walker.Get()));
    }catch(...){Emit(progress::HexId(target.id)?"{\"id\":\""+target.id+"\",\"state\":\"unknown\"}":"{\"state\":\"unknown\"}");}
   }
  }
 }
 CoUninitialize();return exitCode;
}
