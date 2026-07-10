export {};
declare global {
  // Globali esposti da Steam/CEF, non tipizzati.
  var SteamClient: any;
  var SteamUIStore: any;
  var appStore: any;
  interface Window {
    SP_REACT: any;
    SteamClient: any;
    SteamUIStore: any;
    appStore: any;
  }
}
