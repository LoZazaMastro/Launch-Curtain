// SPDX-License-Identifier: MIT
#include "ProgressCore.h"
#include <iostream>
#include <stdexcept>
#include <map>

namespace {
std::string Encode(std::wstring_view text){
 constexpr char alphabet[]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 std::vector<unsigned char> bytes;for(wchar_t c:text){bytes.push_back(static_cast<unsigned char>(c));bytes.push_back(static_cast<unsigned char>(c>>8));}
 std::string out;
 for(std::size_t i=0;i<bytes.size();i+=3){unsigned value=static_cast<unsigned>(bytes[i])<<16;
  if(i+1<bytes.size())value|=static_cast<unsigned>(bytes[i+1])<<8;if(i+2<bytes.size())value|=bytes[i+2];
  out+=alphabet[(value>>18)&63];out+=alphabet[(value>>12)&63];out+=i+1<bytes.size()?alphabet[(value>>6)&63]:'=';out+=i+2<bytes.size()?alphabet[value&63]:'=';}
 return out;
}
struct FakeTree {
 std::map<int,std::vector<int>> children;std::map<int,int> parents;std::map<int,progress::Row> facts;
 int reads{},failNode{};std::function<void(int)> onRead;
 FakeTree(){facts[1].controlType=50033;}
 void Add(int parent,int node){children[parent].push_back(node);parents[node]=parent;facts[node].controlType=50033;}
 bool Facts(int node,progress::Row& row){++reads;if(onRead)onRead(node);if(node==failNode)return false;row=facts[node];return true;}
 bool First(int node,int& out,bool& has){out=0;has=!children[node].empty();if(has)out=children[node][0];return true;}
 bool Next(int node,int& out,bool& has){out=0;has=false;if(!parents.contains(node))return false;
  const auto& siblings=children[parents[node]];
  for(std::size_t i=0;i<siblings.size();++i)if(siblings[i]==node){if(i+1<siblings.size()){out=siblings[i+1];has=true;}return true;}return false;}
};
}
int RunChecks(){
 int passed=0;
 auto check=[&](bool result,const char* label){if(!result)throw std::runtime_error(label);++passed;};
 try{
  std::string id(32,'a'),line=id+"\t123\t42\t134390091567477731\t"+Encode(L"C:\\Exact\\Actor.exe")+'\t'+Encode(L"EXACT_CLASS");
  progress::Target target;check(progress::Parse(line,target)&&target.pid==42&&target.hwnd==123&&target.image==L"C:\\Exact\\Actor.exe","parse-positive");
  for(const auto& bad:std::vector<std::string>{"",line+'\t',line.substr(1),line+"\tunused",std::string(16385,'a'),
      id+"\t0\t42\t123\t"+Encode(L"C:\\A.exe")+'\t'+Encode(L"Class"),
      id+"\t1\t4294967296\t123\t"+Encode(L"C:\\A.exe")+'\t'+Encode(L"Class"),
      id+"\t1\t42\t18446744073709551616\t"+Encode(L"C:\\A.exe")+'\t'+Encode(L"Class"),
      id+"\t1\t42\t123\t"+Encode(L"relative.exe")+'\t'+Encode(L"Class"),
      id+"\t1\t42\t123\t"+Encode(L"C:\\A.exe")+'\t'+Encode(L"Class\n"),
      id+"\t1\t42\t123\t"+Encode(L"C:\\A.exe")+'\t'+Encode(std::wstring(257,L'a'))}){
   progress::Target unused;check(!progress::Parse(bad,unused),"parse-reject");}
  std::wstring decoded;check(!progress::DecodeWide("AAAA=AAA",decoded)&&!progress::DecodeWide("AB==",decoded)
   &&!progress::DecodeWide("QQ==",decoded)&&!progress::DecodeWide("%%%%",decoded),"base64-strict");
  check(progress::Identifier(L"SignInButton")=="SignInButton"&&progress::Identifier(L"")=="","identifier-exact");
  check(progress::Identifier(std::wstring(64,L'a')).has_value(),"identifier-max");
  for(auto value:{L"account@example.com",L"Display Name",L"line\n",L"\u00e8"})check(!progress::Identifier(value),"identifier-redacted");
  check(!progress::Identifier(std::wstring(65,L'a')),"identifier-too-long");
  progress::Identity identity{target.hwnd,target.birth,target.pid,7,1,true,true,target.image,target.windowClass};
  check(progress::Match(target,identity,7,1),"match-positive");
  for(int kind=0;kind<9;++kind){auto wrong=identity;
   switch(kind){case 0:wrong.hwnd++;break;case 1:wrong.birth++;break;case 2:wrong.pid++;break;case 3:wrong.thread++;break;
    case 4:wrong.session++;break;case 5:wrong.alive=false;break;case 6:wrong.root=false;break;case 7:wrong.image+=L"x";break;case 8:wrong.windowClass+=L"x";break;}
   check(!progress::Match(target,wrong,7,1),"match-reject");}
  FakeTree busy;busy.Add(1,2);busy.facts[2].controlType=50012;busy.facts[2].enabled=true;
  auto result=progress::Scan(1,busy,[]{return true;});
  check(result.complete&&result.rows.size()==2&&progress::Json(result).find("busy-progress-evidence")!=std::string::npos,"busy-positive");
  busy.Add(1,3);busy.facts[3].controlType=50000;busy.facts[3].enabled=true;busy.facts[3].focusable=true;
  result=progress::Scan(1,busy,[]{return true;});check(progress::Json(result).find("interactive-controls-observed")!=std::string::npos,"interactive");
  busy.facts[3].automationId="CloseButton";busy.facts[3].className="Button";busy.facts[3].invokeAvailable=true;
  busy.facts[3].selectionItemAvailable=true;busy.facts[3].expandCollapseAvailable=true;busy.facts[3].isPassword=true;
  result=progress::Scan(1,busy,[]{return true;});
  check(result.rows[2].invokeAvailable&&result.rows[2].selectionItemAvailable&&result.rows[2].expandCollapseAvailable&&result.rows[2].isPassword
   &&result.rows[2].automationId=="CloseButton","metadata-booleans");
  check(progress::Json(result).find("\"coverAuthorized\":false")!=std::string::npos,"no-cover-authority");
  FakeTree invalid;result=progress::Scan(1,invalid,[]{return false;});check(!result.complete&&invalid.reads==0&&result.reason=="identity-before","invalid-before");
  FakeTree late;late.Add(1,2);bool current=true;late.onRead=[&](int n){if(n==2)current=false;};
  result=progress::Scan(1,late,[&]{return current;});check(!result.complete&&result.reason=="identity-after","late-drift");
  FakeTree failed;failed.failNode=1;result=progress::Scan(1,failed,[]{return true;});check(!result.complete&&result.reason=="provider-facts","provider-failure");
  FakeTree capped;for(int i=2;i<=64;++i)capped.Add(1,i);
  result=progress::Scan(1,capped,[]{return true;});check(result.complete&&result.rows.size()==64,"exact64");
  capped.Add(1,65);capped.reads=0;result=progress::Scan(1,capped,[]{return true;});
  check(!result.complete&&result.reason=="element-cap"&&capped.reads==64,"no65-read");
  FakeTree deep;for(int i=2;i<=6;++i)deep.Add(i-1,i);
  check(progress::Scan(1,deep,[]{return true;}).complete,"depth5");deep.Add(6,7);
  check(progress::Scan(1,deep,[]{return true;}).reason=="depth-cap","no-depth6");
  for(auto& entry:capped.facts){entry.second.automationId=std::string(64,'a');entry.second.className=std::string(64,'b');}
  result=progress::Scan(1,capped,[]{return true;});check(progress::Json(result).size()+256<32768,"bounded-output");
  std::cout<<"{\"passed\":"<<passed<<",\"nativeQueries\":0,\"uiaQueries\":0,\"actualTraversalWithFakeReader\":true}\n";
  return 0;
 }catch(const std::exception& error){std::cerr<<"inert-check-failed "<<error.what()<<'\n';return 1;}
}
