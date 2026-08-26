const manifest = {"name":"Launch Curtain"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const openFilePicker = api.openFilePicker;
const routerHook = api.routerHook;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaTheaterMasks (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M206.86 245.15c-35.88 10.45-59.95 41.2-57.53 74.1 11.4-12.72 28.81-23.7 49.9-30.92l7.63-43.18zM95.81 295L64.08 115.49c-.29-1.62.28-2.62.24-2.65 57.76-32.06 123.12-49.01 189.01-49.01 1.61 0 3.23.17 4.85.19 13.95-13.47 31.73-22.83 51.59-26 18.89-3.02 38.05-4.55 57.18-5.32-9.99-13.95-24.48-24.23-41.77-27C301.27 1.89 277.24 0 253.32 0 176.66 0 101.02 19.42 33.2 57.06 9.03 70.48-3.92 98.48 1.05 126.58l31.73 179.51c14.23 80.52 136.33 142.08 204.45 142.08 3.59 0 6.75-.46 10.01-.8-13.52-17.08-28.94-40.48-39.5-67.58-47.61-12.98-106.06-51.62-111.93-84.79zm97.55-137.46c-.73-4.12-2.23-7.87-4.07-11.4-8.25 8.91-20.67 15.75-35.32 18.32-14.65 2.58-28.67.4-39.48-5.17-.52 3.94-.64 7.98.09 12.1 3.84 21.7 24.58 36.19 46.34 32.37 21.75-3.82 36.28-24.52 32.44-46.22zM606.8 120.9c-88.98-49.38-191.43-67.41-291.98-51.35-27.31 4.36-49.08 26.26-54.04 54.36l-31.73 179.51c-15.39 87.05 95.28 196.27 158.31 207.35 63.03 11.09 204.47-53.79 219.86-140.84l31.73-179.51c4.97-28.11-7.98-56.11-32.15-69.52zm-273.24 96.8c3.84-21.7 24.58-36.19 46.34-32.36 21.76 3.83 36.28 24.52 32.45 46.22-.73 4.12-2.23 7.87-4.07 11.4-8.25-8.91-20.67-15.75-35.32-18.32-14.65-2.58-28.67-.4-39.48 5.17-.53-3.95-.65-7.99.08-12.11zm70.47 198.76c-55.68-9.79-93.52-59.27-89.04-112.9 20.6 25.54 56.21 46.17 99.49 53.78 43.28 7.61 83.82.37 111.93-16.6-14.18 51.94-66.71 85.51-122.38 75.72zm130.3-151.34c-8.25-8.91-20.68-15.75-35.33-18.32-14.65-2.58-28.67-.4-39.48 5.17-.52-3.94-.64-7.98.09-12.1 3.84-21.7 24.58-36.19 46.34-32.37 21.75 3.83 36.28 24.52 32.45 46.22-.73 4.13-2.23 7.88-4.07 11.4z"},"child":[]}]})(props);
}




function FaPause (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"},"child":[]}]}) (props);
}
function FaPlay (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]}) (props);
}
function FaDownload (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"},"child":[]}]})(props);
};


function FaFolderOpen (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"},"child":[]}]})(props);
};


function FaImage (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"},"child":[]}]})(props);
};


function FaRocket (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505.12019,19.09375c-1.18945-5.53125-6.65819-11-12.207-12.1875C460.716,0,435.507,0,410.40747,0,307.17523,0,245.26909,55.20312,199.05238,128H94.83772c-16.34763.01562-35.55658,11.875-42.88664,26.48438L2.51562,253.29688A28.4,28.4,0,0,0,0,264a24.00867,24.00867,0,0,0,24.00582,24H127.81618l-22.47457,22.46875c-11.36521,11.36133-12.99607,32.25781,0,45.25L156.24582,406.625c11.15623,11.1875,32.15619,13.15625,45.27726,0l22.47457-22.46875V488a24.00867,24.00867,0,0,0,24.00581,24,28.55934,28.55934,0,0,0,10.707-2.51562l98.72834-49.39063c14.62888-7.29687,26.50776-26.5,26.50776-42.85937V312.79688c72.59753-46.3125,128.03493-108.40626,128.03493-211.09376C512.07526,76.5,512.07526,51.29688,505.12019,19.09375ZM384.04033,168A40,40,0,1,1,424.05,128,40.02322,40.02322,0,0,1,384.04033,168Z"},"child":[]}]})(props);
};


function FaTools (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"},"child":[]}]})(props);
};


function FaTrashAlt (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"},"child":[]}]})(props);
};


function FaUndo (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"},"child":[]}]})(props);
};
function FaMinus (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},"child":[]}]})(props);
}
function FaPlus (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"},"child":[]}]})(props);
}



// Callable esposte dal backend Python (main.py). Ricostruito dal dist.
const getSettings = callable("get_settings");
const saveSettings = callable("save_settings");
const getStatus = callable("get_status");
const debugLog = callable("debug_log");
const hideCurtain = callable("hide_curtain");
const showBlackCover = callable("show_black_cover");
const hideBlackCover = callable("hide_black_cover");
const setNativePromptVisible = callable("set_native_prompt_visible");
const launchRequested = callable("launch_requested");
const resolveGameLogo = callable("resolve_game_logo");
const getGameSettings = callable("get_game_settings");
const saveGameSettings = callable("save_game_settings");
const resetGameSettings = callable("reset_game_settings");
const validateLaunchImagePath = callable("validate_launch_image_path");
const getImagePreview = callable("get_image_preview");
const searchPlayStationGames = callable("search_playstation_games");
const getPlayStationBackgrounds = callable("get_playstation_backgrounds");
const applyPlayStationAsset = callable("apply_playstation_asset");
const removePlayStationAsset = callable("remove_playstation_asset");
const searchGoogleImages = callable("search_google_images");
const downloadGoogleImage = callable("download_google_image");
const searchIidbSoundbites = callable("search_iidb_soundbites");
const validateSoundbitePath = callable("validate_soundbite_path");
const getSoundbitePreview = callable("get_soundbite_preview");
const soundbiteRuntimeStarted = callable("soundbite_runtime_started");
const soundbiteRuntimeFinished = callable("soundbite_runtime_finished");
const importLocalSoundbite = callable("import_local_soundbite");
const downloadIidbSoundbite = callable("download_iidb_soundbite");
const clearSoundbite = callable("clear_soundbite");
const applyIidbSoundbite = callable("apply_iidb_soundbite");
const removeIidbSoundbite = callable("remove_iidb_soundbite");
const applyIidbAsset = callable("apply_iidb_asset");
const removeIidbAsset = callable("remove_iidb_asset");
const buildGameCache = callable("build_game_cache");
const cleanupUnusedLaunchImages = callable("cleanup_unused_launch_images");
const cleanupUnusedSoundbites = callable("cleanup_unused_soundbites");
const createBackup = callable("create_backup");
const restoreBackup = callable("restore_backup");
const startAutoMode = callable("start_auto_mode");
const stopAutoMode = callable("stop_auto_mode");
const FILE_SELECTION_FILE = 0;
const FILE_SELECTION_FOLDER = 1;



// i18n e stringhe localizzate (11 lingue). Ricostruito dal dist.
const I18N = {
    en: {
        curtain: "Curtain",
        automation: "Settings",
        timeout: "Timeout",
        foreground: "Foreground",
        showCurtain: "Show curtain",
        hideCurtain: "Hide curtain",
        launchInfo: "Launch info",
        launchMode: "Launch mode",
        modeModern: "Modern (in Steam UI)",
        modeClassic: "Classic (overlay window)",
        modeOff: "Off",
        focusSteam: "Focus Steam",
        autoLaunchCurtain: "Enable launch screen",
        windowsOnly: "Windows-only backend. This system is not Windows.",
        noForeground: "No foreground window detected",
        logo: "Logo",
        chooseLogo: "Choose custom logo",
        useDefaultLogo: "Use default logo",
        defaultLogo: "Default Playhub logo",
        customLogo: "Custom logo",
        logoPickerError: "Could not choose a logo.",
        timeoutEnabled: "Enable timeout",
        modeAuto: "Auto",
        forceMode: "Force mode for this game",
        gameTimeout: "Timeout only for this game",
        gameTimeoutSeconds: "Timeout duration",
        timeoutHelp: "How long the launch screen can stay visible while waiting for the game to become fullscreen.",
        timeoutDisabledHelp: "When disabled, the launch screen hides only after fullscreen detection or manual close.",
        exitDelay: "Exit delay",
        exitDelayHelp: "How long Launch Curtain stays visible after detecting that the game is ready.",
        seconds25: "25 seconds",
        seconds45: "45 seconds",
        seconds75: "75 seconds",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain needs attention"
    },
    it: {
        curtain: "Schermata",
        automation: "Impostazioni",
        timeout: "Timeout",
        foreground: "Finestra attiva",
        showCurtain: "Mostra schermata",
        hideCurtain: "Nascondi schermata",
        launchInfo: "Informazioni di lancio",
        launchMode: "Modalità di avvio",
        modeModern: "Moderna (nella UI di Steam)",
        modeClassic: "Classica (finestra overlay)",
        modeOff: "Disattivata",
        focusSteam: "Riporta Steam davanti",
        autoLaunchCurtain: "Attiva la schermata di avvio",
        windowsOnly: "Backend solo per Windows. Questo sistema non e Windows.",
        noForeground: "Nessuna finestra attiva rilevata",
        logo: "Logo",
        chooseLogo: "Scegli logo custom",
        useDefaultLogo: "Usa logo predefinito",
        defaultLogo: "Logo Playhub predefinito",
        customLogo: "Logo custom",
        logoPickerError: "Non sono riuscito a scegliere un logo.",
        timeoutEnabled: "Attiva timeout",
        modeAuto: "Automatica",
        forceMode: "Forza modalita per questo gioco",
        gameTimeout: "Timeout solo per questo gioco",
        gameTimeoutSeconds: "Durata timeout",
        timeoutHelp: "Per quanto tempo la schermata di avvio puo restare visibile mentre aspetta che il gioco passi a schermo intero.",
        timeoutDisabledHelp: "Se disattivo, la schermata si chiude solo quando rileva il fullscreen o con la chiusura manuale.",
        exitDelay: "Ritardo uscita",
        exitDelayHelp: "Per quanto tempo Launch Curtain resta visibile dopo aver rilevato che il gioco e pronto.",
        seconds25: "25 secondi",
        seconds45: "45 secondi",
        seconds75: "75 secondi",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain richiede attenzione"
    },
    fr: {
        curtain: "Rideau",
        automation: "Automatisation",
        timeout: "Delai",
        foreground: "Fenetre active",
        showCurtain: "Afficher le rideau",
        hideCurtain: "Masquer le rideau",
        launchInfo: "Infos de lancement",
        launchMode: "Mode de lancement",
        modeModern: "Moderne (dans l'UI Steam)",
        modeClassic: "Classique (fenêtre overlay)",
        modeOff: "Désactivé",
        focusSteam: "Remettre Steam devant",
        autoLaunchCurtain: "Rideau automatique au lancement",
        windowsOnly: "Backend Windows uniquement. Ce systeme n'est pas Windows.",
        noForeground: "Aucune fenetre active detectee",
        logo: "Logo",
        chooseLogo: "Choisir un logo personnalise",
        useDefaultLogo: "Utiliser le logo par defaut",
        defaultLogo: "Logo Playhub par defaut",
        customLogo: "Logo personnalise",
        logoPickerError: "Impossible de choisir un logo.",
        seconds25: "25 secondes",
        seconds45: "45 secondes",
        seconds75: "75 secondes",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain demande votre attention"
    },
    es: {
        curtain: "Cortina",
        automation: "Automatizacion",
        timeout: "Tiempo limite",
        foreground: "Ventana activa",
        showCurtain: "Mostrar cortina",
        hideCurtain: "Ocultar cortina",
        launchInfo: "Información de inicio",
        launchMode: "Modo de inicio",
        modeModern: "Moderno (en la interfaz de Steam)",
        modeClassic: "Clásico (ventana superpuesta)",
        modeOff: "Desactivado",
        focusSteam: "Enfocar Steam",
        autoLaunchCurtain: "Cortina automatica al iniciar",
        windowsOnly: "Backend solo para Windows. Este sistema no es Windows.",
        noForeground: "No se detecto ninguna ventana activa",
        logo: "Logo",
        chooseLogo: "Elegir logo personalizado",
        useDefaultLogo: "Usar logo predeterminado",
        defaultLogo: "Logo Playhub predeterminado",
        customLogo: "Logo personalizado",
        logoPickerError: "No se pudo elegir un logo.",
        seconds25: "25 segundos",
        seconds45: "45 segundos",
        seconds75: "75 segundos",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain necesita atencion"
    },
    pt: {
        curtain: "Cortina",
        automation: "Automacao",
        timeout: "Tempo limite",
        foreground: "Janela ativa",
        showCurtain: "Mostrar cortina",
        hideCurtain: "Ocultar cortina",
        launchInfo: "Informações de inicialização",
        launchMode: "Modo de inicialização",
        modeModern: "Moderno (na interface do Steam)",
        modeClassic: "Clássico (janela sobreposta)",
        modeOff: "Desligado",
        focusSteam: "Focar Steam",
        autoLaunchCurtain: "Cortina automatica ao iniciar",
        windowsOnly: "Backend apenas para Windows. Este sistema nao e Windows.",
        noForeground: "Nenhuma janela ativa detectada",
        logo: "Logotipo",
        chooseLogo: "Escolher logotipo personalizado",
        useDefaultLogo: "Usar logotipo padrao",
        defaultLogo: "Logotipo Playhub padrao",
        customLogo: "Logotipo personalizado",
        logoPickerError: "Nao foi possivel escolher um logotipo.",
        seconds25: "25 segundos",
        seconds45: "45 segundos",
        seconds75: "75 segundos",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain precisa de atencao"
    },
    "pt-br": {
        curtain: "Cortina",
        automation: "Automacao",
        timeout: "Tempo limite",
        foreground: "Janela ativa",
        showCurtain: "Mostrar cortina",
        hideCurtain: "Ocultar cortina",
        launchInfo: "Informações de inicialização",
        launchMode: "Modo de inicialização",
        modeModern: "Moderno (na interface do Steam)",
        modeClassic: "Clássico (janela sobreposta)",
        modeOff: "Desligado",
        focusSteam: "Focar Steam",
        autoLaunchCurtain: "Cortina automatica ao iniciar",
        windowsOnly: "Backend apenas para Windows. Este sistema nao e Windows.",
        noForeground: "Nenhuma janela ativa detectada",
        logo: "Logo",
        chooseLogo: "Escolher logo personalizado",
        useDefaultLogo: "Usar logo padrao",
        defaultLogo: "Logo Playhub padrao",
        customLogo: "Logo personalizado",
        logoPickerError: "Nao foi possivel escolher um logo.",
        seconds25: "25 segundos",
        seconds45: "45 segundos",
        seconds75: "75 segundos",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain precisa de atencao"
    },
    de: {
        curtain: "Vorhang",
        automation: "Automatisierung",
        timeout: "Zeitlimit",
        foreground: "Aktives Fenster",
        showCurtain: "Vorhang anzeigen",
        hideCurtain: "Vorhang ausblenden",
        launchInfo: "Startinfos",
        launchMode: "Startmodus",
        modeModern: "Modern (in der Steam-UI)",
        modeClassic: "Klassisch (Overlay-Fenster)",
        modeOff: "Aus",
        focusSteam: "Steam fokussieren",
        autoLaunchCurtain: "Automatischer Startvorhang",
        windowsOnly: "Backend nur fur Windows. Dieses System ist nicht Windows.",
        noForeground: "Kein aktives Fenster erkannt",
        logo: "Logo",
        chooseLogo: "Eigenes Logo wahlen",
        useDefaultLogo: "Standardlogo verwenden",
        defaultLogo: "Standard-Playhub-Logo",
        customLogo: "Eigenes Logo",
        logoPickerError: "Logo konnte nicht ausgewahlt werden.",
        seconds25: "25 Sekunden",
        seconds45: "45 Sekunden",
        seconds75: "75 Sekunden",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain braucht Aufmerksamkeit"
    },
    nl: {
        curtain: "Gordijn",
        automation: "Automatisering",
        timeout: "Time-out",
        foreground: "Actief venster",
        showCurtain: "Gordijn tonen",
        hideCurtain: "Gordijn verbergen",
        launchInfo: "Startinfo",
        launchMode: "Startmodus",
        modeModern: "Modern (in Steam-UI)",
        modeClassic: "Klassiek (overlayvenster)",
        modeOff: "Uit",
        focusSteam: "Steam naar voren",
        autoLaunchCurtain: "Automatisch startgordijn",
        windowsOnly: "Backend alleen voor Windows. Dit systeem is geen Windows.",
        noForeground: "Geen actief venster gevonden",
        logo: "Logo",
        chooseLogo: "Eigen logo kiezen",
        useDefaultLogo: "Standaardlogo gebruiken",
        defaultLogo: "Standaard Playhub-logo",
        customLogo: "Eigen logo",
        logoPickerError: "Kon geen logo kiezen.",
        seconds25: "25 seconden",
        seconds45: "45 seconden",
        seconds75: "75 seconden",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain vraagt aandacht"
    },
    uk: {
        curtain: "Завіса",
        automation: "Автоматизація",
        timeout: "Час очікування",
        foreground: "Активне вікно",
        showCurtain: "Показати завісу",
        hideCurtain: "Сховати завісу",
        launchInfo: "Інформація про запуск",
        launchMode: "Режим запуску",
        modeModern: "Сучасний (в інтерфейсі Steam)",
        modeClassic: "Класичний (вікно-оверлей)",
        modeOff: "Вимкнено",
        focusSteam: "Повернути Steam на передній план",
        autoLaunchCurtain: "Автоматична завіса запуску",
        windowsOnly: "Backend працює лише у Windows. Ця система не Windows.",
        noForeground: "Активне вікно не знайдено",
        logo: "Логотип",
        chooseLogo: "Вибрати власний логотип",
        useDefaultLogo: "Використати типовий логотип",
        defaultLogo: "Типовий логотип Playhub",
        customLogo: "Власний логотип",
        logoPickerError: "Не вдалося вибрати логотип.",
        seconds25: "25 секунд",
        seconds45: "45 секунд",
        seconds75: "75 секунд",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain потребує уваги"
    },
    zh: {
        curtain: "启动幕布",
        automation: "自动化",
        timeout: "超时",
        foreground: "前台窗口",
        showCurtain: "显示幕布",
        hideCurtain: "隐藏幕布",
        launchInfo: "启动信息",
        launchMode: "启动模式",
        modeModern: "现代（Steam 界面内）",
        modeClassic: "经典（叠加窗口）",
        modeOff: "关闭",
        focusSteam: "聚焦 Steam",
        autoLaunchCurtain: "启动时自动显示幕布",
        windowsOnly: "后端仅支持 Windows。当前系统不是 Windows。",
        noForeground: "未检测到前台窗口",
        logo: "标志",
        chooseLogo: "选择自定义标志",
        useDefaultLogo: "使用默认标志",
        defaultLogo: "默认 Playhub 标志",
        customLogo: "自定义标志",
        logoPickerError: "无法选择标志。",
        seconds25: "25 秒",
        seconds45: "45 秒",
        seconds75: "75 秒",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain 需要注意"
    },
    ja: {
        curtain: "カーテン",
        automation: "自動化",
        timeout: "タイムアウト",
        foreground: "前面のウィンドウ",
        showCurtain: "カーテンを表示",
        hideCurtain: "カーテンを非表示",
        launchInfo: "起動情報",
        launchMode: "起動モード",
        modeModern: "モダン（Steam UI内）",
        modeClassic: "クラシック（オーバーレイ）",
        modeOff: "オフ",
        focusSteam: "Steam を前面へ",
        autoLaunchCurtain: "起動時に自動表示",
        windowsOnly: "バックエンドは Windows 専用です。このシステムは Windows ではありません。",
        noForeground: "前面のウィンドウが見つかりません",
        logo: "ロゴ",
        chooseLogo: "カスタムロゴを選択",
        useDefaultLogo: "既定のロゴを使用",
        defaultLogo: "既定の Playhub ロゴ",
        customLogo: "カスタムロゴ",
        logoPickerError: "ロゴを選択できませんでした。",
        seconds25: "25 秒",
        seconds45: "45 秒",
        seconds75: "75 秒",
        toastTitle: "Launch Curtain",
        toastAttention: "Launch Curtain に注意が必要です"
    }
};
const EXTRA_STRINGS = {
    en: {
        soundbites: "Soundbites", soundbitesHelp: "Play a short game-specific jingle while Launch Curtain is visible.", soundbiteVolume: "Soundbite volume", soundbiteMasterVolume: "Master Soundbite volume", soundbiteMasterVolumeHelp: "Applied on top of each game's individual Soundbite volume.", searchIidbSoundbites: "Search iiDB Soundbites", searchingIidbSoundbites: "Searching iiDB Soundbites...", noIidbSoundbites: "No iiDB Soundbites found.", previewSoundbite: "Preview", stopSoundbitePreview: "Stop preview", downloadApplySoundbite: "Download & apply", importSoundbite: "Import Soundbite", removeSoundbite: "Remove Soundbite", soundbiteLocal: "Local file", soundbiteIidb: "iiDB", soundbiteImported: "Local Soundbite imported.", soundbiteImportFailed: "Could not import the Soundbite.", soundbiteDownloadFailed: "Could not download the Soundbite.", playStationAssets: "PlayStation Assets", iidbAssets: "iiDB Assets", iidbSoundbites: "iiDB Soundbites", downloadIidbAssets: "Download iiDB Assets", removeIidbAssets: "Remove iiDB Assets", downloadingIidbAssets: "Downloading iiDB Assets", removingIidbAssets: "Removing iiDB Assets", bulkSoundbites: "Download missing iiDB Soundbites", removeIidbSoundbites: "Remove iiDB Soundbites", downloadingSoundbites: "Downloading Soundbites", removingSoundbites: "Removing iiDB Soundbites", showGamesWithoutSoundbites: "Show games without Soundbites", hideGamesWithoutSoundbites: "Hide games without Soundbites", showGamesWithSoundbites: "Show games with Soundbites", hideGamesWithSoundbites: "Hide games with Soundbites", manageSoundbiteExclusions: "Automatic Soundbite exclusions", soundbiteExclusionHelp: "Excluded games are skipped by automatic Soundbite assignment.", excluded: "Excluded", included: "Included", noGamesWithoutSoundbites: "All library games currently have a Soundbite or are excluded.", noGamesWithSoundbites: "No library games currently have a Soundbite.", playStationAssetProtectionHelp: "PlayStation Assets are applied only to installed games without an existing curtain. iiDB and manual/local assets are never replaced.", iidbAssetProtectionHelp: "iiDB Assets are applied only to games without an existing curtain. PlayStation and manual assets are never replaced.", bulkApplied: "Applied", bulkSkipped: "Skipped", bulkFailed: "Failed", bulkStop: "Stop", bulkStopped: "Stopped", iidb: "iiDB", assets: "Assets", yes: "Yes", no: "No", deleteUnusedSoundbites: "Delete unused Soundbites", cleanupUnusedSoundbitesFailed: "Could not remove unused Soundbites.", confirmRemovePlayStationAssets: "Remove all PlayStation-managed launch assets? Manually selected images and iiDB assets are preserved.", confirmRemoveIidbAssets: "Remove all iiDB-managed launch assets? PlayStation assets and manually selected images are preserved.", confirmRemoveIidbSoundbites: "Remove all iiDB-managed Soundbites currently assigned to games? Local Soundbites are preserved.", confirmDeleteUnusedSoundbites: "Delete only iiDB Soundbite files that are no longer assigned to any game? Local/imported files and active Soundbites are preserved.", confirmDeleteUnusedImages: "Delete only launch-image files in Launch Curtain's managed folder that are no longer used by any game?", whatToEdit: "What do you want to edit?", steamGridApiKey: "SteamGridDB API key", steamGridApiHelp: "SteamGridDB Hero search uses your personal API key. Launch Curtain does not bundle an API key.", steamGridApiPage: "Open SteamGridDB API page", steamGridCredits: "SteamGridDB Hero artwork is provided through the SteamGridDB API and remains third-party content.", iisuCredits: "Special thanks to the iiSU team and community for creating iiDB and for the incredible work behind its growing collection of game artwork and soundbites. Their passion for presentation, preservation, and beautifully curated game assets has made Launch Curtain’s iiDB integration possible. Huge thanks for building such a valuable resource for the gaming community and for making these assets accessible to projects like this one.", steamGridApiPlaceholder: "Paste your personal API key", saveSteamGridApiKey: "Save SteamGridDB API key", steamGridApiSaved: "SteamGridDB API key saved.", steamGridApiCleared: "SteamGridDB API key cleared.", steamGridApiSaveFailed: "Could not save the SteamGridDB API key.", steamGridApiRequired: "Configure your personal SteamGridDB API key in the Launch Curtain QAM before searching.", steamGridHeroOnlyHelp: "SteamGridDB search returns Hero artwork only.",
        maintenance: "Maintenance", refreshGameCache: "Refresh game cache", deleteUnusedImages: "Delete unused images", backup: "Backup", backupHelp: "Create or restore a complete backup of Launch Curtain settings, curtains, Soundbites and referenced local files. The backup also contains saved service settings such as your SteamGridDB API key.", createBackup: "Create backup", restoreBackup: "Restore backup", backupCreated: "Backup created in", backupRestored: "Backup restored successfully.", backupFailed: "Could not create the backup.", restoreBackupFailed: "Could not restore the backup.", backupMissingFiles: "Some external files could not be included.", confirmRestoreBackup: "Restore this backup? Current Launch Curtain settings and managed files will be replaced. A temporary rollback copy is created automatically before the restore.",
        downloadPlayStationAssetsInstalled: "Download PS assets for installed games", noInstalledGames: "No installed Steam games were found.",
        downloadPlayStationAssets: "Download PlayStation assets", removePlayStationAssets: "Remove PlayStation assets", downloadingPlayStationAssets: "Downloading PlayStation assets", removingPlayStationAssets: "Removing PlayStation assets", playStationBulkApplied: "Applied", playStationBulkRemoved: "Removed", playStationBulkSkipped: "Skipped", playStationBulkFailed: "Failed", playStationBulkError: "The PlayStation bulk operation could not be completed",
        tabGame: "Game", tabAppearance: "Appearance", tabScrapers: "Scrapers",
        gameBehavior: "Launch Curtain behavior", gameBehaviorHelp: "Choose how Launch Curtain behaves for this game.", enableForGame: "Enable Launch Curtain for this game",
        logoHelp: "Control the game logo and open the visual editor.", showLogo: "Show logo", openEditor: "Open Editor", logoZoom: "Enable logo zoom-in animation", bgZoom: "Enable background zoom-out animation",
        launchImage: "Launch image", noLaunchImage: "No launch image selected", chooseLaunchImage: "Choose fullscreen launch image", clearLaunchImage: "Clear launch image",
        editorTitle: "Editor", close: "Close", saving: "Saving...", editorSaveFailed: "Could not save the editor settings.", backgroundOpacity: "Background opacity", logoShadowOpacity: "Logo shadow opacity", logoShadowBlur: "Logo shadow blur", up: "Up", down: "Down", left: "Left", right: "Right", reset: "Reset", smaller: "Smaller", bigger: "Bigger", cancel: "Cancel", save: "Save",
        downloadBackgrounds: "Download backgrounds", scrapers: "Background scrapers", scrapersHelp: "Choose one source, search for the game, then select a background.", searchQuery: "Search query", search: "Search", searching: "Searching...", download: "Download",
        searchPlayStation: "Search PlayStation Store", searchingPlayStation: "Searching PlayStation Store...", choosePlayStationGame: "Choose the matching PlayStation game.", playStationGame: "PlayStation game", viewBackgrounds: "View backgrounds", loading: "Loading...", backToResults: "Back to results", readingBackgrounds: "Reading backgrounds for", chooseBackground: "Choose a PlayStation background.", noBackgrounds: "No suitable backgrounds found.", noPlayStationGames: "No PlayStation Store games found.",
        background: "Background", gameWallpaper: "Game wallpaper", enterSearchQuery: "Enter a search query.", searchFailed: "The search could not be completed.", gameTitleUnavailable: "Could not read the game title from Steam.", imagesFound: "Images found.", noImagesFound: "No images found.", imageDownloaded: "Launch image downloaded.", imageDownloadFailed: "Could not download the image.", chooseFileNotFolder: "Choose a file, not a folder.", imagePickerFailed: "Could not choose a launch image.", noGameSelected: "No game selected.",
        launchStarting: "Starting game...", launchCheckingLicense: "Checking license...", launchCheckingFiles: "Checking game files...", launchInstallingComponents: "Installing required components...", launchSyncingCloud: "Synchronizing Steam Cloud...", launchSyncingStats: "Synchronizing statistics...", launchSyncingController: "Loading controller configuration...", launchPreparing: "Preparing launch...", launchDelayed: "Launch delayed...", launchWaitingConfirmation: "Waiting for confirmation...", launchWaitingGame: "Waiting for the game...", launchUpdating: "Updating game..."
    },
    it: {
        soundbites: "Soundbites", soundbitesHelp: "Riproduce un breve jingle specifico del gioco mentre Launch Curtain è visibile.", soundbiteVolume: "Volume Soundbite", soundbiteMasterVolume: "Volume generale Soundbites", soundbiteMasterVolumeHelp: "Si applica sopra al volume individuale di ogni gioco senza modificarlo.", searchIidbSoundbites: "Cerca Soundbites su iiDB", searchingIidbSoundbites: "Ricerca Soundbites su iiDB...", noIidbSoundbites: "Nessun Soundbite iiDB trovato.", previewSoundbite: "Anteprima", stopSoundbitePreview: "Ferma anteprima", downloadApplySoundbite: "Scarica e applica", importSoundbite: "Importa Soundbite", removeSoundbite: "Rimuovi Soundbite", soundbiteLocal: "File locale", soundbiteIidb: "iiDB", soundbiteImported: "Soundbite locale importato.", soundbiteImportFailed: "Non è stato possibile importare il Soundbite.", soundbiteDownloadFailed: "Non è stato possibile scaricare il Soundbite.", playStationAssets: "Asset PlayStation", iidbAssets: "Asset iiDB", iidbSoundbites: "Soundbites iiDB", downloadIidbAssets: "Scarica Asset iiDB", removeIidbAssets: "Rimuovi Asset iiDB", downloadingIidbAssets: "Download Asset iiDB", removingIidbAssets: "Rimozione Asset iiDB", bulkSoundbites: "Scarica Soundbites iiDB mancanti", removeIidbSoundbites: "Rimuovi Soundbites iiDB", downloadingSoundbites: "Download Soundbites", removingSoundbites: "Rimozione Soundbites iiDB", showGamesWithoutSoundbites: "Mostra giochi senza Soundbites", hideGamesWithoutSoundbites: "Nascondi giochi senza Soundbites", showGamesWithSoundbites: "Mostra giochi con Soundbites", hideGamesWithSoundbites: "Nascondi giochi con Soundbites", manageSoundbiteExclusions: "Esclusioni assegnazione automatica Soundbites", soundbiteExclusionHelp: "I giochi esclusi vengono ignorati dall'assegnazione automatica dei Soundbites.", excluded: "Escluso", included: "Incluso", noGamesWithoutSoundbites: "Tutti i giochi della libreria hanno già un Soundbite oppure sono esclusi.", noGamesWithSoundbites: "Nessun gioco della libreria ha attualmente un Soundbite.", playStationAssetProtectionHelp: "Gli Asset PlayStation vengono applicati solo ai giochi installati senza una curtain esistente. Gli asset iiDB e quelli locali/manuali non vengono mai sostituiti.", iidbAssetProtectionHelp: "Gli Asset iiDB vengono applicati solo ai giochi senza una curtain esistente. Gli asset PlayStation e quelli manuali non vengono mai sostituiti.", bulkApplied: "Applicati", bulkSkipped: "Saltati", bulkFailed: "Non riusciti", bulkStop: "Ferma", bulkStopped: "Interrotto", iidb: "iiDB", assets: "Asset", yes: "Sì", no: "No", deleteUnusedSoundbites: "Elimina Soundbites non utilizzati", cleanupUnusedSoundbitesFailed: "Non è stato possibile eliminare i Soundbites non utilizzati.", confirmRemovePlayStationAssets: "Rimuovere tutti gli asset di lancio gestiti da PlayStation? Le immagini selezionate manualmente e gli asset iiDB verranno preservati.", confirmRemoveIidbAssets: "Rimuovere tutti gli asset di lancio gestiti da iiDB? Gli asset PlayStation e le immagini selezionate manualmente verranno preservati.", confirmRemoveIidbSoundbites: "Rimuovere tutti i Soundbites gestiti da iiDB attualmente assegnati ai giochi? I Soundbites locali verranno preservati.", confirmDeleteUnusedSoundbites: "Eliminare solo i file Soundbite iiDB che non sono più assegnati ad alcun gioco? I file locali/importati e i Soundbites attivi verranno preservati.", confirmDeleteUnusedImages: "Eliminare solo le immagini nella cartella gestita da Launch Curtain che non sono più utilizzate da alcun gioco?", whatToEdit: "Cosa vuoi modificare?", steamGridApiKey: "Chiave API SteamGridDB", steamGridApiHelp: "La ricerca Hero di SteamGridDB usa la tua chiave API personale. Launch Curtain non include alcuna chiave API.", steamGridApiPage: "Apri pagina API SteamGridDB", steamGridCredits: "Gli artwork Hero sono forniti tramite le API di SteamGridDB e rimangono contenuti di terze parti.", iisuCredits: "Un ringraziamento speciale al team e alla community di iiSU per aver creato iiDB e per l’incredibile lavoro dietro la sua collezione in continua crescita di artwork e Soundbites. La loro passione per la presentazione, la preservazione e la cura degli asset dei videogiochi ha reso possibile l’integrazione di iiDB in Launch Curtain. Un enorme grazie per aver costruito una risorsa così preziosa per la community videoludica e per aver reso questi asset accessibili a progetti come questo.", steamGridApiPlaceholder: "Incolla la tua chiave API personale", saveSteamGridApiKey: "Salva chiave API SteamGridDB", steamGridApiSaved: "Chiave API SteamGridDB salvata.", steamGridApiCleared: "Chiave API SteamGridDB rimossa.", steamGridApiSaveFailed: "Non è stato possibile salvare la chiave API SteamGridDB.", steamGridApiRequired: "Configura la tua chiave API personale di SteamGridDB nel QAM di Launch Curtain prima di effettuare la ricerca.", steamGridHeroOnlyHelp: "La ricerca SteamGridDB mostra esclusivamente artwork Hero.",
        maintenance: "Manutenzione", refreshGameCache: "Aggiorna cache giochi", deleteUnusedImages: "Elimina immagini inutilizzate", backup: "Backup", backupHelp: "Crea o ripristina un backup completo di impostazioni, curtain, Soundbites e file locali referenziati da Launch Curtain. Il backup include anche le impostazioni dei servizi salvate, come la chiave API SteamGridDB.", createBackup: "Crea backup", restoreBackup: "Ripristina backup", backupCreated: "Backup creato in", backupRestored: "Backup ripristinato correttamente.", backupFailed: "Non è stato possibile creare il backup.", restoreBackupFailed: "Non è stato possibile ripristinare il backup.", backupMissingFiles: "Alcuni file esterni non sono stati inclusi.", confirmRestoreBackup: "Ripristinare questo backup? Le impostazioni e i file gestiti attuali di Launch Curtain verranno sostituiti. Prima del ripristino viene creata automaticamente una copia temporanea di rollback.",
        downloadPlayStationAssetsInstalled: "Scarica asset PS dei giochi installati", noInstalledGames: "Nessun gioco Steam installato trovato.",
        downloadPlayStationAssets: "Scarica asset PlayStation", removePlayStationAssets: "Rimuovi asset PlayStation", downloadingPlayStationAssets: "Download asset PlayStation", removingPlayStationAssets: "Rimozione asset PlayStation", playStationBulkApplied: "Applicati", playStationBulkRemoved: "Rimossi", playStationBulkSkipped: "Saltati", playStationBulkFailed: "Non riusciti", playStationBulkError: "Non è stato possibile completare l'operazione PlayStation",
        tabGame: "Gioco", tabAppearance: "Aspetto", tabScrapers: "Scraper",
        gameBehavior: "Comportamento di Launch Curtain", gameBehaviorHelp: "Scegli come deve comportarsi Launch Curtain con questo gioco.", enableForGame: "Attiva Launch Curtain per questo gioco",
        logoHelp: "Gestisci il logo del gioco e apri l'editor visuale.", showLogo: "Mostra logo", openEditor: "Apri Editor", logoZoom: "Attiva animazione zoom-in del logo", bgZoom: "Attiva animazione zoom-out dello sfondo",
        launchImage: "Immagine di lancio", noLaunchImage: "Nessuna immagine di lancio selezionata", chooseLaunchImage: "Scegli immagine di lancio a schermo intero", clearLaunchImage: "Rimuovi immagine di lancio",
        editorTitle: "Editor", close: "Chiudi", saving: "Salvataggio...", editorSaveFailed: "Non è stato possibile salvare le impostazioni dell'editor.", backgroundOpacity: "Opacità dello sfondo", logoShadowOpacity: "Opacità ombra del logo", logoShadowBlur: "Blur ombra del logo", up: "Su", down: "Giù", left: "Sinistra", right: "Destra", reset: "Ripristina", smaller: "Più piccolo", bigger: "Più grande", cancel: "Annulla", save: "Salva",
        downloadBackgrounds: "Download sfondi", scrapers: "Scraper degli sfondi", scrapersHelp: "Scegli una sorgente, cerca il gioco e poi seleziona uno sfondo.", searchQuery: "Testo da cercare", search: "Cerca", searching: "Ricerca in corso...", download: "Scarica",
        searchPlayStation: "Cerca nel PlayStation Store", searchingPlayStation: "Ricerca nel PlayStation Store...", choosePlayStationGame: "Scegli il gioco PlayStation corretto.", playStationGame: "Gioco PlayStation", viewBackgrounds: "Vedi sfondi", loading: "Caricamento...", backToResults: "Torna ai risultati", readingBackgrounds: "Lettura degli sfondi per", chooseBackground: "Scegli uno sfondo PlayStation.", noBackgrounds: "Nessuno sfondo adatto trovato.", noPlayStationGames: "Nessun gioco trovato nel PlayStation Store.",
        background: "Sfondo", gameWallpaper: "Sfondo del gioco", enterSearchQuery: "Inserisci un testo da cercare.", searchFailed: "Non è stato possibile completare la ricerca.", gameTitleUnavailable: "Non è stato possibile leggere il titolo del gioco da Steam.", imagesFound: "Immagini trovate.", noImagesFound: "Nessuna immagine trovata.", imageDownloaded: "Immagine di lancio scaricata.", imageDownloadFailed: "Non è stato possibile scaricare l'immagine.", chooseFileNotFolder: "Scegli un file, non una cartella.", imagePickerFailed: "Non è stato possibile scegliere l'immagine di lancio.", noGameSelected: "Nessun gioco selezionato.",
        launchStarting: "Avvio del gioco...", launchCheckingLicense: "Verifica della licenza...", launchCheckingFiles: "Verifica dei file di gioco...", launchInstallingComponents: "Installazione dei componenti necessari...", launchSyncingCloud: "Sincronizzazione di Steam Cloud...", launchSyncingStats: "Sincronizzazione delle statistiche...", launchSyncingController: "Caricamento della configurazione controller...", launchPreparing: "Preparazione dell'avvio...", launchDelayed: "Avvio ritardato...", launchWaitingConfirmation: "In attesa di conferma...", launchWaitingGame: "In attesa del gioco...", launchUpdating: "Aggiornamento del gioco..."
    }
};

const EXTRA_TRANSLATIONS = {
    fr: {
        timeoutEnabled: "Activer le délai d'expiration", modeAuto: "Automatique", forceMode: "Forcer le mode", gameTimeout: "Délai du jeu", gameTimeoutSeconds: "Délai du jeu (secondes)", timeoutHelp: "Masque automatiquement le rideau lorsque le délai expire.", timeoutDisabledHelp: "Le rideau reste affiché jusqu'à la détection du jeu.", exitDelay: "Délai de sortie", exitDelayHelp: "Maintient le rideau visible un peu plus longtemps après la détection du jeu.",
        maintenance: "Maintenance", refreshGameCache: "Actualiser le cache des jeux", deleteUnusedImages: "Supprimer les images inutilisées",
        downloadPlayStationAssetsInstalled: "Télécharger les ressources PS des jeux installés", noInstalledGames: "Aucun jeu Steam installé n'a été trouvé.",
        downloadPlayStationAssets: "Télécharger les ressources PlayStation", removePlayStationAssets: "Supprimer les ressources PlayStation", downloadingPlayStationAssets: "Téléchargement des ressources PlayStation", removingPlayStationAssets: "Suppression des ressources PlayStation", playStationBulkApplied: "Appliquées", playStationBulkRemoved: "Supprimées", playStationBulkSkipped: "Ignorées", playStationBulkFailed: "Échecs", playStationBulkError: "L'opération groupée PlayStation n'a pas pu être terminée",
        tabGame: "Jeu", tabAppearance: "Apparence", tabScrapers: "Sources", gameBehavior: "Comportement de Launch Curtain", gameBehaviorHelp: "Choisissez le comportement de Launch Curtain pour ce jeu.", enableForGame: "Activer Launch Curtain pour ce jeu",
        logoHelp: "Gérez le logo du jeu et ouvrez l'éditeur visuel.", showLogo: "Afficher le logo", openEditor: "Ouvrir l'éditeur", logoZoom: "Activer l'animation de zoom avant du logo", bgZoom: "Activer l'animation de zoom arrière de l'arrière-plan",
        launchImage: "Image de lancement", noLaunchImage: "Aucune image de lancement sélectionnée", chooseLaunchImage: "Choisir une image de lancement plein écran", clearLaunchImage: "Supprimer l'image de lancement",
        editorTitle: "Éditeur", close: "Fermer", saving: "Enregistrement...", editorSaveFailed: "Impossible d'enregistrer les paramètres de l'éditeur.", backgroundOpacity: "Opacité de l'arrière-plan", logoShadowOpacity: "Opacité de l'ombre du logo", logoShadowBlur: "Flou de l'ombre du logo", up: "Haut", down: "Bas", left: "Gauche", right: "Droite", reset: "Réinitialiser", smaller: "Réduire", bigger: "Agrandir", cancel: "Annuler", save: "Enregistrer",
        downloadBackgrounds: "Télécharger des arrière-plans", scrapers: "Sources d'arrière-plans", scrapersHelp: "Choisissez une source, recherchez le jeu, puis sélectionnez un arrière-plan.", searchQuery: "Texte à rechercher", search: "Rechercher", searching: "Recherche...", download: "Télécharger",
        searchPlayStation: "Rechercher sur le PlayStation Store", searchingPlayStation: "Recherche sur le PlayStation Store...", choosePlayStationGame: "Choisissez le jeu PlayStation correspondant.", playStationGame: "Jeu PlayStation", viewBackgrounds: "Voir les arrière-plans", loading: "Chargement...", backToResults: "Retour aux résultats", readingBackgrounds: "Lecture des arrière-plans pour", chooseBackground: "Choisissez un arrière-plan PlayStation.", noBackgrounds: "Aucun arrière-plan adapté trouvé.", noPlayStationGames: "Aucun jeu trouvé sur le PlayStation Store.",
        background: "Arrière-plan", gameWallpaper: "Fond d'écran du jeu", enterSearchQuery: "Saisissez un texte à rechercher.", searchFailed: "La recherche n'a pas pu être terminée.", gameTitleUnavailable: "Impossible de lire le titre du jeu depuis Steam.", imagesFound: "Images trouvées.", noImagesFound: "Aucune image trouvée.", imageDownloaded: "Image de lancement téléchargée.", imageDownloadFailed: "Impossible de télécharger l'image.", chooseFileNotFolder: "Choisissez un fichier, pas un dossier.", imagePickerFailed: "Impossible de choisir l'image de lancement.", noGameSelected: "Aucun jeu sélectionné.",
        launchStarting: "Démarrage du jeu...", launchCheckingLicense: "Vérification de la licence...", launchCheckingFiles: "Vérification des fichiers du jeu...", launchInstallingComponents: "Installation des composants requis...", launchSyncingCloud: "Synchronisation de Steam Cloud...", launchSyncingStats: "Synchronisation des statistiques...", launchSyncingController: "Chargement de la configuration de la manette...", launchPreparing: "Préparation du lancement...", launchDelayed: "Lancement retardé...", launchWaitingConfirmation: "En attente de confirmation...", launchWaitingGame: "En attente du jeu...", launchUpdating: "Mise à jour du jeu..."
    },
    es: {
        timeoutEnabled: "Activar tiempo de espera", modeAuto: "Automático", forceMode: "Forzar modo", gameTimeout: "Tiempo de espera del juego", gameTimeoutSeconds: "Tiempo de espera del juego (segundos)", timeoutHelp: "Oculta automáticamente la cortina cuando se agota el tiempo.", timeoutDisabledHelp: "La cortina permanece visible hasta que se detecta el juego.", exitDelay: "Retraso de salida", exitDelayHelp: "Mantiene la cortina visible un poco más después de detectar el juego.",
        maintenance: "Mantenimiento", refreshGameCache: "Actualizar caché de juegos", deleteUnusedImages: "Eliminar imágenes sin usar", downloadPlayStationAssetsInstalled: "Descargar recursos de PS para juegos instalados", noInstalledGames: "No se encontraron juegos de Steam instalados.", downloadPlayStationAssets: "Descargar recursos de PlayStation", removePlayStationAssets: "Eliminar recursos de PlayStation", downloadingPlayStationAssets: "Descargando recursos de PlayStation", removingPlayStationAssets: "Eliminando recursos de PlayStation", playStationBulkApplied: "Aplicados", playStationBulkRemoved: "Eliminados", playStationBulkSkipped: "Omitidos", playStationBulkFailed: "Fallidos", playStationBulkError: "No se pudo completar la operación por lotes de PlayStation",
        tabGame: "Juego", tabAppearance: "Apariencia", tabScrapers: "Fuentes", gameBehavior: "Comportamiento de Launch Curtain", gameBehaviorHelp: "Elige cómo se comportará Launch Curtain con este juego.", enableForGame: "Activar Launch Curtain para este juego", logoHelp: "Controla el logotipo del juego y abre el editor visual.", showLogo: "Mostrar logotipo", openEditor: "Abrir editor", logoZoom: "Activar animación de acercamiento del logotipo", bgZoom: "Activar animación de alejamiento del fondo",
        launchImage: "Imagen de inicio", noLaunchImage: "No hay ninguna imagen de inicio seleccionada", chooseLaunchImage: "Elegir imagen de inicio a pantalla completa", clearLaunchImage: "Quitar imagen de inicio", editorTitle: "Editor", close: "Cerrar", saving: "Guardando...", editorSaveFailed: "No se pudieron guardar los ajustes del editor.", backgroundOpacity: "Opacidad del fondo", logoShadowOpacity: "Opacidad de la sombra del logotipo", logoShadowBlur: "Desenfoque de la sombra del logotipo", up: "Arriba", down: "Abajo", left: "Izquierda", right: "Derecha", reset: "Restablecer", smaller: "Más pequeño", bigger: "Más grande", cancel: "Cancelar", save: "Guardar",
        downloadBackgrounds: "Descargar fondos", scrapers: "Fuentes de fondos", scrapersHelp: "Elige una fuente, busca el juego y selecciona un fondo.", searchQuery: "Texto de búsqueda", search: "Buscar", searching: "Buscando...", download: "Descargar", searchPlayStation: "Buscar en PlayStation Store", searchingPlayStation: "Buscando en PlayStation Store...", choosePlayStationGame: "Elige el juego de PlayStation correspondiente.", playStationGame: "Juego de PlayStation", viewBackgrounds: "Ver fondos", loading: "Cargando...", backToResults: "Volver a los resultados", readingBackgrounds: "Leyendo fondos para", chooseBackground: "Elige un fondo de PlayStation.", noBackgrounds: "No se encontraron fondos adecuados.", noPlayStationGames: "No se encontraron juegos en PlayStation Store.",
        background: "Fondo", gameWallpaper: "Fondo del juego", enterSearchQuery: "Introduce un texto de búsqueda.", searchFailed: "No se pudo completar la búsqueda.", gameTitleUnavailable: "No se pudo leer el título del juego desde Steam.", imagesFound: "Imágenes encontradas.", noImagesFound: "No se encontraron imágenes.", imageDownloaded: "Imagen de inicio descargada.", imageDownloadFailed: "No se pudo descargar la imagen.", chooseFileNotFolder: "Elige un archivo, no una carpeta.", imagePickerFailed: "No se pudo elegir la imagen de inicio.", noGameSelected: "No hay ningún juego seleccionado.", launchStarting: "Iniciando juego...", launchCheckingLicense: "Comprobando licencia...", launchCheckingFiles: "Comprobando archivos del juego...", launchInstallingComponents: "Instalando componentes necesarios...", launchSyncingCloud: "Sincronizando Steam Cloud...", launchSyncingStats: "Sincronizando estadísticas...", launchSyncingController: "Cargando configuración del mando...", launchPreparing: "Preparando el inicio...", launchDelayed: "Inicio retrasado...", launchWaitingConfirmation: "Esperando confirmación...", launchWaitingGame: "Esperando al juego...", launchUpdating: "Actualizando juego..."
    },
    de: {
        timeoutEnabled: "Zeitlimit aktivieren", modeAuto: "Automatisch", forceMode: "Modus erzwingen", gameTimeout: "Spiel-Zeitlimit", gameTimeoutSeconds: "Spiel-Zeitlimit (Sekunden)", timeoutHelp: "Blendet den Vorhang nach Ablauf des Zeitlimits automatisch aus.", timeoutDisabledHelp: "Der Vorhang bleibt sichtbar, bis das Spiel erkannt wird.", exitDelay: "Ausblendverzögerung", exitDelayHelp: "Lässt den Vorhang nach der Spielerkennung etwas länger sichtbar.",
        maintenance: "Wartung", refreshGameCache: "Spiele-Cache aktualisieren", deleteUnusedImages: "Ungenutzte Bilder löschen", downloadPlayStationAssetsInstalled: "PS-Assets für installierte Spiele laden", noInstalledGames: "Keine installierten Steam-Spiele gefunden.", downloadPlayStationAssets: "PlayStation-Assets herunterladen", removePlayStationAssets: "PlayStation-Assets entfernen", downloadingPlayStationAssets: "PlayStation-Assets werden heruntergeladen", removingPlayStationAssets: "PlayStation-Assets werden entfernt", playStationBulkApplied: "Angewendet", playStationBulkRemoved: "Entfernt", playStationBulkSkipped: "Übersprungen", playStationBulkFailed: "Fehlgeschlagen", playStationBulkError: "Der PlayStation-Sammelvorgang konnte nicht abgeschlossen werden",
        tabGame: "Spiel", tabAppearance: "Darstellung", tabScrapers: "Quellen", gameBehavior: "Verhalten von Launch Curtain", gameBehaviorHelp: "Lege fest, wie sich Launch Curtain bei diesem Spiel verhält.", enableForGame: "Launch Curtain für dieses Spiel aktivieren", logoHelp: "Verwalte das Spiellogo und öffne den visuellen Editor.", showLogo: "Logo anzeigen", openEditor: "Editor öffnen", logoZoom: "Einzoom-Animation des Logos aktivieren", bgZoom: "Auszoom-Animation des Hintergrunds aktivieren",
        launchImage: "Startbild", noLaunchImage: "Kein Startbild ausgewählt", chooseLaunchImage: "Vollbild-Startbild auswählen", clearLaunchImage: "Startbild entfernen", editorTitle: "Editor", close: "Schließen", saving: "Speichern...", editorSaveFailed: "Die Editor-Einstellungen konnten nicht gespeichert werden.", backgroundOpacity: "Hintergrunddeckkraft", logoShadowOpacity: "Deckkraft des Logoschattens", logoShadowBlur: "Unschärfe des Logoschattens", up: "Oben", down: "Unten", left: "Links", right: "Rechts", reset: "Zurücksetzen", smaller: "Kleiner", bigger: "Größer", cancel: "Abbrechen", save: "Speichern",
        downloadBackgrounds: "Hintergründe herunterladen", scrapers: "Hintergrundquellen", scrapersHelp: "Wähle eine Quelle, suche nach dem Spiel und wähle anschließend einen Hintergrund.", searchQuery: "Suchbegriff", search: "Suchen", searching: "Suche...", download: "Herunterladen", searchPlayStation: "Im PlayStation Store suchen", searchingPlayStation: "PlayStation Store wird durchsucht...", choosePlayStationGame: "Wähle das passende PlayStation-Spiel.", playStationGame: "PlayStation-Spiel", viewBackgrounds: "Hintergründe anzeigen", loading: "Laden...", backToResults: "Zurück zu den Ergebnissen", readingBackgrounds: "Hintergründe werden gelesen für", chooseBackground: "Wähle einen PlayStation-Hintergrund.", noBackgrounds: "Keine passenden Hintergründe gefunden.", noPlayStationGames: "Keine Spiele im PlayStation Store gefunden.",
        background: "Hintergrund", gameWallpaper: "Spielhintergrund", enterSearchQuery: "Gib einen Suchbegriff ein.", searchFailed: "Die Suche konnte nicht abgeschlossen werden.", gameTitleUnavailable: "Der Spieltitel konnte nicht aus Steam gelesen werden.", imagesFound: "Bilder gefunden.", noImagesFound: "Keine Bilder gefunden.", imageDownloaded: "Startbild heruntergeladen.", imageDownloadFailed: "Das Bild konnte nicht heruntergeladen werden.", chooseFileNotFolder: "Wähle eine Datei, keinen Ordner.", imagePickerFailed: "Das Startbild konnte nicht ausgewählt werden.", noGameSelected: "Kein Spiel ausgewählt.", launchStarting: "Spiel wird gestartet...", launchCheckingLicense: "Lizenz wird geprüft...", launchCheckingFiles: "Spieldateien werden geprüft...", launchInstallingComponents: "Erforderliche Komponenten werden installiert...", launchSyncingCloud: "Steam Cloud wird synchronisiert...", launchSyncingStats: "Statistiken werden synchronisiert...", launchSyncingController: "Controller-Konfiguration wird geladen...", launchPreparing: "Start wird vorbereitet...", launchDelayed: "Start verzögert...", launchWaitingConfirmation: "Warten auf Bestätigung...", launchWaitingGame: "Warten auf das Spiel...", launchUpdating: "Spiel wird aktualisiert..."
    },
    pt: {
        timeoutEnabled: "Ativar tempo limite", modeAuto: "Automático", forceMode: "Forçar modo", gameTimeout: "Tempo limite do jogo", gameTimeoutSeconds: "Tempo limite do jogo (segundos)", timeoutHelp: "Oculta automaticamente a cortina quando o tempo limite termina.", timeoutDisabledHelp: "A cortina permanece visível até o jogo ser detetado.", exitDelay: "Atraso de saída", exitDelayHelp: "Mantém a cortina visível por mais algum tempo depois de detetar o jogo.",
        maintenance: "Manutenção", refreshGameCache: "Atualizar cache de jogos", deleteUnusedImages: "Eliminar imagens não utilizadas", downloadPlayStationAssetsInstalled: "Transferir recursos PS dos jogos instalados", noInstalledGames: "Não foram encontrados jogos Steam instalados.", downloadPlayStationAssets: "Transferir recursos PlayStation", removePlayStationAssets: "Remover recursos PlayStation", downloadingPlayStationAssets: "A transferir recursos PlayStation", removingPlayStationAssets: "A remover recursos PlayStation", playStationBulkApplied: "Aplicados", playStationBulkRemoved: "Removidos", playStationBulkSkipped: "Ignorados", playStationBulkFailed: "Falharam", playStationBulkError: "Não foi possível concluir a operação em lote da PlayStation",
        tabGame: "Jogo", tabAppearance: "Aspeto", tabScrapers: "Fontes", gameBehavior: "Comportamento do Launch Curtain", gameBehaviorHelp: "Escolha como o Launch Curtain se comporta neste jogo.", enableForGame: "Ativar Launch Curtain neste jogo", logoHelp: "Controle o logótipo do jogo e abra o editor visual.", showLogo: "Mostrar logótipo", openEditor: "Abrir editor", logoZoom: "Ativar animação de aproximação do logótipo", bgZoom: "Ativar animação de afastamento do fundo",
        launchImage: "Imagem de arranque", noLaunchImage: "Nenhuma imagem de arranque selecionada", chooseLaunchImage: "Escolher imagem de arranque em ecrã inteiro", clearLaunchImage: "Remover imagem de arranque", editorTitle: "Editor", close: "Fechar", saving: "A guardar...", editorSaveFailed: "Não foi possível guardar as definições do editor.", backgroundOpacity: "Opacidade do fundo", logoShadowOpacity: "Opacidade da sombra do logótipo", logoShadowBlur: "Desfoque da sombra do logótipo", up: "Cima", down: "Baixo", left: "Esquerda", right: "Direita", reset: "Repor", smaller: "Menor", bigger: "Maior", cancel: "Cancelar", save: "Guardar",
        downloadBackgrounds: "Transferir fundos", scrapers: "Fontes de fundos", scrapersHelp: "Escolha uma fonte, procure o jogo e selecione um fundo.", searchQuery: "Texto de pesquisa", search: "Pesquisar", searching: "A pesquisar...", download: "Transferir", searchPlayStation: "Pesquisar na PlayStation Store", searchingPlayStation: "A pesquisar na PlayStation Store...", choosePlayStationGame: "Escolha o jogo PlayStation correspondente.", playStationGame: "Jogo PlayStation", viewBackgrounds: "Ver fundos", loading: "A carregar...", backToResults: "Voltar aos resultados", readingBackgrounds: "A ler fundos para", chooseBackground: "Escolha um fundo PlayStation.", noBackgrounds: "Não foram encontrados fundos adequados.", noPlayStationGames: "Não foram encontrados jogos na PlayStation Store.",
        background: "Fundo", gameWallpaper: "Fundo do jogo", enterSearchQuery: "Introduza um texto de pesquisa.", searchFailed: "Não foi possível concluir a pesquisa.", gameTitleUnavailable: "Não foi possível ler o título do jogo no Steam.", imagesFound: "Imagens encontradas.", noImagesFound: "Nenhuma imagem encontrada.", imageDownloaded: "Imagem de arranque transferida.", imageDownloadFailed: "Não foi possível transferir a imagem.", chooseFileNotFolder: "Escolha um ficheiro, não uma pasta.", imagePickerFailed: "Não foi possível escolher a imagem de arranque.", noGameSelected: "Nenhum jogo selecionado.", launchStarting: "A iniciar o jogo...", launchCheckingLicense: "A verificar a licença...", launchCheckingFiles: "A verificar os ficheiros do jogo...", launchInstallingComponents: "A instalar os componentes necessários...", launchSyncingCloud: "A sincronizar o Steam Cloud...", launchSyncingStats: "A sincronizar estatísticas...", launchSyncingController: "A carregar a configuração do comando...", launchPreparing: "A preparar o arranque...", launchDelayed: "Arranque atrasado...", launchWaitingConfirmation: "A aguardar confirmação...", launchWaitingGame: "A aguardar o jogo...", launchUpdating: "A atualizar o jogo..."
    },
    "pt-br": {
        timeoutEnabled: "Ativar tempo limite", modeAuto: "Automático", forceMode: "Forçar modo", gameTimeout: "Tempo limite do jogo", gameTimeoutSeconds: "Tempo limite do jogo (segundos)", timeoutHelp: "Oculta automaticamente a cortina quando o tempo limite termina.", timeoutDisabledHelp: "A cortina permanece visível até o jogo ser detectado.", exitDelay: "Atraso de saída", exitDelayHelp: "Mantém a cortina visível por mais algum tempo depois de detectar o jogo.",
        maintenance: "Manutenção", refreshGameCache: "Atualizar cache de jogos", deleteUnusedImages: "Excluir imagens não utilizadas", downloadPlayStationAssetsInstalled: "Baixar recursos PS dos jogos instalados", noInstalledGames: "Nenhum jogo Steam instalado foi encontrado.", downloadPlayStationAssets: "Baixar recursos do PlayStation", removePlayStationAssets: "Remover recursos do PlayStation", downloadingPlayStationAssets: "Baixando recursos do PlayStation", removingPlayStationAssets: "Removendo recursos do PlayStation", playStationBulkApplied: "Aplicados", playStationBulkRemoved: "Removidos", playStationBulkSkipped: "Ignorados", playStationBulkFailed: "Falharam", playStationBulkError: "Não foi possível concluir a operação em lote do PlayStation",
        tabGame: "Jogo", tabAppearance: "Aparência", tabScrapers: "Fontes", gameBehavior: "Comportamento do Launch Curtain", gameBehaviorHelp: "Escolha como o Launch Curtain se comporta neste jogo.", enableForGame: "Ativar Launch Curtain neste jogo", logoHelp: "Controle o logotipo do jogo e abra o editor visual.", showLogo: "Mostrar logotipo", openEditor: "Abrir editor", logoZoom: "Ativar animação de aproximação do logotipo", bgZoom: "Ativar animação de afastamento do fundo",
        launchImage: "Imagem de inicialização", noLaunchImage: "Nenhuma imagem de inicialização selecionada", chooseLaunchImage: "Escolher imagem de inicialização em tela cheia", clearLaunchImage: "Remover imagem de inicialização", editorTitle: "Editor", close: "Fechar", saving: "Salvando...", editorSaveFailed: "Não foi possível salvar as configurações do editor.", backgroundOpacity: "Opacidade do fundo", logoShadowOpacity: "Opacidade da sombra do logotipo", logoShadowBlur: "Desfoque da sombra do logotipo", up: "Cima", down: "Baixo", left: "Esquerda", right: "Direita", reset: "Redefinir", smaller: "Menor", bigger: "Maior", cancel: "Cancelar", save: "Salvar",
        downloadBackgrounds: "Baixar fundos", scrapers: "Fontes de fundos", scrapersHelp: "Escolha uma fonte, pesquise o jogo e selecione um fundo.", searchQuery: "Texto de pesquisa", search: "Pesquisar", searching: "Pesquisando...", download: "Baixar", searchPlayStation: "Pesquisar na PlayStation Store", searchingPlayStation: "Pesquisando na PlayStation Store...", choosePlayStationGame: "Escolha o jogo PlayStation correspondente.", playStationGame: "Jogo PlayStation", viewBackgrounds: "Ver fundos", loading: "Carregando...", backToResults: "Voltar aos resultados", readingBackgrounds: "Lendo fundos para", chooseBackground: "Escolha um fundo do PlayStation.", noBackgrounds: "Nenhum fundo adequado encontrado.", noPlayStationGames: "Nenhum jogo encontrado na PlayStation Store.",
        background: "Fundo", gameWallpaper: "Papel de parede do jogo", enterSearchQuery: "Digite um texto de pesquisa.", searchFailed: "Não foi possível concluir a pesquisa.", gameTitleUnavailable: "Não foi possível ler o título do jogo no Steam.", imagesFound: "Imagens encontradas.", noImagesFound: "Nenhuma imagem encontrada.", imageDownloaded: "Imagem de inicialização baixada.", imageDownloadFailed: "Não foi possível baixar a imagem.", chooseFileNotFolder: "Escolha um arquivo, não uma pasta.", imagePickerFailed: "Não foi possível escolher a imagem de inicialização.", noGameSelected: "Nenhum jogo selecionado.", launchStarting: "Iniciando o jogo...", launchCheckingLicense: "Verificando a licença...", launchCheckingFiles: "Verificando os arquivos do jogo...", launchInstallingComponents: "Instalando os componentes necessários...", launchSyncingCloud: "Sincronizando o Steam Cloud...", launchSyncingStats: "Sincronizando estatísticas...", launchSyncingController: "Carregando a configuração do controle...", launchPreparing: "Preparando a inicialização...", launchDelayed: "Inicialização atrasada...", launchWaitingConfirmation: "Aguardando confirmação...", launchWaitingGame: "Aguardando o jogo...", launchUpdating: "Atualizando o jogo..."
    },
    nl: {
        timeoutEnabled: "Time-out inschakelen", modeAuto: "Automatisch", forceMode: "Modus forceren", gameTimeout: "Time-out voor spel", gameTimeoutSeconds: "Time-out voor spel (seconden)", timeoutHelp: "Verbergt het gordijn automatisch wanneer de time-out verloopt.", timeoutDisabledHelp: "Het gordijn blijft zichtbaar totdat het spel is gedetecteerd.", exitDelay: "Afsluitvertraging", exitDelayHelp: "Houdt het gordijn iets langer zichtbaar nadat het spel is gedetecteerd.",
        maintenance: "Onderhoud", refreshGameCache: "Spelcache vernieuwen", deleteUnusedImages: "Ongebruikte afbeeldingen verwijderen", downloadPlayStationAssetsInstalled: "PS-assets voor geïnstalleerde spellen downloaden", noInstalledGames: "Er zijn geen geïnstalleerde Steam-spellen gevonden.", downloadPlayStationAssets: "PlayStation-assets downloaden", removePlayStationAssets: "PlayStation-assets verwijderen", downloadingPlayStationAssets: "PlayStation-assets downloaden", removingPlayStationAssets: "PlayStation-assets verwijderen", playStationBulkApplied: "Toegepast", playStationBulkRemoved: "Verwijderd", playStationBulkSkipped: "Overgeslagen", playStationBulkFailed: "Mislukt", playStationBulkError: "De PlayStation-bulkbewerking kon niet worden voltooid",
        tabGame: "Spel", tabAppearance: "Uiterlijk", tabScrapers: "Bronnen", gameBehavior: "Gedrag van Launch Curtain", gameBehaviorHelp: "Kies hoe Launch Curtain zich voor dit spel gedraagt.", enableForGame: "Launch Curtain inschakelen voor dit spel", logoHelp: "Beheer het spellogo en open de visuele editor.", showLogo: "Logo tonen", openEditor: "Editor openen", logoZoom: "Inzoomanimatie van logo inschakelen", bgZoom: "Uitzoomanimatie van achtergrond inschakelen",
        launchImage: "Startafbeelding", noLaunchImage: "Geen startafbeelding geselecteerd", chooseLaunchImage: "Startafbeelding op volledig scherm kiezen", clearLaunchImage: "Startafbeelding verwijderen", editorTitle: "Editor", close: "Sluiten", saving: "Opslaan...", editorSaveFailed: "De editorinstellingen konden niet worden opgeslagen.", backgroundOpacity: "Dekking van achtergrond", logoShadowOpacity: "Dekking van logoschaduw", logoShadowBlur: "Vervaging van logoschaduw", up: "Omhoog", down: "Omlaag", left: "Links", right: "Rechts", reset: "Herstellen", smaller: "Kleiner", bigger: "Groter", cancel: "Annuleren", save: "Opslaan",
        downloadBackgrounds: "Achtergronden downloaden", scrapers: "Achtergrondbronnen", scrapersHelp: "Kies een bron, zoek het spel en selecteer daarna een achtergrond.", searchQuery: "Zoekterm", search: "Zoeken", searching: "Zoeken...", download: "Downloaden", searchPlayStation: "Zoeken in PlayStation Store", searchingPlayStation: "Zoeken in PlayStation Store...", choosePlayStationGame: "Kies het overeenkomende PlayStation-spel.", playStationGame: "PlayStation-spel", viewBackgrounds: "Achtergronden bekijken", loading: "Laden...", backToResults: "Terug naar resultaten", readingBackgrounds: "Achtergronden lezen voor", chooseBackground: "Kies een PlayStation-achtergrond.", noBackgrounds: "Geen geschikte achtergronden gevonden.", noPlayStationGames: "Geen spellen gevonden in PlayStation Store.",
        background: "Achtergrond", gameWallpaper: "Spelachtergrond", enterSearchQuery: "Voer een zoekterm in.", searchFailed: "De zoekopdracht kon niet worden voltooid.", gameTitleUnavailable: "De speltitel kon niet uit Steam worden gelezen.", imagesFound: "Afbeeldingen gevonden.", noImagesFound: "Geen afbeeldingen gevonden.", imageDownloaded: "Startafbeelding gedownload.", imageDownloadFailed: "De afbeelding kon niet worden gedownload.", chooseFileNotFolder: "Kies een bestand, geen map.", imagePickerFailed: "De startafbeelding kon niet worden gekozen.", noGameSelected: "Geen spel geselecteerd.", launchStarting: "Spel starten...", launchCheckingLicense: "Licentie controleren...", launchCheckingFiles: "Spelbestanden controleren...", launchInstallingComponents: "Vereiste onderdelen installeren...", launchSyncingCloud: "Steam Cloud synchroniseren...", launchSyncingStats: "Statistieken synchroniseren...", launchSyncingController: "Controllerconfiguratie laden...", launchPreparing: "Start voorbereiden...", launchDelayed: "Start vertraagd...", launchWaitingConfirmation: "Wachten op bevestiging...", launchWaitingGame: "Wachten op het spel...", launchUpdating: "Spel bijwerken..."
    },
    uk: {
        timeoutEnabled: "Увімкнути тайм-аут", modeAuto: "Автоматично", forceMode: "Примусовий режим", gameTimeout: "Тайм-аут гри", gameTimeoutSeconds: "Тайм-аут гри (секунди)", timeoutHelp: "Автоматично приховує завісу після завершення тайм-ауту.", timeoutDisabledHelp: "Завіса залишається видимою, доки гру не буде виявлено.", exitDelay: "Затримка виходу", exitDelayHelp: "Залишає завісу видимою трохи довше після виявлення гри.",
        maintenance: "Обслуговування", refreshGameCache: "Оновити кеш ігор", deleteUnusedImages: "Видалити невикористані зображення", downloadPlayStationAssetsInstalled: "Завантажити ресурси PS для встановлених ігор", noInstalledGames: "Не знайдено встановлених ігор Steam.", downloadPlayStationAssets: "Завантажити ресурси PlayStation", removePlayStationAssets: "Видалити ресурси PlayStation", downloadingPlayStationAssets: "Завантаження ресурсів PlayStation", removingPlayStationAssets: "Видалення ресурсів PlayStation", playStationBulkApplied: "Застосовано", playStationBulkRemoved: "Видалено", playStationBulkSkipped: "Пропущено", playStationBulkFailed: "Помилки", playStationBulkError: "Не вдалося завершити групову операцію PlayStation",
        tabGame: "Гра", tabAppearance: "Вигляд", tabScrapers: "Джерела", gameBehavior: "Поведінка Launch Curtain", gameBehaviorHelp: "Виберіть поведінку Launch Curtain для цієї гри.", enableForGame: "Увімкнути Launch Curtain для цієї гри", logoHelp: "Керуйте логотипом гри та відкрийте візуальний редактор.", showLogo: "Показувати логотип", openEditor: "Відкрити редактор", logoZoom: "Увімкнути анімацію наближення логотипу", bgZoom: "Увімкнути анімацію віддалення фону",
        launchImage: "Зображення запуску", noLaunchImage: "Зображення запуску не вибрано", chooseLaunchImage: "Вибрати повноекранне зображення запуску", clearLaunchImage: "Видалити зображення запуску", editorTitle: "Редактор", close: "Закрити", saving: "Збереження...", editorSaveFailed: "Не вдалося зберегти налаштування редактора.", backgroundOpacity: "Непрозорість фону", logoShadowOpacity: "Непрозорість тіні логотипу", logoShadowBlur: "Розмиття тіні логотипу", up: "Вгору", down: "Вниз", left: "Ліворуч", right: "Праворуч", reset: "Скинути", smaller: "Менше", bigger: "Більше", cancel: "Скасувати", save: "Зберегти",
        downloadBackgrounds: "Завантажити фони", scrapers: "Джерела фонів", scrapersHelp: "Виберіть джерело, знайдіть гру, а потім виберіть фон.", searchQuery: "Пошуковий запит", search: "Пошук", searching: "Пошук...", download: "Завантажити", searchPlayStation: "Пошук у PlayStation Store", searchingPlayStation: "Пошук у PlayStation Store...", choosePlayStationGame: "Виберіть відповідну гру PlayStation.", playStationGame: "Гра PlayStation", viewBackgrounds: "Переглянути фони", loading: "Завантаження...", backToResults: "Назад до результатів", readingBackgrounds: "Читання фонів для", chooseBackground: "Виберіть фон PlayStation.", noBackgrounds: "Відповідних фонів не знайдено.", noPlayStationGames: "Ігор у PlayStation Store не знайдено.",
        background: "Фон", gameWallpaper: "Шпалери гри", enterSearchQuery: "Введіть пошуковий запит.", searchFailed: "Не вдалося завершити пошук.", gameTitleUnavailable: "Не вдалося прочитати назву гри зі Steam.", imagesFound: "Зображення знайдено.", noImagesFound: "Зображень не знайдено.", imageDownloaded: "Зображення запуску завантажено.", imageDownloadFailed: "Не вдалося завантажити зображення.", chooseFileNotFolder: "Виберіть файл, а не папку.", imagePickerFailed: "Не вдалося вибрати зображення запуску.", noGameSelected: "Гру не вибрано.", launchStarting: "Запуск гри...", launchCheckingLicense: "Перевірка ліцензії...", launchCheckingFiles: "Перевірка файлів гри...", launchInstallingComponents: "Встановлення необхідних компонентів...", launchSyncingCloud: "Синхронізація Steam Cloud...", launchSyncingStats: "Синхронізація статистики...", launchSyncingController: "Завантаження конфігурації контролера...", launchPreparing: "Підготовка запуску...", launchDelayed: "Запуск затримано...", launchWaitingConfirmation: "Очікування підтвердження...", launchWaitingGame: "Очікування гри...", launchUpdating: "Оновлення гри..."
    },
    zh: {
        timeoutEnabled: "启用超时", modeAuto: "自动", forceMode: "强制模式", gameTimeout: "游戏超时", gameTimeoutSeconds: "游戏超时（秒）", timeoutHelp: "超时后自动隐藏启动幕布。", timeoutDisabledHelp: "启动幕布会保持显示，直到检测到游戏。", exitDelay: "退出延迟", exitDelayHelp: "检测到游戏后，让启动幕布继续显示一小段时间。",
        maintenance: "维护", refreshGameCache: "刷新游戏缓存", deleteUnusedImages: "删除未使用的图片", downloadPlayStationAssetsInstalled: "下载已安装游戏的 PS 素材", noInstalledGames: "未找到已安装的 Steam 游戏。", downloadPlayStationAssets: "下载 PlayStation 素材", removePlayStationAssets: "移除 PlayStation 素材", downloadingPlayStationAssets: "正在下载 PlayStation 素材", removingPlayStationAssets: "正在移除 PlayStation 素材", playStationBulkApplied: "已应用", playStationBulkRemoved: "已移除", playStationBulkSkipped: "已跳过", playStationBulkFailed: "失败", playStationBulkError: "无法完成 PlayStation 批量操作",
        tabGame: "游戏", tabAppearance: "外观", tabScrapers: "来源", gameBehavior: "Launch Curtain 行为", gameBehaviorHelp: "选择 Launch Curtain 对此游戏的行为。", enableForGame: "为此游戏启用 Launch Curtain", logoHelp: "管理游戏标志并打开可视化编辑器。", showLogo: "显示标志", openEditor: "打开编辑器", logoZoom: "启用标志放大动画", bgZoom: "启用背景缩小动画",
        launchImage: "启动图片", noLaunchImage: "未选择启动图片", chooseLaunchImage: "选择全屏启动图片", clearLaunchImage: "清除启动图片", editorTitle: "编辑器", close: "关闭", saving: "正在保存...", editorSaveFailed: "无法保存编辑器设置。", backgroundOpacity: "背景不透明度", logoShadowOpacity: "标志阴影不透明度", logoShadowBlur: "标志阴影模糊", up: "上", down: "下", left: "左", right: "右", reset: "重置", smaller: "缩小", bigger: "放大", cancel: "取消", save: "保存",
        downloadBackgrounds: "下载背景", scrapers: "背景来源", scrapersHelp: "选择一个来源，搜索游戏，然后选择背景。", searchQuery: "搜索内容", search: "搜索", searching: "正在搜索...", download: "下载", searchPlayStation: "搜索 PlayStation Store", searchingPlayStation: "正在搜索 PlayStation Store...", choosePlayStationGame: "选择匹配的 PlayStation 游戏。", playStationGame: "PlayStation 游戏", viewBackgrounds: "查看背景", loading: "正在加载...", backToResults: "返回结果", readingBackgrounds: "正在读取背景：", chooseBackground: "选择 PlayStation 背景。", noBackgrounds: "未找到合适的背景。", noPlayStationGames: "未在 PlayStation Store 中找到游戏。",
        background: "背景", gameWallpaper: "游戏壁纸", enterSearchQuery: "请输入搜索内容。", searchFailed: "无法完成搜索。", gameTitleUnavailable: "无法从 Steam 读取游戏标题。", imagesFound: "已找到图片。", noImagesFound: "未找到图片。", imageDownloaded: "启动图片已下载。", imageDownloadFailed: "无法下载图片。", chooseFileNotFolder: "请选择文件，而不是文件夹。", imagePickerFailed: "无法选择启动图片。", noGameSelected: "未选择游戏。", launchStarting: "正在启动游戏...", launchCheckingLicense: "正在检查许可证...", launchCheckingFiles: "正在检查游戏文件...", launchInstallingComponents: "正在安装所需组件...", launchSyncingCloud: "正在同步 Steam Cloud...", launchSyncingStats: "正在同步统计数据...", launchSyncingController: "正在加载控制器配置...", launchPreparing: "正在准备启动...", launchDelayed: "启动已延迟...", launchWaitingConfirmation: "正在等待确认...", launchWaitingGame: "正在等待游戏...", launchUpdating: "正在更新游戏..."
    },
    ja: {
        timeoutEnabled: "タイムアウトを有効化", modeAuto: "自動", forceMode: "モードを強制", gameTimeout: "ゲームのタイムアウト", gameTimeoutSeconds: "ゲームのタイムアウト（秒）", timeoutHelp: "タイムアウトするとカーテンを自動的に非表示にします。", timeoutDisabledHelp: "ゲームが検出されるまでカーテンを表示し続けます。", exitDelay: "終了遅延", exitDelayHelp: "ゲーム検出後もカーテンを少し長く表示します。",
        maintenance: "メンテナンス", refreshGameCache: "ゲームキャッシュを更新", deleteUnusedImages: "未使用の画像を削除", downloadPlayStationAssetsInstalled: "インストール済みゲームの PS アセットをダウンロード", noInstalledGames: "インストール済みの Steam ゲームが見つかりません。", downloadPlayStationAssets: "PlayStation アセットをダウンロード", removePlayStationAssets: "PlayStation アセットを削除", downloadingPlayStationAssets: "PlayStation アセットをダウンロード中", removingPlayStationAssets: "PlayStation アセットを削除中", playStationBulkApplied: "適用済み", playStationBulkRemoved: "削除済み", playStationBulkSkipped: "スキップ", playStationBulkFailed: "失敗", playStationBulkError: "PlayStation の一括処理を完了できませんでした",
        tabGame: "ゲーム", tabAppearance: "外観", tabScrapers: "ソース", gameBehavior: "Launch Curtain の動作", gameBehaviorHelp: "このゲームでの Launch Curtain の動作を選択します。", enableForGame: "このゲームで Launch Curtain を有効化", logoHelp: "ゲームロゴを管理し、ビジュアルエディターを開きます。", showLogo: "ロゴを表示", openEditor: "エディターを開く", logoZoom: "ロゴのズームインアニメーションを有効化", bgZoom: "背景のズームアウトアニメーションを有効化",
        launchImage: "起動画像", noLaunchImage: "起動画像が選択されていません", chooseLaunchImage: "全画面の起動画像を選択", clearLaunchImage: "起動画像を削除", editorTitle: "エディター", close: "閉じる", saving: "保存中...", editorSaveFailed: "エディター設定を保存できませんでした。", backgroundOpacity: "背景の不透明度", logoShadowOpacity: "ロゴ影の不透明度", logoShadowBlur: "ロゴ影のぼかし", up: "上", down: "下", left: "左", right: "右", reset: "リセット", smaller: "小さく", bigger: "大きく", cancel: "キャンセル", save: "保存",
        downloadBackgrounds: "背景をダウンロード", scrapers: "背景ソース", scrapersHelp: "ソースを選び、ゲームを検索してから背景を選択します。", searchQuery: "検索語", search: "検索", searching: "検索中...", download: "ダウンロード", searchPlayStation: "PlayStation Store を検索", searchingPlayStation: "PlayStation Store を検索中...", choosePlayStationGame: "一致する PlayStation ゲームを選択してください。", playStationGame: "PlayStation ゲーム", viewBackgrounds: "背景を表示", loading: "読み込み中...", backToResults: "結果に戻る", readingBackgrounds: "背景を読み込み中：", chooseBackground: "PlayStation の背景を選択してください。", noBackgrounds: "適切な背景が見つかりませんでした。", noPlayStationGames: "PlayStation Store にゲームが見つかりませんでした。",
        background: "背景", gameWallpaper: "ゲームの壁紙", enterSearchQuery: "検索語を入力してください。", searchFailed: "検索を完了できませんでした。", gameTitleUnavailable: "Steam からゲームタイトルを読み取れませんでした。", imagesFound: "画像が見つかりました。", noImagesFound: "画像が見つかりませんでした。", imageDownloaded: "起動画像をダウンロードしました。", imageDownloadFailed: "画像をダウンロードできませんでした。", chooseFileNotFolder: "フォルダーではなくファイルを選択してください。", imagePickerFailed: "起動画像を選択できませんでした。", noGameSelected: "ゲームが選択されていません。", launchStarting: "ゲームを起動中...", launchCheckingLicense: "ライセンスを確認中...", launchCheckingFiles: "ゲームファイルを確認中...", launchInstallingComponents: "必要なコンポーネントをインストール中...", launchSyncingCloud: "Steam Cloud を同期中...", launchSyncingStats: "統計を同期中...", launchSyncingController: "コントローラー設定を読み込み中...", launchPreparing: "起動を準備中...", launchDelayed: "起動が遅れています...", launchWaitingConfirmation: "確認を待っています...", launchWaitingGame: "ゲームを待っています...", launchUpdating: "ゲームを更新中..."
    }
};

function getLocaleKey() {
    const rawLanguage = navigator.language.toLowerCase();
    if (rawLanguage.startsWith("pt-br"))
        return "pt-br";
    if (rawLanguage.startsWith("zh"))
        return "zh";
    const baseLanguage = rawLanguage.split("-")[0];
    return I18N[baseLanguage] ? baseLanguage : "en";
}
function getStrings() {
    const locale = getLocaleKey();
    return { ...I18N.en, ...EXTRA_STRINGS.en, ...(I18N[locale] ?? {}), ...(EXTRA_STRINGS[locale] ?? {}), ...(EXTRA_TRANSLATIONS[locale] ?? {}) };
}



// Costanti di temporizzazione e pattern. Ricostruito dal dist.
const PLAY_LABELS = new Set([
    "play",
    "gioca",
    "jouer",
    "jugar",
    "jogar",
    "spielen",
    "spelen",
    "грати",
    "开始",
    "开始游戏",
    "啟動",
    "開始遊戲",
    "プレイ",
    "ゲームをプレイ"
]);
const BLOCKED_PLAY_LABEL_HINTS = /(trailer|video|media|preview|anteprima|filmato)/i;
const PROBATION_COVER_MS = 1300;
const LAUNCH_BRIDGE_COVER_MS = 2800;
const CONFIRMED_LAUNCH_COVER_MS = 6500;
const POST_PLAY_CONFIRM_COVER_MS = 2600;
const POST_PLAY_ARM_MS = 18000;
const POST_PLAY_CONFIRM_PATTERN = /(play|launch|start|run|continue|continue anyway|accept|agree|ok|okay|yes|got it|understood|select (?:a )?launch option|launch options?|startup options?|choose|proceed|gioca|avvia|continua|continua comunque|accetta|conferma|esegui|scegli|seleziona|procedi|ricevuto|ho capito|va bene|s[iì]|exe|configuration|configurazione|config|controller|keyboard|tastiera|terms|license|licenza|eula)/i;
const POST_PLAY_CANCEL_PATTERN = /^(?:cancel|back|close|dismiss|annulla|indietro|chiudi|abbrechen|zuruck|schliessen|annuler|retour|fermer|cancelar|volver|cerrar|anuluj|wstecz|zamknij|otmena|nazad|zakryt|取消|返回|关闭|キャンセル|戻る|閉じる|취소|뒤로|닫기)$/iu;




const POST_PLAY_PROMPT_HOLD_MS = 5 * 60 * 1000;
const MODERN_FAIL_OPEN_MS = 75 * 1000;

// Hook del pulsante Play + instant curtain (DOM in-CEF). Ricostruito dal dist.
class PlayButtonLaunchHook {
    constructor() {
        this.instanceId = `launch-curtain-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.enabled = false;
        this.setupDone = false;
        this.lastTriggerAt = 0;
        this.lastNativeBlackCoverAt = 0;
        this.postPlayCoverUntil = 0;
        this.postPlayCoverReadyAt = 0;
        this.lastPostPlayCoverAt = 0;
        this.promptWatchTimer = undefined;
        this.promptSuspended = false;
        this.popupCreatedRegistration = undefined;
        this.popupDestroyedRegistration = undefined;
        this.methodRestorers = [];
        this.instantCurtainExpiresAt = 0;
        this.instantCurtainSafetyTimer = undefined;
        this.instantCurtainVisible = false;
        this.modernFadeToBlackActive = false;
        this.backendLaunchToken = 0;
        this.prearmLogoToken = 0;
        this.gamepadClosePressed = false;
        this.gamepadLaunchPressed = false;
        this.gamepadLaunchArmedButton = undefined;
        this.gamepadLaunchArmedAppId = undefined;
        this.gamepadCloseIgnoreUntil = 0;
        this.gamepadCloseOverlayRunning = false;
        this.gamepadCloseStatusCheckedAt = 0;
        this.gamepadCloseIdleSince = 0;
        this.logoPath = "";
        this.defaultLogoPath = "";
        this.settingsCache = {};
        this.instantCurtainElementsByDocument = new Map();
        this.instantCurtainObserversByDocument = new Map();
        this.instantCurtainKeyDocuments = new Set();
        this.currentInstantLogoUrl = "";
        this.currentInstantShowLogo = true;
        this.currentInstantStatusText = "";
        this.imagePreviewCache = new Map();
        this.logoPreviewToken = 0;
        this.backdropPreviewToken = 0;
        this.fallbackLogoResolveToken = 0;
        this.fallbackLogoResolvedUrl = "";
        this.currentBackdropSource = "";
        this.currentBackdropResolvedUrl = "";
        this.currentBackdropOpacity = 0;
        this.runtimeSoundbiteAudio = null;
        this.runtimeSoundbiteToken = "";
        this.runtimeSoundbiteAppId = 0;
        this.runtimeSoundbitePath = "";
        this.runtimeSoundbiteStarting = false;
        this.runtimeSoundbiteStartedLocally = false;
        this.runtimeSoundbiteFinishedBeforeBind = null;
        this.instantAnimationEpoch = 0;
        this.instantAnimationStartedAt = 0;
        this.gameRunning = false;
        this.suppressPrearmUntil = 0;
        this.dismissInputSuppressionUntil = 0;
        this.gamepadClosePending = false;
        this.uiMode = undefined;
        this.handlePointerDown = (event) => {
            if (this.cancelPostPlayInteraction("post-play pointerdown", event.target, event.composedPath())) {
                return;
            }
            this.coverPostPlayInteraction("post-play pointerdown", event.target, event.composedPath());
            this.handleLaunchInput("play button pointerdown", event.target, event.composedPath());
        };
        this.handleMouseDown = (event) => {
            if (this.cancelPostPlayInteraction("post-play mousedown", event.target, event.composedPath())) {
                return;
            }
            this.coverPostPlayInteraction("post-play mousedown", event.target, event.composedPath());
            this.handleLaunchInput("play button mousedown", event.target, event.composedPath());
        };
        this.handleTouchStart = (event) => {
            if (this.cancelPostPlayInteraction("post-play touchstart", event.target, event.composedPath())) {
                return;
            }
            this.coverPostPlayInteraction("post-play touchstart", event.target, event.composedPath());
            this.handleLaunchInput("play button touchstart", event.target, event.composedPath());
        };
        this.handlePointerOver = (event) => {
            this.prearmFromEvent(event.target, event.composedPath());
        };
        this.handleFocusIn = (event) => {
            this.prearmFromEvent(event.target, event.composedPath());
        };
        this.handleClick = (event) => {
            if (this.cancelPostPlayInteraction("post-play click", event.target, event.composedPath())) {
                return;
            }
            this.coverPostPlayInteraction("post-play click", event.target, event.composedPath());
            this.handleLaunchInput("play button click", event.target, event.composedPath());
        };
        this.handleKeyClose = (event) => {
            const now = Date.now();
            const dismissKey = event.key === "Escape"
                || event.key === "BrowserBack"
                || event.code === "Escape"
                || event.keyCode === 27;
            const closeSurfaceActive = this.instantCurtainVisible || this.gamepadCloseOverlayRunning;
            if (dismissKey && (closeSurfaceActive || now < this.dismissInputSuppressionUntil)) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                if (closeSurfaceActive) {
                    this.dismissInputSuppressionUntil = now + 900;
                    this.requestCloseAllCurtains();
                }
                return true;
            }
            return false;
        };
        this.handleKeyDown = (event) => {
            if (this.handleKeyClose(event)) {
                return;
            }
            if (!["Enter", " "].includes(event.key)) {
                return;
            }
            const eventTarget = event.target || event.currentTarget?.activeElement || document.activeElement;
            const eventPath = typeof event.composedPath === "function" ? event.composedPath() : [];
            if (this.cancelPostPlayInteraction("post-play keydown", eventTarget, eventPath)) {
                return;
            }
            this.coverPostPlayInteraction("post-play keydown", eventTarget, eventPath);
            if (this.isPlayButtonEvent(eventTarget, eventPath)) {
                this.handleLaunchInput("play button keydown", eventTarget, eventPath);
            }
        };
        this.handleVisibilityChange = () => {
            this.hideExpiredInstantCurtain();
        };
        this.handleWindowFocus = () => {
            this.hideExpiredInstantCurtain();
        };
    }
    setup() {
        if (this.setupDone) {
            return;
        }
        const registryHost = window.SteamClient?.Apps;
        const registryKey = "__playhubLaunchCurtainPlayHook";
        try {
            const previousHook = registryHost?.[registryKey];
            if (previousHook && previousHook !== this && typeof previousHook.cleanup === "function") {
                previousHook.cleanup();
            }
            if (registryHost) {
                registryHost[registryKey] = this;
                this.registryHost = registryHost;
                this.registryKey = registryKey;
            }
        }
        catch (_error) {}
        this.setupDone = true;
        this.ensureInstantCurtainPrepared();
        document.addEventListener("pointerdown", this.handlePointerDown, true);
        document.addEventListener("mousedown", this.handleMouseDown, true);
        document.addEventListener("touchstart", this.handleTouchStart, true);
        document.addEventListener("pointerover", this.handlePointerOver, true);
        document.addEventListener("focusin", this.handleFocusIn, true);
        document.addEventListener("click", this.handleClick, true);
        document.addEventListener("keydown", this.handleKeyDown, true);
        document.addEventListener("keyup", this.handleKeyClose, true);
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        window.addEventListener("focus", this.handleWindowFocus);
        this.patchSteamClient();
        this.registerSteamPopupHooks();
        this.startGamepadLaunchPolling();
        this.startArmPoll();
        this.pollTimer = window.setInterval(() => this.patchSteamClient(), 1000);
    }
    cleanup() {
        document.removeEventListener("pointerdown", this.handlePointerDown, true);
        document.removeEventListener("mousedown", this.handleMouseDown, true);
        document.removeEventListener("touchstart", this.handleTouchStart, true);
        document.removeEventListener("pointerover", this.handlePointerOver, true);
        document.removeEventListener("focusin", this.handleFocusIn, true);
        document.removeEventListener("click", this.handleClick, true);
        document.removeEventListener("keydown", this.handleKeyDown, true);
        document.removeEventListener("keyup", this.handleKeyClose, true);
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        window.removeEventListener("focus", this.handleWindowFocus);
        this.restoreMethodPatches();
        this.stopPromptWatch();
        this.unregisterSteamPopupHooks();
        this.stopGamepadLaunchPolling();
        this.stopArmPoll();
        this.stopRuntimeSoundbite("hook cleanup");
        this.hideInstantCurtain();
        void setNativePromptVisible({ visible: false }).catch(() => {});
        void hideBlackCover().catch((error) => {
            console.warn("Launch Curtain black pre-cover cleanup failed", error);
        });
        this.destroyInstantCurtain();
        if (this.pollTimer !== undefined) {
            window.clearInterval(this.pollTimer);
            this.pollTimer = undefined;
        }
        this.clearPendingBackendLaunch();
        this.patchedApps = undefined;
        try {
            if (this.registryHost?.[this.registryKey] === this) {
                delete this.registryHost[this.registryKey];
            }
        }
        catch (_error) {}
        this.registryHost = undefined;
        this.registryKey = undefined;
        this.setupDone = false;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopRuntimeSoundbite("hook disabled");
            this.hideInstantCurtain();
        }
    }
    setLogoPath(path) {
        this.logoPath = path;
        this.refreshFallbackLogoUrl();
    }
    setDefaultLogoPath(path) {
        this.defaultLogoPath = path;
        this.refreshFallbackLogoUrl();
    }
    setSettingsCache(settings) {
        this.settingsCache = settings || {};
        if (this.currentBackdropAppId) {
            const gameSettings = this.gameSettingsForApp(this.currentBackdropAppId);
            this.applyInstantBackdrop(this.currentBackdropAppId);
            this.applyInstantLogoShadow(this.currentBackdropAppId);
            if (gameSettings.show_logo === false) {
                this.logoPreviewToken += 1;
                this.setInstantCurtainLogo("", false);
            }
        }
    }
    gameSettingsForApp(appId) {
        const perGame = this.settingsCache?.per_game || {};
        const raw = appId ? (perGame[String(appId)] || {}) : {};
        return {
            enabled: raw.enabled !== false,
            show_logo: raw.show_logo !== false,
            logo_zoom_enabled: raw.logo_zoom_enabled !== false,
            logo_position_x: typeof raw.logo_position_x === "number" ? raw.logo_position_x : 50,
            logo_position_y: typeof raw.logo_position_y === "number" ? raw.logo_position_y : 50,
            logo_scale: typeof raw.logo_scale === "number" ? raw.logo_scale : 100,
            fullscreen_image_path: raw.fullscreen_image_path || "",
            background_opacity: typeof raw.background_opacity === "number" ? raw.background_opacity : undefined,
            background_position_x: typeof raw.background_position_x === "number" ? raw.background_position_x : (typeof this.settingsCache?.background_position_x === "number" ? this.settingsCache.background_position_x : 50),
            background_position_y: typeof raw.background_position_y === "number" ? raw.background_position_y : (typeof this.settingsCache?.background_position_y === "number" ? this.settingsCache.background_position_y : 50),
            background_scale: typeof raw.background_scale === "number" ? raw.background_scale : (typeof this.settingsCache?.background_scale === "number" ? this.settingsCache.background_scale : 100),
            logo_shadow_opacity: typeof raw.logo_shadow_opacity === "number" ? raw.logo_shadow_opacity : undefined,
            logo_shadow_blur: typeof raw.logo_shadow_blur === "number" ? raw.logo_shadow_blur : undefined,
            bg_zoom_enabled: typeof raw.bg_zoom_enabled === "boolean" ? raw.bg_zoom_enabled : ((this.settingsCache && this.settingsCache.bg_zoom_enabled) !== false),
            force_mode: (raw.force_mode === "classic" || raw.force_mode === "modern") ? raw.force_mode : "auto",
            timeout_enabled: typeof raw.timeout_enabled === "boolean" ? raw.timeout_enabled : undefined,
            timeout_seconds: typeof raw.timeout_seconds === "number" ? raw.timeout_seconds : undefined,
            exit_delay_seconds: typeof raw.exit_delay_seconds === "number" ? raw.exit_delay_seconds : undefined,
            soundbite_path: raw.soundbite_path || "",
            soundbite_volume: typeof raw.soundbite_volume === "number" ? raw.soundbite_volume : 100
        };
    }
    isGameEnabled(appId) {
        return this.gameSettingsForApp(appId).enabled !== false;
    }
    handleLaunchInput(reason, target, composedPath) {
        if (!this.isPlayButtonEvent(target, composedPath)) {
            return;
        }
        const path = [...composedPath];
        const immediateAppId = this.findAppIdForEvent(target, path);
        if (immediateAppId && !this.isGameEnabled(immediateAppId)) {
            return;
        }
        const immediateSettings = this.gameSettingsForApp(immediateAppId);
        if (immediateAppId && immediateSettings.show_logo === false) {
            this.logoPreviewToken += 1;
            this.setInstantCurtainLogo("", false);
        }
        this.showNativeBlackCover(reason, LAUNCH_BRIDGE_COVER_MS);
        this.revealInstantCurtain(PROBATION_COVER_MS);
        window.setTimeout(() => {
            const appId = immediateAppId || this.findAppIdForEvent(target, path);
            if (appId && !this.isGameEnabled(appId)) {
                this.requestCloseAllCurtains();
                return;
            }
            const settings = this.gameSettingsForApp(appId);
            const logoSource = appId && settings.show_logo !== false ? this.findGameLogoSource(appId) : undefined;
            this.trigger(reason, appId, logoSource, false);
        }, 0);
    }
    prearmFromEvent(target, composedPath) {
        if (
            !this.enabled
            || this.instantCurtainVisible
            || this.gameRunning
            || Date.now() < this.suppressPrearmUntil
            || !this.isPlayButtonEvent(target, composedPath)
        ) {
            return;
        }
        const appId = this.findAppIdForEvent(target, composedPath);
        if (appId && !this.isGameEnabled(appId)) {
            return;
        }
        const settings = this.gameSettingsForApp(appId);
        const logoSource = appId && settings.show_logo !== false ? this.findGameLogoSource(appId) : undefined;
        this.prearmInstantCurtain(appId, logoSource, Boolean(appId && appId >= 2147483648), settings.show_logo !== false);
    }
    isPlayButtonEvent(target, composedPath) {
        const candidates = this.getCandidateElements(target, composedPath);
        return candidates.some((element) => this.isExactPlayButton(element));
    }
    getCandidateElements(target, composedPath) {
        const candidates = [];
        const path = composedPath.length > 0 ? composedPath : this.parentPath(target);
        for (const item of path.slice(0, 10)) {
            if (!this.isElementNode(item)) {
                continue;
            }
            const isCandidate = item.tagName === "BUTTON"
                || item.getAttribute("role") === "button"
                || item.getAttribute("data-focusable") === "true";
            if (isCandidate) {
                candidates.push(item);
            }
        }
        return candidates;
    }
    parentPath(target) {
        const path = [];
        let current = this.isElementNode(target) ? target : null;
        while (current && path.length < 10) {
            path.push(current);
            current = current.parentElement;
        }
        return path;
    }
    isElementNode(candidate) {
        return Boolean(candidate && candidate.nodeType === 1 && typeof candidate.getAttribute === "function");
    }
    isExactPlayButton(element) {
        if (this.hasBlockedContext(element)) {
            return false;
        }

        // Steam library capsules may expose accessibility labels such as
        // "Play <game title>" even though activating them only opens the game
        // details page. Treating every label that starts with Play/Gioca as a
        // launch action makes the speculative curtain appear during navigation.
        //
        // A real details-page Play control has visible Play text, or is an
        // icon-only control with an exact accessible Play label. Native
        // SteamClient RunGame hooks remain the final launch confirmation.
        const href = String(element.getAttribute("href") || "").trim();
        const role = this.normalizeLabel(element.getAttribute("role") || "");
        if (
            element.tagName === "A"
            || role === "link"
            || (href && !/^steam:\/\/(?:run|rungameid)\//i.test(href))
        ) {
            return false;
        }

        const visibleText = String(element.innerText || "").trim();
        if (visibleText) {
            return this.isExactPlayLabel(visibleText);
        }

        const fallbackText = String(element.textContent || "").trim();
        if (fallbackText) {
            return this.isExactPlayLabel(fallbackText);
        }

        const accessibleLabels = [
            element.getAttribute("aria-label") ?? "",
            element.getAttribute("title") ?? ""
        ];
        return accessibleLabels.some((label) => this.isExactPlayLabel(label));
    }
    isExactPlayLabel(label) {
        const trimmed = String(label || "").trim();
        if (!trimmed || trimmed.length > 24 || BLOCKED_PLAY_LABEL_HINTS.test(trimmed)) {
            return false;
        }
        return PLAY_LABELS.has(this.normalizeLabel(trimmed));
    }
    hasBlockedContext(element) {
        let current = element;
        let depth = 0;
        while (current && depth < 4) {
            const context = this.normalizeLabel([
                current.getAttribute("aria-label") ?? "",
                current.getAttribute("title") ?? "",
                current.className?.toString?.() ?? "",
                current.id ?? ""
            ].join(" "));
            if (/(trailer|video|media|preview|anteprima|filmato)/i.test(context)) {
                return true;
            }
            current = current.parentElement;
            depth += 1;
        }
        return false;
    }
    getLabels(element) {
        return [
            element.getAttribute("aria-label") ?? "",
            element.getAttribute("title") ?? "",
            element.innerText ?? "",
            element.textContent ?? ""
        ].filter((label) => label.trim().length > 0 && label.trim().length <= 24);
    }
    normalizeLabel(label) {
        return label
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .replace(/\s+/g, " ")
            .trim();
    }
    findAppIdForEvent(target, composedPath) {
        const sources = [];
        const path = composedPath.length > 0 ? composedPath : this.parentPath(target);
        for (const item of path.slice(0, 16)) {
            if (!this.isElementNode(item)) {
                continue;
            }
            const reactAppId = this.readReactAppId(item);
            if (reactAppId) {
                return reactAppId;
            }
            sources.push(item.getAttribute("href") ?? "", item.getAttribute("src") ?? "", item.getAttribute("style") ?? "", item.getAttribute("data-appid") ?? "", item.getAttribute("data-app-id") ?? "", item.getAttribute("data-ds-appid") ?? "", item.id ?? "", `${item.className ?? ""}`, getComputedStyle(item).backgroundImage);
        }
        for (const source of sources) {
            const appId = this.extractAppIdFromText(source);
            if (appId) {
                return appId;
            }
        }
        return undefined;
    }
    readReactAppId(element) {
        const reactKeys = Object.getOwnPropertyNames(element).filter((key) => key.startsWith("__react"));
        for (const key of reactKeys) {
            let fiber = element[key];
            for (let depth = 0; fiber && depth < 12; depth += 1) {
                const fiberRecord = fiber;
                const appId = this.extractAppIdFromUnknown(fiberRecord.memoizedProps)
                    ?? this.extractAppIdFromUnknown(fiberRecord.pendingProps);
                if (appId) {
                    return appId;
                }
                fiber = fiberRecord.return;
            }
        }
        return undefined;
    }
    extractAppIdFromText(value) {
        if (!value) {
            return undefined;
        }
        const patterns = [
            /(?:library|games?|app)\/(?:app\/)?(\d{2,20})(?:[/?#]|$)/i,
            /steam:\/\/(?:nav\/games\/details|rungameid|store)\/(\d{2,20})/i,
            /[?&#](?:appid|appId|app_id|gameid|gameId|game_id)=(\d{2,20})(?:[&#]|$)/i,
            /(?:steam\/apps|store_item_assets\/steam\/apps|steamcommunity\/public\/images\/apps|\/assets)\/(\d{2,10})(?:\/|$)/i,
            /(?:config\/grid|config\\grid|\/grid\/|\\grid\\)(\d{2,10})(?:[._a-z-]|$)/i,
            /\/customimages\/(\d{2,10})(?:[a-z_]*)(?:[._/?#-]|$)/i,
            /(?:appid|app_id|app-id|gameid|game_id|game-id)["'=:\s]+(\d{2,20})/i
        ];
        for (const pattern of patterns) {
            const match = value.match(pattern);
            if (match?.[1]) {
                const appId = this.extractAppIdFromUnknown(match[1]);
                if (appId && this.isPlausibleAppId(appId)) {
                    return appId;
                }
            }
        }
        return undefined;
    }
    extractAppIdFromUnknown(value, depth = 0) {
        if (value === null || value === undefined || depth > 5) {
            return undefined;
        }
        if (typeof value === "number") {
            const appId = this.normalizeNumericAppId(value);
            return appId && this.isPlausibleAppId(appId) ? appId : undefined;
        }
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (/^-?\d{2,20}$/.test(trimmed)) {
                if (trimmed.startsWith("-")) {
                    const appId = Number.parseInt(trimmed, 10);
                    const normalizedAppId = this.normalizeNumericAppId(appId);
                    return normalizedAppId && this.isPlausibleAppId(normalizedAppId) ? normalizedAppId : undefined;
                }
                const normalizedAppId = this.normalizeBigIntAppId(BigInt(trimmed));
                return normalizedAppId && this.isPlausibleAppId(normalizedAppId) ? normalizedAppId : undefined;
            }
            return this.extractAppIdFromText(value);
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                const appId = this.extractAppIdFromUnknown(item, depth + 1);
                if (appId) {
                    return appId;
                }
            }
            return undefined;
        }
        if (typeof value === "object") {
            const record = value;
            for (const key of [
                "appid",
                "appId",
                "appID",
                "app_id",
                "unAppID",
                "nAppID",
                "m_unAppID",
                "shortcutid",
                "shortcutId",
                "shortcutID",
                "shortcut_id",
                "unShortcutID",
                "m_unShortcutID",
                "gameid",
                "gameId",
                "gameID",
                "strGameID",
                "strGameId"
            ]) {
                const appId = this.extractAppIdFromUnknown(record[key], depth + 1);
                if (appId) {
                    return appId;
                }
            }
            for (const key of ["app", "game", "overview", "details", "props", "data", "shortcut"]) {
                const appId = this.extractAppIdFromUnknown(record[key], depth + 1);
                if (appId) {
                    return appId;
                }
            }
            for (const key of Object.keys(record).slice(0, 32)) {
                if (!/(app.?id|appid|game.?id|shortcut.?id|strgameid)/i.test(key)) {
                    continue;
                }
                const appId = this.extractAppIdFromUnknown(record[key], depth + 1);
                if (appId) {
                    return appId;
                }
            }
        }
        return undefined;
    }
    isPlausibleAppId(value) {
        return Number.isInteger(value) && value > 0 && value < 4294967296;
    }
    normalizeNumericAppId(value) {
        if (!Number.isInteger(value)) {
            return undefined;
        }
        if (value > 0xffffffff) {
            const upper = Math.floor(value / 4294967296);
            return upper >= 0x80000000 && this.isPlausibleAppId(upper) ? upper : undefined;
        }
        if (value > 0) {
            return Math.floor(value);
        }
        return value >>> 0;
    }
    normalizeBigIntAppId(value) {
        if (value <= 0n) {
            return undefined;
        }
        if (value <= 0xffffffffn) {
            return Number(value);
        }
        const upper = Number((value >> 32n) & 0xffffffffn);
        return upper >= 0x80000000 && this.isPlausibleAppId(upper) ? upper : undefined;
    }
    getElementLogoSource(element) {
        return (this.extractCssUrl(element.getAttribute("style") ?? "")
            || this.extractCssUrl(getComputedStyle(element).backgroundImage)
            || element.getAttribute("src")
            || "");
    }
    extractCssUrl(value) {
        const match = value.match(/url\((["']?)(.*?)\1\)/i);
        return match?.[2] ?? "";
    }
    sourceLooksLikeNonLogoArtwork(source, metadata, appId) {
        const lower = source.toLowerCase();
        let decoded = lower;
        try {
            decoded = decodeURIComponent(lower);
        }
        catch {
            decoded = lower;
        }
        const filename = decoded.split(/[\\/]/).pop() ?? "";
        const stem = filename.replace(/\.[a-z0-9]+(?:\?.*)?$/i, "");
        const appIdText = String(appId);
        const blockedTokens = [
            "_hero",
            "library_hero",
            "_header",
            "header.",
            "_capsule",
            "capsule_",
            "_banner",
            "banner.",
            "library_600x900"
        ];
        if (stem === appIdText && metadata.includes("logo") && (decoded.includes("/config/grid/") || decoded.includes("\\config\\grid\\"))) {
            return false;
        }
        if (stem === appIdText || stem === `${appIdText}p`) {
            return true;
        }
        if (blockedTokens.some((token) => decoded.includes(token))) {
            return true;
        }
        const elementOnlyHints = ["hero", "header", "capsule", "banner", "cover", "portrait"];
        return !metadata.includes("logo") && elementOnlyHints.some((token) => metadata.includes(token));
    }
    elementLooksLikeGameLogo(element, appId) {
        const source = this.getElementLogoSource(element).toLowerCase();
        const appIdText = String(appId);
        const metadata = [
            source,
            element.getAttribute("alt") ?? "",
            element.getAttribute("aria-label") ?? "",
            element.getAttribute("title") ?? "",
            element.getAttribute("style") ?? "",
            getComputedStyle(element).backgroundImage,
            `${element.className ?? ""}`,
            `${element.parentElement?.className ?? ""}`
        ].join(" ").toLowerCase();
        if (this.sourceLooksLikeNonLogoArtwork(source, metadata, appId)) {
            return false;
        }
        const hasAppReference = (metadata.includes(appIdText)
            || source.includes(`/customimages/${appIdText}`)
            || source.includes(`\\grid\\${appIdText}`)
            || source.includes(`/grid/${appIdText}`)
            || source.includes(`/${appIdText}_`)
            || source.includes(`\\${appIdText}_`)
            || source.includes(`/assets/${appIdText}/`)
            || source.includes(`/apps/${appIdText}/`)
            || source.includes(`/steam/apps/${appIdText}/`)
            || source.includes(`/${appIdText}/`));
        const hasLogoHint = (metadata.includes("logo")
            || source.includes("_logo")
            || source.includes("_icon")
            || source.includes("/logos/")
            || source.includes("/logo/")
            || source.includes("/logo.png"));
        const customSteamArtworkSource = (source.includes("/customimages/")
            || source.includes("\\config\\grid\\")
            || source.includes("/config/grid/")
            || source.includes("steamgriddb")
            || source.includes("sgdb"));
        return Boolean(source) && hasLogoHint && (hasAppReference || customSteamArtworkSource);
    }
    logoIsSmallEnough(element) {
        const rect = element.getBoundingClientRect();
        const naturalArea = element instanceof HTMLImageElement
            ? (element.naturalWidth || 0) * (element.naturalHeight || 0)
            : 1;
        if (rect.width <= 1 || rect.height <= 1) {
            if (!(element instanceof HTMLImageElement)) {
                return naturalArea > 0;
            }
            const naturalWidth = element.naturalWidth || 0;
            const naturalHeight = element.naturalHeight || 0;
            if (naturalWidth <= 0 || naturalHeight <= 0) {
                return false;
            }
            return naturalWidth <= 1000 && naturalHeight <= 420;
        }
        return rect.width <= 260 || rect.height <= 110 || rect.width * rect.height <= 26000;
    }
    findGameLogoSource(appId) {
        const selector = [
            "img",
            "[class*='Logo']",
            "[class*='logo']",
            "[style*='Logo']",
            "[style*='logo']",
            "[style*='/customimages/']",
            "[style*='SteamGridDB']",
            "[style*='steamgriddb']",
            "[style*='sgdb']",
            "[style*='config/grid']",
            "[style*='config\\\\grid']",
            "[style*='steamcommunity/public/images/apps']",
            "[style*='/steam/apps/']"
        ].join(",");
        const seen = new Set();
        const candidates = Array.from(document.querySelectorAll(selector))
            .map((element) => {
            const source = this.getElementLogoSource(element);
            if (!source || seen.has(source)) {
                return undefined;
            }
            seen.add(source);
            if (!this.elementLooksLikeGameLogo(element, appId) || !this.logoIsSmallEnough(element)) {
                return undefined;
            }
            const rect = element.getBoundingClientRect();
            const lower = source.toLowerCase();
            const area = Math.max(1, rect.width * rect.height);
            const sourceBias = lower.includes("_logo") || lower.includes("/logos/") ? 1000 : 0;
            const customBias = lower.includes("/customimages/") || lower.includes("steamgriddb") || lower.includes("sgdb") ? 700 : 0;
            const visibilityBias = rect.width > 1 && rect.height > 1 ? 300 : 0;
            const sizeBias = Math.min(240, area / 100);
            return { source, score: sourceBias + customBias + visibilityBias + sizeBias };
        })
            .filter((candidate) => Boolean(candidate))
            .sort((left, right) => right.score - left.score);
        return candidates[0]?.source;
    }
    steamLogoUrl(appId) {
        // Remote Steam CDN logos can arrive seconds later and leave the launch
        // surface as a plain black screen. Prefer local Steam/custom logos and
        // let the bundled Playhub logo be the instant fallback.
        return "";
    }
    async resolveGameLogoSource(appId, domSource, isShortcut = false) {
        let backendSource = "";
        try {
            const result = await resolveGameLogo({ app_id: appId, is_shortcut: isShortcut });
            if (result.ok && result.logo_source) {
                backendSource = result.logo_source;
            }
        }
        catch (error) {
            console.warn("Launch Curtain backend logo lookup failed", error);
        }
        const sources = [
            backendSource,
            ...(await this.getSteamLogoSources(appId)),
            domSource,
            undefined
        ];
        const source = sources.find((candidate) => Boolean(candidate?.trim()));
        return source ? this.normalizeLogoSource(source) : undefined;
    }
    async getSteamLogoSources(appId) {
        const steamWindow = window;
        const sources = [];
        const overview = await this.waitForValue(() => steamWindow.appStore?.GetAppOverviewByAppID?.(appId) ?? undefined, 450, 50);
        if (overview) {
            try {
                for (const source of steamWindow.appStore?.GetCustomLogoImageURLs?.(overview) ?? []) {
                    this.addLogoSource(sources, source, appId);
                }
            }
            catch {
                // Steam exposes custom artwork differently across builds.
            }
        }
        try {
            this.addLogoSource(sources, steamWindow.appDetailsStore?.GetAppDetails?.(appId)?.libraryAssets?.strLogoImage, appId);
        }
        catch {
            // Details may not be hydrated yet.
        }
        return sources;
    }
    async waitForValue(read, timeoutMs, intervalMs) {
        const startedAt = Date.now();
        while (Date.now() - startedAt <= timeoutMs) {
            const value = read();
            if (value !== undefined) {
                return value;
            }
            await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
        }
        return undefined;
    }
    addLogoSource(sources, source, appId) {
        const normalized = source?.trim();
        if (normalized && appId && this.sourceLooksLikeNonLogoArtwork(normalized, normalized.toLowerCase(), appId)) {
            return;
        }
        if (normalized && !sources.includes(normalized)) {
            sources.push(normalized);
        }
    }
    rawFallbackLogoSource() {
        return String(this.logoPath || this.defaultLogoPath || "").trim();
    }
    fallbackLogoUrl() {
        return this.fallbackLogoResolvedUrl || this.toFileUrl(this.rawFallbackLogoSource());
    }
    browserImageUrl(source) {
        const value = String(source || "").trim();
        return /^(?:data:|blob:|https?:\/\/)/i.test(value) ? value : "";
    }
    async resolveUiImageUrl(source, fallback = "") {
        const primary = String(source || "").trim();
        const secondary = String(fallback || "").trim();
        const direct = this.browserImageUrl(primary);
        if (direct) {
            return direct;
        }
        const fallbackDirect = this.browserImageUrl(secondary);
        const key = `${primary}\n${secondary}`;
        if (!primary && !secondary) {
            return "";
        }
        if (this.imagePreviewCache.has(key)) {
            return await this.imagePreviewCache.get(key);
        }
        const pending = getImagePreview({ source: primary, fallback: secondary }).then((result) => {
            const resolved = String(result?.url || "").trim();
            if (resolved) {
                return resolved;
            }
            return fallbackDirect || this.localFileUrl(primary || secondary);
        }).catch((error) => {
            console.warn("Launch Curtain image preview bridge failed", error);
            return fallbackDirect || this.localFileUrl(primary || secondary);
        });
        this.imagePreviewCache.set(key, pending);
        return await pending;
    }
    refreshFallbackLogoUrl() {
        const source = this.rawFallbackLogoSource();
        const token = ++this.fallbackLogoResolveToken;
        this.fallbackLogoResolvedUrl = "";
        if (!source) {
            this.refreshPreparedFallback();
            return;
        }
        void this.resolveUiImageUrl(source).then((url) => {
            if (token !== this.fallbackLogoResolveToken) {
                return;
            }
            this.fallbackLogoResolvedUrl = url || this.toFileUrl(source);
            this.preloadLogo(this.fallbackLogoResolvedUrl);
            this.refreshPreparedFallback();
        });
    }
    normalizeLogoSource(source) {
        if (/^https?:\/\//i.test(source)) {
            return "";
        }
        if (source.startsWith("file://")) {
            return source;
        }
        return this.toFileUrl(source) || source;
    }
    trigger(reason, appId, logoSource, confirmedLaunch = false, isShortcut = false) {
        if (!this.enabled) {
            this.dbg("trigger blocked: not enabled");
            return;
        }
        const bp = this.isBigPictureActive();
        this.dbg("trigger reason=" + reason + " appId=" + (appId || 0) + " mode=" + (this.settingsCache && this.settingsCache.curtain_mode) + " uiMode=" + this.uiMode + " bp=" + bp + " gameRunning=" + this.gameRunning);
        if (!bp) {
            return;
        }
        if (this.gameRunning) {
            this.dbg("trigger suppressed: game already running");
            return;
        }
        const now = Date.now();
        if (!confirmedLaunch && !appId) {
            if (now - this.lastTriggerAt >= 900) {
                this.lastTriggerAt = now;
                this.showInstantCurtain(undefined, undefined, false, true, PROBATION_COVER_MS);
            }
            return;
        }
        const canUpgradeExistingLaunch = Boolean(appId && this.activeInstantAppId !== appId);
        const launchIsAlreadyVisible = this.instantCurtainVisible || this.backendLaunchTimer !== undefined;
        if (!confirmedLaunch && launchIsAlreadyVisible && now - this.lastTriggerAt < 700 && !canUpgradeExistingLaunch) {
            return;
        }
        // Confirmed SteamClient launches are allowed to upgrade/extend the earlier
        // speculative Play-button cover. Blocking this path caused the native black
        // cover to expire and then reappear when the real process was detected.
        const gameSettings = this.gameSettingsForApp(appId);
        if (appId && gameSettings.enabled === false) {
            this.requestCloseAllCurtains();
            return;
        }
        this.lastTriggerAt = now;
        this.postPlayCoverUntil = now + POST_PLAY_ARM_MS;
        this.postPlayCoverReadyAt = now + Math.min(1100, PROBATION_COVER_MS);
        this.startPromptWatch();
        const effectiveShortcut = isShortcut || Boolean(appId && appId >= 2147483648);
        const effectiveLogoSource = gameSettings.show_logo === false ? undefined : logoSource;
        if (confirmedLaunch && appId && gameSettings.soundbite_path) {
            void this.startRuntimeSoundbiteEarly(appId, gameSettings);
        }
        if (confirmedLaunch) {
            this.showNativeBlackCover(`${reason} confirmed black handoff`, CONFIRMED_LAUNCH_COVER_MS);
        }
        this.showInstantCurtain(appId, effectiveLogoSource, effectiveShortcut, gameSettings.show_logo !== false, confirmedLaunch ? Math.min(CONFIRMED_LAUNCH_COVER_MS, 4200) : PROBATION_COVER_MS);
        this.scheduleBackendLaunch(reason, appId, effectiveLogoSource, 0, effectiveShortcut, confirmedLaunch);
    }
    stopRuntimeSoundbite(reason = "stop", notifyBackend = true) {
        const audio = this.runtimeSoundbiteAudio;
        const token = this.runtimeSoundbiteToken;
        const appId = this.runtimeSoundbiteAppId;
        this.runtimeSoundbiteAudio = null;
        this.runtimeSoundbiteToken = "";
        this.runtimeSoundbiteAppId = 0;
        this.runtimeSoundbitePath = "";
        this.runtimeSoundbiteStarting = false;
        this.runtimeSoundbiteStartedLocally = false;
        this.runtimeSoundbiteFinishedBeforeBind = null;
        if (audio) {
            try {
                audio.onended = null;
                audio.onerror = null;
                audio.pause?.();
                audio.currentTime = 0;
            }
            catch (_error) {}
        }
        if (notifyBackend && token) {
            void soundbiteRuntimeFinished({ app_id: appId || 0, token, status: "stopped", reason }).catch(() => {});
        }
    }
    effectiveRuntimeSoundbiteVolume(gameSettings = {}) {
        const perGame = Math.max(0, Math.min(100, Number(gameSettings.soundbite_volume ?? 100)));
        const master = Math.max(0, Math.min(100, Number(this.settingsCache?.soundbite_master_volume ?? 100)));
        const volume = (perGame / 100) * (master / 100);
        return Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
    }
    async startRuntimeSoundbiteEarly(appId, gameSettings = {}) {
        const path = String(gameSettings.soundbite_path || "").trim();
        if (!path || !appId) return;
        if (this.runtimeSoundbiteAppId === appId
            && this.runtimeSoundbitePath === path
            && (this.runtimeSoundbiteAudio || this.runtimeSoundbiteStarting)) {
            return;
        }

        this.stopRuntimeSoundbite("replaced by confirmed launch", true);
        this.runtimeSoundbiteAppId = appId;
        this.runtimeSoundbitePath = path;
        this.runtimeSoundbiteToken = "";
        this.runtimeSoundbiteStarting = true;
        this.runtimeSoundbiteStartedLocally = false;
        this.runtimeSoundbiteFinishedBeforeBind = null;
        try {
            const preview = await getSoundbitePreview({ source: path });
            if (this.runtimeSoundbiteAppId !== appId || this.runtimeSoundbitePath !== path) return;
            if (!preview?.ok || !preview?.url) {
                const token = this.runtimeSoundbiteToken;
                this.runtimeSoundbiteStarting = false;
                if (token) {
                    void soundbiteRuntimeFinished({ app_id: appId, token, status: "error", reason: preview?.message || "preview unavailable" }).catch(() => {});
                }
                this.runtimeSoundbiteToken = "";
                this.runtimeSoundbiteAppId = 0;
                this.runtimeSoundbitePath = "";
                this.runtimeSoundbiteFinishedBeforeBind = token ? null : { status: "error", reason: preview?.message || "preview unavailable" };
                this.dbg(`early runtime Soundbite preview failed appId=${appId}`);
                return;
            }
            const audio = new Audio(preview.url);
            audio.volume = this.effectiveRuntimeSoundbiteVolume(gameSettings);
            audio.preload = "auto";
            this.runtimeSoundbiteAudio = audio;
            this.runtimeSoundbiteStarting = false;

            const finish = (status, reason) => {
                if (this.runtimeSoundbiteAppId !== appId || this.runtimeSoundbitePath !== path) return;
                this.runtimeSoundbiteAudio = null;
                this.runtimeSoundbiteStarting = false;
                const token = this.runtimeSoundbiteToken;
                if (token) {
                    void soundbiteRuntimeFinished({ app_id: appId, token, status, reason }).catch(() => {});
                    this.runtimeSoundbiteToken = "";
                    this.runtimeSoundbiteAppId = 0;
                    this.runtimeSoundbitePath = "";
                    this.runtimeSoundbiteStartedLocally = false;
                    this.runtimeSoundbiteFinishedBeforeBind = null;
                }
                else {
                    this.runtimeSoundbiteFinishedBeforeBind = { status, reason };
                }
                this.dbg(`early runtime Soundbite ${status} appId=${appId}`);
            };
            audio.onended = () => finish("finished", "ended");
            audio.onerror = () => finish("error", "HTMLAudioElement error");
            await audio.play();
            if (this.runtimeSoundbiteAppId !== appId || this.runtimeSoundbitePath !== path) {
                try { audio.pause?.(); } catch (_error) {}
                return;
            }
            this.runtimeSoundbiteStartedLocally = true;
            if (this.runtimeSoundbiteToken) {
                void soundbiteRuntimeStarted({ app_id: appId, token: this.runtimeSoundbiteToken }).catch(() => {});
            }
            this.dbg(`runtime Soundbite started early in Steam Chromium appId=${appId} volume=${audio.volume.toFixed(3)}`);
        }
        catch (error) {
            if (this.runtimeSoundbiteAppId === appId && this.runtimeSoundbitePath === path) {
                const message = String(error?.message || error || "browser playback failed");
                this.runtimeSoundbiteAudio = null;
                this.runtimeSoundbiteStarting = false;
                this.runtimeSoundbiteStartedLocally = false;
                if (this.runtimeSoundbiteToken) {
                    void soundbiteRuntimeFinished({ app_id: appId, token: this.runtimeSoundbiteToken, status: "error", reason: message }).catch(() => {});
                    this.runtimeSoundbiteToken = "";
                    this.runtimeSoundbiteAppId = 0;
                    this.runtimeSoundbitePath = "";
                }
                else {
                    this.runtimeSoundbiteFinishedBeforeBind = { status: "error", reason: message };
                }
                this.dbg(`early runtime Soundbite failed appId=${appId} error=${message}`);
            }
        }
    }
    async startRuntimeSoundbite(launchResult, fallbackAppId = 0) {
        const path = String(launchResult?.soundbite_path || "").trim();
        const token = String(launchResult?.soundbite_token || "").trim();
        const appId = Number(launchResult?.soundbite_app_id || fallbackAppId || 0) || 0;
        if (!path || !token) return;

        // If Chromium already started the Soundbite on Steam's confirmed RunGame
        // signal, bind the backend token to that same playback instead of restarting it.
        if (this.runtimeSoundbiteAppId === appId && this.runtimeSoundbitePath === path) {
            this.runtimeSoundbiteToken = token;
            if (this.runtimeSoundbiteAudio) {
                const volume = Math.max(0, Math.min(1, Number(launchResult?.soundbite_effective_volume ?? this.runtimeSoundbiteAudio.volume ?? 1)));
                if (Number.isFinite(volume)) this.runtimeSoundbiteAudio.volume = volume;
            }
            if (this.runtimeSoundbiteStartedLocally) {
                void soundbiteRuntimeStarted({ app_id: appId, token }).catch(() => {});
            }
            if (this.runtimeSoundbiteFinishedBeforeBind) {
                const finished = this.runtimeSoundbiteFinishedBeforeBind;
                void soundbiteRuntimeFinished({ app_id: appId, token, status: finished.status, reason: finished.reason }).catch(() => {});
                this.runtimeSoundbiteToken = "";
                this.runtimeSoundbiteAppId = 0;
                this.runtimeSoundbitePath = "";
                this.runtimeSoundbiteStarting = false;
                this.runtimeSoundbiteStartedLocally = false;
                this.runtimeSoundbiteFinishedBeforeBind = null;
            }
            this.dbg(`runtime Soundbite bound to early playback appId=${appId}`);
            return;
        }

        if (this.runtimeSoundbiteToken === token && (this.runtimeSoundbiteAudio || this.runtimeSoundbiteStarting)) return;
        this.stopRuntimeSoundbite("replaced by new launch", true);
        this.runtimeSoundbiteToken = token;
        this.runtimeSoundbiteAppId = appId;
        this.runtimeSoundbitePath = path;
        this.runtimeSoundbiteStarting = true;
        this.runtimeSoundbiteStartedLocally = false;
        this.runtimeSoundbiteFinishedBeforeBind = null;
        try {
            const preview = await getSoundbitePreview({ source: path });
            if (this.runtimeSoundbiteToken !== token) return;
            if (!preview?.ok || !preview?.url) {
                this.dbg(`runtime Soundbite preview failed appId=${appId} token=${token}`);
                this.runtimeSoundbiteStarting = false;
                void soundbiteRuntimeFinished({ app_id: appId, token, status: "error", reason: preview?.message || "preview unavailable" }).catch(() => {});
                this.runtimeSoundbiteToken = "";
                this.runtimeSoundbiteAppId = 0;
                this.runtimeSoundbitePath = "";
                return;
            }

            const audio = new Audio(preview.url);
            const volume = Math.max(0, Math.min(1, Number(launchResult?.soundbite_effective_volume ?? 1)));
            audio.volume = Number.isFinite(volume) ? volume : 1;
            audio.preload = "auto";
            this.runtimeSoundbiteAudio = audio;
            this.runtimeSoundbiteStarting = false;

            const finish = (status, reason) => {
                if (this.runtimeSoundbiteToken !== token) return;
                this.runtimeSoundbiteAudio = null;
                this.runtimeSoundbiteToken = "";
                this.runtimeSoundbiteAppId = 0;
                this.runtimeSoundbitePath = "";
                this.runtimeSoundbiteStarting = false;
                this.runtimeSoundbiteStartedLocally = false;
                this.runtimeSoundbiteFinishedBeforeBind = null;
                void soundbiteRuntimeFinished({ app_id: appId, token, status, reason }).catch(() => {});
                this.dbg(`runtime Soundbite ${status} appId=${appId}`);
            };
            audio.onended = () => finish("finished", "ended");
            audio.onerror = () => finish("error", "HTMLAudioElement error");
            void soundbiteRuntimeStarted({ app_id: appId, token }).catch(() => {});
            await audio.play();
            if (this.runtimeSoundbiteToken !== token) {
                try { audio.pause?.(); } catch (_error) {}
                return;
            }
            this.runtimeSoundbiteStartedLocally = true;
            this.dbg(`runtime Soundbite started in Steam Chromium appId=${appId} volume=${audio.volume.toFixed(3)}`);
        }
        catch (error) {
            if (this.runtimeSoundbiteToken === token) {
                const message = String(error?.message || error || "browser playback failed");
                this.runtimeSoundbiteAudio = null;
                this.runtimeSoundbiteToken = "";
                this.runtimeSoundbiteAppId = 0;
                this.runtimeSoundbitePath = "";
                this.runtimeSoundbiteStarting = false;
                this.runtimeSoundbiteStartedLocally = false;
                this.runtimeSoundbiteFinishedBeforeBind = null;
                void soundbiteRuntimeFinished({ app_id: appId, token, status: "error", reason: message }).catch(() => {});
                this.dbg(`runtime Soundbite failed appId=${appId} error=${message}`);
            }
        }
    }
    scheduleBackendLaunch(reason, appId, logoSource, delayMs = 0, isShortcut = false, confirmedLaunch = false) {
        this.clearPendingBackendLaunch();
        const token = ++this.backendLaunchToken;
        const showLogo = this.gameSettingsForApp(appId).show_logo !== false;
        const run = (resolvedLogoSource) => {
            if (token !== this.backendLaunchToken) {
                return;
            }
            this.backendLaunchTimer = undefined;
            const request = { reason };
            if (confirmedLaunch) {
                request.confirmed_launch = true;
            }
            if (appId) {
                request.app_id = appId;
            }
            if (isShortcut) {
                request.is_shortcut = true;
            }
            if (resolvedLogoSource) {
                request.logo_source = resolvedLogoSource;
            }
            void launchRequested(request).then((result) => {
                if (token !== this.backendLaunchToken) return;
                if (result?.ok && result?.soundbite_path && result?.soundbite_token) {
                    void this.startRuntimeSoundbite(result, appId || 0);
                }
            }).catch((error) => {
                console.warn("Launch Curtain play hook failed", error);
            });
        };
        if (appId) {
            const initialLogoSource = showLogo ? (logoSource || undefined) : undefined;
            if (delayMs <= 0) {
                run(initialLogoSource);
            }
            else {
                this.backendLaunchTimer = window.setTimeout(() => run(initialLogoSource), delayMs);
            }
            if (!showLogo) {
                return;
            }
            void this.resolveGameLogoSource(appId, logoSource, isShortcut).then((resolvedLogoSource) => {
                if (token !== this.backendLaunchToken) {
                    return;
                }
                if (resolvedLogoSource) {
                    this.updateInstantCurtainLogo(appId, resolvedLogoSource);
                }
                if (this.backendLaunchTimer !== undefined) {
                    window.clearTimeout(this.backendLaunchTimer);
                    this.backendLaunchTimer = undefined;
                    run(resolvedLogoSource || initialLogoSource);
                }
            }).catch((error) => {
                console.warn("Launch Curtain logo lookup failed", error);
            });
            return;
        }
        if (delayMs <= 0) {
            run(logoSource);
            return;
        }
        this.backendLaunchTimer = window.setTimeout(() => run(logoSource), delayMs);
    }
    clearPendingBackendLaunch() {
        if (this.backendLaunchTimer !== undefined) {
            window.clearTimeout(this.backendLaunchTimer);
            this.backendLaunchTimer = undefined;
        }
    }
    showInstantLaunchSurface(appId) {
        this.showNativeBlackCover("SteamClient immediate black cover", LAUNCH_BRIDGE_COVER_MS);
        const targetAppId = appId || this.prearmedInstantAppId || this.currentBackdropAppId;
        if (targetAppId) {
            const settings = this.gameSettingsForApp(targetAppId);
            const logoSource = settings.show_logo === false ? undefined : this.findGameLogoSource(targetAppId);
            this.prearmInstantCurtain(
                targetAppId,
                logoSource,
                targetAppId >= 2147483648,
                settings.show_logo !== false
            );
        }
        else {
            this.currentBackdropAppId = undefined;
            this.paintInstantBackdrop("", 0);
            this.setInstantCurtainLogo("", false);
        }
        this.revealInstantCurtain(PROBATION_COVER_MS);
    }
    showNativeBlackCover(reason, ttlMs = PROBATION_COVER_MS) {
        if (!this.enabled || this.isModernMode()) {
            return;
        }
        const now = Date.now();
        if (now - this.lastNativeBlackCoverAt < 250) {
            return;
        }
        this.lastNativeBlackCoverAt = now;
        void showBlackCover({ reason, ttl_ms: ttlMs }).catch((error) => {
            console.warn("Launch Curtain black pre-cover failed", error);
        });
    }
    coverPostPlayInteraction(reason, target, composedPath) {
        if (!this.enabled) {
            return false;
        }
        const now = Date.now();
        if (now < this.postPlayCoverReadyAt || now > this.postPlayCoverUntil) {
            return false;
        }
        if (this.instantCurtainVisible || (!this.promptSuspended && now - this.lastPostPlayCoverAt < 550)) {
            return false;
        }
        if (!this.isPostPlayConfirmCandidate(target, composedPath)) {
            return false;
        }
        this.lastPostPlayCoverAt = now;
        this.promptSuspended = false;
        void setNativePromptVisible({ visible: false }).catch(() => {});
        this.showNativeBlackCover(reason, POST_PLAY_CONFIRM_COVER_MS);
        this.revealInstantCurtain(POST_PLAY_CONFIRM_COVER_MS);
        return true;
    }
    cancelPostPlayInteraction(reason, target, composedPath) {
        const now = Date.now();
        if (!this.enabled || this.postPlayCoverUntil <= 0 || now > this.postPlayCoverUntil) {
            return false;
        }
        if (!this.isPostPlayCancelCandidate(target, composedPath)) {
            return false;
        }
        this.dbg(`${reason}: Steam launch cancelled`);
        window.setTimeout(() => this.requestCloseAllCurtains(), 0);
        return true;
    }
    postPlayPromptSelector() {
        return '[role="dialog"], [role="menu"], [aria-modal="true"], [class*="Modal"], [class*="modal"], [class*="Dialog"], [class*="dialog"], [class*="Popup"], [class*="popup"]';
    }
    getPostPlayCandidateElements(target, composedPath) {
        const candidates = this.getCandidateElements(target, composedPath);
        const path = composedPath.length > 0 ? composedPath : this.parentPath(target);
        for (const item of path.slice(0, 12)) {
            if (!this.isElementNode(item)) {
                continue;
            }
            const role = item.getAttribute("role");
            if ((role === "menuitem" || role === "option") && !candidates.includes(item)) {
                candidates.push(item);
            }
        }
        return candidates;
    }
    isPostPlayCancelCandidate(target, composedPath) {
        return this.getPostPlayCandidateElements(target, composedPath).some((element) => {
            const promptAncestor = element.closest?.(this.postPlayPromptSelector());
            if (!this.isElementNode(promptAncestor)) {
                return false;
            }
            return this.getLabels(element).some((label) => POST_PLAY_CANCEL_PATTERN.test(this.normalizeLabel(label)));
        });
    }
    isPostPlayConfirmCandidate(target, composedPath) {
        if (this.isPostPlayCancelCandidate(target, composedPath)) {
            return false;
        }
        const candidates = this.getPostPlayCandidateElements(target, composedPath);
        if (candidates.length <= 0) {
            return false;
        }
        return candidates.some((element) => {
            const labels = this.getLabels(element).join(" ");
            if (POST_PLAY_CONFIRM_PATTERN.test(labels)) {
                return true;
            }
            const promptAncestor = element.closest?.(this.postPlayPromptSelector());
            if (!this.isElementNode(promptAncestor)) {
                return false;
            }
            const rect = promptAncestor.getBoundingClientRect();
            const text = (promptAncestor.innerText || promptAncestor.textContent || "").replace(/\s+/g, " ").trim();
            return rect.width >= 260 && rect.height >= 120 && (POST_PLAY_CONFIRM_PATTERN.test(text) || text.length >= 10);
        });
    }
    patchSteamClient() {
        this.registerSteamPopupHooks();
        const apps = window.SteamClient?.Apps;
        if (!apps || apps === this.patchedApps) {
            return;
        }
        this.restoreMethodPatches();
        this.patchedApps = apps;
        [
            "RunGame",
            "RunGameAndWaitForInstaller",
            "RunShortcut"
        ].forEach((methodName) => this.patchSteamMethod(apps, methodName));
    }
    patchSteamMethod(apps, methodName) {
        const current = apps[methodName];
        if (typeof current !== "function") {
            return;
        }
        const originalFn = current.__playhubLaunchCurtainOriginal || current;
        const wrapped = function (...args) {
            const appId = playButtonHook.extractAppIdFromUnknown(args);
            playButtonHook.showInstantLaunchSurface(appId);
            playButtonHook.trigger(`SteamClient.Apps.${methodName}`, appId, undefined, true, methodName === "RunShortcut");
            return originalFn.apply(this, args);
        };
        wrapped.__playhubLaunchCurtainOriginal = originalFn;
        try {
            apps[methodName] = wrapped;
            this.methodRestorers.push(() => {
                if (apps[methodName] === wrapped) {
                    apps[methodName] = originalFn;
                }
            });
        }
        catch (error) {
            console.warn(`Launch Curtain could not patch ${methodName}`, error);
        }
    }
    restoreMethodPatches() {
        this.methodRestorers.forEach((restore) => restore());
        this.methodRestorers = [];
    }
    getAllSteamDocuments() {
        const docs = [];
        const seen = new Set();
        const push = (candidate) => {
            try {
                const doc = candidate?.document ?? candidate;
                if (!doc || typeof doc.querySelector !== "function" || !doc.documentElement || seen.has(doc)) return;
                seen.add(doc);
                docs.push(doc);
            }
            catch (_error) {}
        };
        const roots = [globalThis, globalThis.window, globalThis.window?.opener].filter(Boolean);
        for (const root of roots) {
            try { push(root?.SteamUIStore?.GetFocusedWindowInstance?.()?.BrowserWindow); } catch (_error) {}
            try { push(root?.SteamUIStore?.WindowStore?.GamepadUIMainWindowInstance?.BrowserWindow); } catch (_error) {}
            try {
                const windows = root?.SteamUIStore?.WindowStore?.SteamUIWindows;
                if (Array.isArray(windows)) windows.forEach((entry) => push(entry?.BrowserWindow));
            }
            catch (_error) {}
            try { push(root?.Router?.WindowStore?.GamepadUIMainWindowInstance?.BrowserWindow); } catch (_error) {}
            try {
                const manager = root?.g_PopupManager;
                const popups = Array.from(manager?.GetPopups?.() ?? manager?.m_mapPopups?.values?.() ?? []);
                popups.forEach((entry) => {
                    push(entry?.m_popup);
                    push(entry?.m_popup?.window);
                    push(entry?.m_element?.ownerDocument);
                });
            }
            catch (_error) {}
        }
        try { push(document); } catch (_error) {}
        try { push(window); } catch (_error) {}
        return docs;
    }
    registerSteamPopupHooks() {
        const manager = globalThis.g_PopupManager;
        if (!manager) {
            return;
        }
        if (!this.popupCreatedRegistration && typeof manager.AddPopupCreatedCallback === "function") {
            this.popupCreatedRegistration = manager.AddPopupCreatedCallback(() => {
                window.setTimeout(() => {
                    this.ensureInstantCurtainPrepared();
                    if (this.instantCurtainVisible) {
                        this.syncModernCurtainSurfaces();
                    }
                }, 0);
            });
        }
        if (!this.popupDestroyedRegistration && typeof manager.AddPopupDestroyedCallback === "function") {
            this.popupDestroyedRegistration = manager.AddPopupDestroyedCallback(() => {
                window.setTimeout(() => this.ensureInstantCurtainPrepared(), 0);
            });
        }
    }
    releaseSteamPopupRegistration(registration) {
        try {
            if (typeof registration === "function") {
                registration();
            }
            else {
                registration?.Unregister?.();
                registration?.unregister?.();
                registration?.Dispose?.();
                registration?.dispose?.();
            }
        }
        catch (_error) {}
    }
    unregisterSteamPopupHooks() {
        this.releaseSteamPopupRegistration(this.popupCreatedRegistration);
        this.releaseSteamPopupRegistration(this.popupDestroyedRegistration);
        this.popupCreatedRegistration = undefined;
        this.popupDestroyedRegistration = undefined;
    }
    createInstantCurtain(doc) {
        const curtain = doc.createElement("div");
        curtain.className = "launch-curtain-instant";
        curtain.setAttribute("data-launch-curtain-surface", "true");
        curtain.setAttribute("data-launch-curtain-owner", this.instanceId);
        curtain.style.display = "none";
        curtain.style.visibility = "hidden";
        curtain.style.opacity = "0";
        curtain.style.pointerEvents = "none";
        curtain.innerHTML = `
      <style>
        .launch-curtain-cursor-hidden,
        .launch-curtain-cursor-hidden * {
          cursor: none !important;
        }
        .launch-curtain-instant {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: none;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          cursor: none;
          transition: opacity 650ms ease;
          will-change: opacity;
          contain: layout paint style;
          isolation: isolate;
          transform: translateZ(0);
        }
        .launch-curtain-instant__stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1);
          transform-origin: center center;
          opacity: 0;
          transition: opacity 550ms ease;
        }
        .launch-curtain-instant--art-visible .launch-curtain-instant__stack {
          opacity: 1;
        }
        .launch-curtain-instant__logo {
          font-family: "Arial Rounded MT Bold", "Segoe UI", Arial, sans-serif;
          font-size: min(9vw, 86px);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1;
        }
        .launch-curtain-instant__logo-image {
          display: block;
          width: min(42vw, 720px);
          max-height: min(20vh, 180px);
          object-fit: contain;
          opacity: 0;
          transition: opacity 450ms ease;
        }
        .launch-curtain-instant__logo-image--in { opacity: 1; }
        .launch-curtain-instant__fallback-logo {
          display: none;
        }
        .launch-curtain-instant__fallback-logo--visible {
          display: block;
        }
        .launch-curtain-instant__fallback-logo-image {
          display: block;
        }
        .launch-curtain-instant__backdrop {
          position: absolute; left: 50%; top: 50%; width: 100%; height: 100%;
          max-width: none; max-height: none; object-fit: fill; opacity: 0; z-index: 0; pointer-events: none;
          transform-origin: center center;
          transform: translate(-50%, -50%) scale(var(--lc-backdrop-scale, 1));
          transition: opacity 550ms ease;
        }
        .launch-curtain-instant--art-visible .launch-curtain-instant__backdrop {
          opacity: var(--lc-backdrop-opacity, 1);
        }
        /* Modern close: keep the surface itself fully black while artwork, logo
           and status fade into it. After 500 ms the black surface is removed,
           revealing the already-focused game. */
        .launch-curtain-instant--closing .launch-curtain-instant__backdrop,
        .launch-curtain-instant--closing .launch-curtain-instant__stack,
        .launch-curtain-instant--closing .launch-curtain-instant__status {
          opacity: 0 !important;
          transition: opacity 500ms ease !important;
        }
        @keyframes launch-curtain-bg-zoom {
          from { transform: translate(-50%, -50%) scale(calc(var(--lc-backdrop-scale, 1) * 1.06)); }
          to { transform: translate(-50%, -50%) scale(var(--lc-backdrop-scale, 1)); }
        }
        .launch-curtain-instant__backdrop--zoom {
          animation: launch-curtain-bg-zoom 12s ease-out forwards;
          transform-origin: center center;
        }
        .launch-curtain-instant__stack { z-index: 2; }
        .launch-curtain-instant__status {
          position: absolute; right: 3.2vw; bottom: 3.4vh; z-index: 3;
          display: flex; align-items: center; justify-content: flex-end; gap: 0.55em;
          font-family: "Segoe UI", Arial, sans-serif; font-size: min(2.2vw, 20px);
          color: #fff; opacity: 0.92; max-width: 60vw; pointer-events: none;
        }
        .launch-curtain-instant__status-text {
          text-align: right; white-space: pre-wrap;
          text-shadow: 0 1px 6px rgba(0,0,0,0.75);
        }
        .launch-curtain-instant__spin {
          width: 1em; height: 1em; border-radius: 50%;
          border: 0.12em solid rgba(255,255,255,0.35); border-top-color: #fff;
          display: none; box-sizing: border-box;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7));
          animation: launch-curtain-spin 0.8s linear infinite;
        }
        @keyframes launch-curtain-spin { to { transform: rotate(360deg); } }
        @keyframes launch-curtain-logo-zoom { from { transform: scale(1); } to { transform: scale(1.08); } }
      </style>
      <img class="launch-curtain-instant__backdrop" alt="" />
      <div class="launch-curtain-instant__stack">
        <div class="launch-curtain-instant__logo-slot">
          ${this.logoMarkup(this.currentInstantShowLogo ? this.currentInstantLogoUrl : "")}
        </div>
      </div>
      <div class="launch-curtain-instant__status"><span class="launch-curtain-instant__status-text">${this.escapeHtml(this.currentInstantStatusText)}</span><span class="launch-curtain-instant__spin"></span></div>
    `;
        doc.documentElement.appendChild(curtain);
        try {
            doc.addEventListener("keydown", this.handleKeyDown, true);
            doc.addEventListener("keyup", this.handleKeyClose, true);
            if (doc !== document) {
                doc.addEventListener("pointerdown", this.handlePointerDown, true);
                doc.addEventListener("mousedown", this.handleMouseDown, true);
                doc.addEventListener("touchstart", this.handleTouchStart, true);
                doc.addEventListener("pointerover", this.handlePointerOver, true);
                doc.addEventListener("focusin", this.handleFocusIn, true);
                doc.addEventListener("click", this.handleClick, true);
            }
            this.instantCurtainKeyDocuments.add(doc);
        }
        catch (_error) {}
        this.wireInstantLogoFallback(curtain);
        if (this.instantCurtainVisible) {
            doc.documentElement.classList.add("launch-curtain-cursor-hidden");
            curtain.style.transition = "none";
            curtain.style.display = "flex";
            curtain.style.visibility = "visible";
            curtain.style.opacity = "1";
        }
        return curtain;
    }
    ensureInstantCurtainPrepared() {
        for (const [doc, curtain] of Array.from(this.instantCurtainElementsByDocument.entries())) {
            if (!curtain?.isConnected || !doc?.documentElement?.isConnected) {
                try { this.instantCurtainObserversByDocument.get(doc)?.disconnect?.(); } catch (_error) {}
                try { doc.removeEventListener("keydown", this.handleKeyDown, true); } catch (_error) {}
                try { doc.removeEventListener("keyup", this.handleKeyClose, true); } catch (_error) {}
                try { doc.removeEventListener("pointerdown", this.handlePointerDown, true); } catch (_error) {}
                try { doc.removeEventListener("mousedown", this.handleMouseDown, true); } catch (_error) {}
                try { doc.removeEventListener("touchstart", this.handleTouchStart, true); } catch (_error) {}
                try { doc.removeEventListener("pointerover", this.handlePointerOver, true); } catch (_error) {}
                try { doc.removeEventListener("focusin", this.handleFocusIn, true); } catch (_error) {}
                try { doc.removeEventListener("click", this.handleClick, true); } catch (_error) {}
                this.instantCurtainKeyDocuments.delete(doc);
                this.instantCurtainObserversByDocument.delete(doc);
                try { curtain?.remove?.(); } catch (_error) {}
                this.instantCurtainElementsByDocument.delete(doc);
            }
        }
        for (const doc of this.getAllSteamDocuments()) {
            const existing = this.instantCurtainElementsByDocument.get(doc);
            try {
                for (const stale of Array.from(doc.querySelectorAll('[data-launch-curtain-surface="true"]'))) {
                    if (stale === existing && stale.getAttribute("data-launch-curtain-owner") === this.instanceId) {
                        continue;
                    }
                    stale.style.display = "none";
                    stale.style.visibility = "hidden";
                    stale.style.opacity = "0";
                    stale.remove();
                }
                if (existing?.isConnected) {
                    continue;
                }
                doc.documentElement.classList.remove("launch-curtain-cursor-hidden");
                this.instantCurtainElementsByDocument.set(doc, this.createInstantCurtain(doc));
            }
            catch (error) {
                console.warn("Launch Curtain could not create a Steam UI surface", error);
            }
        }
        const curtains = Array.from(this.instantCurtainElementsByDocument.values()).filter((item) => item?.isConnected);
        this.instantCurtainElement = curtains[0];
        this.preloadLogo(this.fallbackLogoUrl());
        return this.instantCurtainElement;
    }
    instantCurtains() {
        this.ensureInstantCurtainPrepared();
        return Array.from(this.instantCurtainElementsByDocument.values()).filter((item) => item?.isConnected);
    }
    prearmInstantCurtain(appId, logoSource, isShortcut = false, showLogo = true) {
        this.ensureInstantCurtainPrepared();
        if (this.instantCurtainVisible) {
            return;
        }
        if (!appId) {
            this.prearmedInstantAppId = undefined;
            this.prearmLogoToken += 1;
            this.refreshPreparedFallback();
            return;
        }
        this.prearmedInstantAppId = appId;
        this.currentBackdropAppId = appId;
        this.applyInstantLogoPlacement(this.gameSettingsForApp(appId));
        this.applyInstantBackdrop(appId);
        if (!showLogo) {
            this.setInstantCurtainLogo("", false);
            return;
        }
        this.updateInstantCurtainLogo(appId, logoSource, isShortcut, true, true);
        const token = ++this.prearmLogoToken;
        void this.resolveGameLogoSource(appId, logoSource, isShortcut).then((resolvedLogoSource) => {
            if (token !== this.prearmLogoToken
                || this.instantCurtainVisible
                || this.prearmedInstantAppId !== appId
                || !resolvedLogoSource) {
                return;
            }
            this.updateInstantCurtainLogo(appId, resolvedLogoSource, isShortcut, true, true);
        }).catch((error) => {
            console.warn("Launch Curtain prearm logo lookup failed", error);
        });
    }
    showInstantCurtain(appId, logoSource, isShortcut = false, showLogo = true, durationMs = PROBATION_COVER_MS) {
        this.currentBackdropAppId = appId;
        if (appId) {
            this.applyInstantLogoPlacement(this.gameSettingsForApp(appId));
            this.updateInstantCurtainLogo(appId, logoSource, isShortcut, showLogo);
        }
        else if (!this.prearmedInstantAppId && !this.instantCurtainVisible) {
            this.applyInstantLogoPlacement();
            this.refreshPreparedFallback();
        }
        this.revealInstantCurtain(durationMs);
    }
    applyInstantLogoPlacement(settings = {}) {
        const x = Math.max(0, Math.min(100, Number(settings.logo_position_x ?? 50)));
        const y = Math.max(0, Math.min(100, Number(settings.logo_position_y ?? 50)));
        const scale = Math.max(50, Math.min(200, Number(settings.logo_scale ?? 100))) / 100;
        const zoomEnabled = settings.logo_zoom_enabled !== false;
        for (const curtain of this.instantCurtains()) {
            const stack = curtain.querySelector(".launch-curtain-instant__stack");
            if (!stack) continue;
            stack.style.left = `${x}%`;
            stack.style.top = `${y}%`;
            stack.style.transform = `translate(-50%, -50%) scale(${scale})`;
            stack.querySelectorAll(".launch-curtain-instant__logo-image, .launch-curtain-instant__logo").forEach((logo) => {
                if (!zoomEnabled) {
                    logo.style.animation = "none";
                    logo.style.animationDelay = "";
                    delete logo.dataset.lcAnimationEpoch;
                    return;
                }
                const epoch = String(this.instantAnimationEpoch);
                if (logo.dataset.lcAnimationEpoch === epoch) {
                    return;
                }
                const elapsed = Math.max(0, Date.now() - this.instantAnimationStartedAt);
                logo.style.animation = "launch-curtain-logo-zoom 18s ease-out forwards";
                logo.style.animationDelay = `${-Math.min(elapsed, 18000)}ms`;
                logo.dataset.lcAnimationEpoch = epoch;
            });
        }
    }
    isModernMode() {
        const globalMode = String((this.settingsCache && this.settingsCache.curtain_mode) || "modern");
        const forced = String(this.gameSettingsForApp(this.currentBackdropAppId).force_mode || "auto");
        const effective = (forced === "classic" || forced === "modern") ? forced : globalMode;
        return effective === "modern";
    }
    dbg(msg) {
        try { debugLog("LC " + String(msg)); } catch (e) {}
    }
    startArmPoll() {
        this.stopArmPoll();
        const poll = () => {
            void getStatus().then((st) => {
                const wasGameRunning = this.gameRunning;
                this.gameRunning = !!(st && st.game_running);
                if (wasGameRunning && !this.gameRunning) {
                    this.stopRuntimeSoundbite("game exit observed");
                    this.suppressPrearmUntil = Date.now() + 8000;
                    if (this.instantCurtainVisible) {
                        this.hideInstantCurtain(true);
                    }
                    else {
                        this.clearInstantArtwork();
                    }
                    this.dbg("game exit observed: cleared prepared artwork");
                }
            }).catch(() => {});
            this.armPollTimer = window.setTimeout(poll, 2000);
        };
        this.armPollTimer = window.setTimeout(poll, 2000);
    }
    stopArmPoll() {
        if (this.armPollTimer !== undefined) {
            window.clearTimeout(this.armPollTimer);
            this.armPollTimer = undefined;
        }
    }
    isBigPictureActive() {
        try {
            try {
                const ui = window.SteamClient && window.SteamClient.UI;
                if (ui && typeof ui.GetUIMode === "function") {
                    Promise.resolve(ui.GetUIMode()).then((m) => { this.uiMode = m; }).catch(() => {});
                }
            } catch (e) {}
            // Mostriamo la tenda ovunque TRANNE quando siamo con certezza in Desktop
            // (EUIMode.Desktop === 7). In Big Picture o modalità sconosciuta -> mostra.
            if (this.uiMode === 7) return false;
            return true;
        } catch (e) {
            return true;
        }
    }
    localFileUrl(path) {
        const p = String(path || "").replace(/\\/g, "/");
        if (!p) return "";
        if (/^https?:\/\//i.test(p) || p.indexOf("file://") === 0) return p;
        const prefixed = p.charAt(0) === "/" ? p : "/" + p;
        return "file://" + encodeURI(prefixed);
    }
    paintInstantBackdrop(url, opacity) {
        const resolvedUrl = String(url || "").trim();
        for (const curtain of this.instantCurtains()) {
            const img = curtain.querySelector(".launch-curtain-instant__backdrop");
            if (!img) continue;
            const safeOpacity = Math.max(0, Math.min(1, Number(opacity) || 0));
            img.style.setProperty("--lc-backdrop-opacity", resolvedUrl ? String(safeOpacity) : "0");
            if (resolvedUrl) {
                // clearInstantArtwork() hard-hides the previous frame. Restore CSS
                // control before arming the next image, otherwise inline opacity
                // keeps every later backdrop invisible while the logo still shows.
                img.style.removeProperty("opacity");
                img.style.removeProperty("transition");
                if (img.getAttribute("src") !== resolvedUrl) {
                    img.addEventListener("load", () => {
                        if (this.instantCurtainVisible) {
                            this.applyInstantBgZoom(this.currentBackdropAppId);
                        }
                    }, { once: true });
                    img.setAttribute("src", resolvedUrl);
                }
            }
            else {
                img.removeAttribute("src");
            }
        }
    }
    applyInstantBackdropPlacement(appId) {
        const gs = this.gameSettingsForApp(appId);
        const scalePercent = Math.max(100, Math.min(200, Number(gs.background_scale ?? 100)));
        const panX = Math.max(0, Math.min(100, Number(gs.background_position_x ?? 50)));
        const panY = Math.max(0, Math.min(100, Number(gs.background_position_y ?? 50)));
        const scale = scalePercent / 100;
        for (const curtain of this.instantCurtains()) {
            const img = curtain.querySelector(".launch-curtain-instant__backdrop");
            if (!img) continue;
            const rect = curtain.getBoundingClientRect?.();
            const viewportAspect = rect && rect.width > 0 && rect.height > 0 ? rect.width / rect.height : (16 / 9);
            const imageAspect = img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : viewportAspect;
            let baseWidth = 100;
            let baseHeight = 100;
            if (imageAspect > viewportAspect)
                baseWidth = (imageAspect / viewportAspect) * 100;
            else if (imageAspect < viewportAspect)
                baseHeight = (viewportAspect / imageAspect) * 100;
            const scaledWidth = baseWidth * scale;
            const scaledHeight = baseHeight * scale;
            const xTravel = Math.max(0, (scaledWidth - 100) / 2);
            const yTravel = Math.max(0, (scaledHeight - 100) / 2);
            const left = 50 + ((panX - 50) / 50) * xTravel;
            const top = 50 + ((panY - 50) / 50) * yTravel;
            img.style.width = `${baseWidth}%`;
            img.style.height = `${baseHeight}%`;
            img.style.left = `${left}%`;
            img.style.top = `${top}%`;
            img.style.setProperty("--lc-backdrop-scale", String(scale));
            if (!img.classList.contains("launch-curtain-instant__backdrop--zoom")) {
                img.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
        }
    }
    applyInstantBackdrop(appId) {
        const gs = this.gameSettingsForApp(appId);
        const cache = this.settingsCache || {};
        this.applyInstantBackdropPlacement(appId);
        const path = String(gs.fullscreen_image_path || cache.fullscreen_image_path || "").trim();
        let opacity = gs.background_opacity;
        if (typeof opacity !== "number") opacity = typeof cache.background_opacity === "number" ? cache.background_opacity : 100;
        opacity = Math.max(0, Math.min(100, Number(opacity))) / 100;
        const sourceChanged = path !== this.currentBackdropSource;
        const opacityChanged = opacity !== this.currentBackdropOpacity;
        this.currentBackdropOpacity = opacity;
        if (!path) {
            if (sourceChanged || this.currentBackdropResolvedUrl) {
                this.dbg("backdrop none opacity=" + opacity + " appId=" + (appId || 0));
            }
            this.currentBackdropSource = "";
            this.currentBackdropResolvedUrl = "";
            this.backdropPreviewToken += 1;
            this.paintInstantBackdrop("", opacity);
            this.applyInstantLogoShadow(appId);
            return;
        }
        if (sourceChanged) {
            this.currentBackdropSource = path;
            this.currentBackdropResolvedUrl = this.browserImageUrl(path);
            const token = ++this.backdropPreviewToken;
            this.dbg("backdrop resolving opacity=" + opacity + " appId=" + (appId || 0));
            this.paintInstantBackdrop(this.currentBackdropResolvedUrl, opacity);
            void this.resolveUiImageUrl(path).then((url) => {
                if (token !== this.backdropPreviewToken || this.currentBackdropSource !== path) {
                    return;
                }
                this.currentBackdropResolvedUrl = url || this.localFileUrl(path);
                this.paintInstantBackdrop(this.currentBackdropResolvedUrl, this.currentBackdropOpacity);
                this.dbg("backdrop ready=" + Boolean(this.currentBackdropResolvedUrl) + " appId=" + (appId || 0));
            });
        }
        else if (opacityChanged || this.currentBackdropResolvedUrl) {
            this.paintInstantBackdrop(this.currentBackdropResolvedUrl, opacity);
        }
        this.applyInstantLogoShadow(appId);
    }
    setInstantStatus(text) {
        try {
            const t = String(text == null ? "" : text);
            this.currentInstantStatusText = t;
            if (!this.isModernMode()) return;
            if (!(this.settingsCache && this.settingsCache.show_launch_info)) return;
            for (const curtain of this.instantCurtains()) {
                const el = curtain.querySelector(".launch-curtain-instant__status-text");
                const spin = curtain.querySelector(".launch-curtain-instant__spin");
                if (el) el.textContent = t;
                if (spin) spin.style.display = t ? "inline-block" : "none";
            }
        } catch (e) {}
    }
    applyInstantLogoShadow(appId) {
        const gs = this.gameSettingsForApp(appId);
        let op = gs.logo_shadow_opacity;
        if (typeof op !== "number") op = typeof this.settingsCache?.logo_shadow_opacity === "number" ? this.settingsCache.logo_shadow_opacity : 0;
        op = Math.max(0, Math.min(100, Number(op))) / 100;
        let bl = gs.logo_shadow_blur;
        if (typeof bl !== "number") bl = typeof this.settingsCache?.logo_shadow_blur === "number" ? this.settingsCache.logo_shadow_blur : 40;
        bl = Math.max(0, Math.min(100, Number(bl)));
        const blurPx = Math.round(3 + (bl / 100) * 55);
        // Doppio drop-shadow per un'ombra decisamente piu' intensa verso il 100%.
        const one = `drop-shadow(0 8px ${blurPx}px rgba(0,0,0,${op}))`;
        const filter = op > 0 ? (one + " " + one) : "";
        for (const curtain of this.instantCurtains()) {
            curtain.querySelectorAll(".launch-curtain-instant__logo-image").forEach((im) => { im.style.filter = filter; });
        }
    }
    applyInstantBgZoom(appId, restart = false) {
        const settings = this.gameSettingsForApp(appId);
        const on = settings.bg_zoom_enabled === true;
        const baseScale = Math.max(100, Math.min(200, Number(settings.background_scale ?? 100))) / 100;
        this.applyInstantBackdropPlacement(appId);
        for (const curtain of this.instantCurtains()) {
            const img = curtain.querySelector(".launch-curtain-instant__backdrop");
            if (!img) continue;
            if (!on) {
                img.classList.remove("launch-curtain-instant__backdrop--zoom");
                img.style.animationDelay = "";
                img.style.transform = `translate(-50%, -50%) scale(${baseScale})`;
                delete img.dataset.lcAnimationEpoch;
                continue;
            }
            img.style.transform = "";
            const epoch = String(this.instantAnimationEpoch);
            if (!restart && img.dataset.lcAnimationEpoch === epoch) {
                continue;
            }
            if (restart && img.dataset.lcAnimationEpoch !== epoch) {
                img.classList.remove("launch-curtain-instant__backdrop--zoom");
                img.getBoundingClientRect();
            }
            const elapsed = Math.max(0, Date.now() - this.instantAnimationStartedAt);
            img.style.animationDelay = `${-Math.min(elapsed, 12000)}ms`;
            img.classList.add("launch-curtain-instant__backdrop--zoom");
            img.dataset.lcAnimationEpoch = epoch;
        }
    }
    syncModernCurtainSurfaces() {
        if (!this.instantCurtainVisible || !this.isModernMode()) return;
        this.ensureInstantCurtainPrepared();
        this.applyInstantLogoPlacement(this.gameSettingsForApp(this.currentBackdropAppId));
        this.applyInstantBackdrop(this.currentBackdropAppId);
        this.applyInstantBgZoom(this.currentBackdropAppId);
        this.setInstantStatus(this.currentInstantStatusText);
    }
    beginModernFadeToBlack() {
        if (!this.instantCurtainVisible || !this.isModernMode() || this.modernFadeToBlackActive) return;
        this.modernFadeToBlackActive = true;
        this.dbg("handoff: starting 0.5s fade-to-black before game focus");
        for (const curtain of this.instantCurtains()) {
            try {
                curtain.style.transition = "none";
                curtain.style.opacity = "1";
                curtain.classList.remove("launch-curtain-instant--art-visible");
                curtain.classList.add("launch-curtain-instant--closing");
            }
            catch (_error) {}
        }
    }
    startModernHandoffPoll() {
        this.stopModernHandoffPoll();
        this.modernHandoffArmed = false;
        const poll = () => {
            void getStatus().then((st) => {
                if (!this.instantCurtainVisible) { this.modernHandoffTimer = undefined; return; }
                this.syncModernCurtainSurfaces();
                if (st && st.modern_curtain_show === true) this.modernHandoffArmed = true;
                if (this.modernHandoffArmed && st && st.modern_curtain_fade_to_black === true) {
                    this.beginModernFadeToBlack();
                }
                if (this.modernHandoffArmed && st && st.modern_curtain_show === false) {
                    this.dbg("handoff: hiding black cover after game focus");
                    this.hideInstantCurtain();
                    return;
                }
                this.modernHandoffTimer = window.setTimeout(poll, 100);
            }).catch(() => {
                this.modernHandoffTimer = window.setTimeout(poll, 250);
            });
        };
        this.modernHandoffTimer = window.setTimeout(poll, 100);
    }
    stopModernHandoffPoll() {
        if (this.modernHandoffTimer !== undefined) {
            window.clearTimeout(this.modernHandoffTimer);
            this.modernHandoffTimer = undefined;
        }
        this.modernHandoffArmed = false;
    }
    revealInstantCurtain(durationMs = PROBATION_COVER_MS) {
        if (!this.enabled) {
            return;
        }
        if (!this.isBigPictureActive()) {
            this.dbg("reveal blocked: not BigPicture uiMode=" + this.uiMode);
            return;
        }
        this.dbg("reveal modern=" + this.isModernMode() + " appId=" + this.currentBackdropAppId);
        if (this.instantCurtainHideTimer !== undefined) {
            window.clearTimeout(this.instantCurtainHideTimer);
            this.instantCurtainHideTimer = undefined;
        }
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
        }
        if (this.instantCurtainSafetyTimer !== undefined) {
            window.clearTimeout(this.instantCurtainSafetyTimer);
            this.instantCurtainSafetyTimer = undefined;
        }
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        const wasVisible = this.instantCurtainVisible;
        this.instantCurtainVisible = true;
        this.modernFadeToBlackActive = false;
        if (!wasVisible) {
            this.instantAnimationEpoch += 1;
            this.instantAnimationStartedAt = Date.now();
        }
        const curtains = this.instantCurtains();
        this.dbg("modern surfaces=" + curtains.length);
        for (const curtain of curtains) {
            curtain.ownerDocument?.documentElement?.classList?.add("launch-curtain-cursor-hidden");
            curtain.classList.remove("launch-curtain-instant--art-visible", "launch-curtain-instant--closing");
            curtain.style.transition = "none";
            curtain.style.display = "flex";
            curtain.style.visibility = "visible";
            curtain.style.opacity = "1";
            curtain.getBoundingClientRect();
        }
        this.applyInstantBackdrop(this.currentBackdropAppId);
        this.applyInstantBgZoom(this.currentBackdropAppId, true);
        this.applyInstantLogoPlacement(this.gameSettingsForApp(this.currentBackdropAppId));
        this.instantCurtainTransitionFrame = window.requestAnimationFrame(() => {
            this.instantCurtainTransitionFrame = undefined;
            curtains.forEach((curtain) => { curtain.style.transition = ""; });
            window.requestAnimationFrame(() => {
                if (!this.instantCurtainVisible) return;
                this.instantCurtains().forEach((curtain) => curtain.classList.add("launch-curtain-instant--art-visible"));
            });
        });
        if (this.isModernMode()) {
            this.instantCurtainExpiresAt = 0;
            this.instantCurtainSafetyTimer = window.setTimeout(() => {
                this.instantCurtainSafetyTimer = undefined;
                if (!this.instantCurtainVisible) {
                    return;
                }
                this.dbg("fail-open watchdog released a stale modern curtain");
                this.requestCloseAllCurtains();
            }, MODERN_FAIL_OPEN_MS);
            this.startGamepadClosePolling();
            this.startModernHandoffPoll();
        }
        if (this.postPlayCoverUntil > Date.now()) {
            this.startPromptWatch();
        }
        else {
            const safeDurationMs = Math.max(600, Math.min(4200, Number(durationMs) || PROBATION_COVER_MS));
            this.instantCurtainExpiresAt = Date.now() + safeDurationMs;
            this.instantCurtainTimer = window.setTimeout(() => this.hideInstantCurtain(), safeDurationMs);
            this.startGamepadClosePolling();
        }
    }
    hideExpiredInstantCurtain() {
        if (this.instantCurtainVisible && this.instantCurtainExpiresAt > 0 && Date.now() >= this.instantCurtainExpiresAt) {
            this.hideInstantCurtain();
        }
    }
    clearInstantArtwork() {
        this.backdropPreviewToken += 1;
        this.logoPreviewToken += 1;
        this.currentBackdropAppId = undefined;
        this.currentBackdropSource = "";
        this.currentBackdropResolvedUrl = "";
        this.currentBackdropOpacity = 0;
        this.activeInstantAppId = undefined;
        this.prearmedInstantAppId = undefined;
        for (const curtain of Array.from(this.instantCurtainElementsByDocument.values()).filter((item) => item?.isConnected)) {
            try {
                curtain.style.display = "none";
                curtain.style.visibility = "hidden";
                curtain.style.opacity = "0";
                curtain.ownerDocument?.documentElement?.classList?.remove("launch-curtain-cursor-hidden");
                curtain.classList.remove("launch-curtain-instant--art-visible", "launch-curtain-instant--closing");
                const backdrop = curtain.querySelector(".launch-curtain-instant__backdrop");
                if (backdrop) {
                    backdrop.style.transition = "none";
                    backdrop.style.opacity = "0";
                    backdrop.removeAttribute("src");
                    backdrop.classList.remove("launch-curtain-instant__backdrop--zoom");
                    delete backdrop.dataset.lcAnimationEpoch;
                }
            }
            catch (_error) {}
        }
        this.setInstantCurtainLogo("", false);
    }
    hideInstantCurtain(clearArtworkImmediately = false) {
        // In Classic mode this DOM surface is only the short handoff into the WPF
        // curtain. Do not stop browser audio when that bridge disappears. Modern
        // uses the DOM curtain itself, so hiding it really ends the curtain.
        if (this.isModernMode()) this.stopRuntimeSoundbite("modern curtain hidden");
        if (this.instantCurtainSafetyTimer !== undefined) {
            window.clearTimeout(this.instantCurtainSafetyTimer);
            this.instantCurtainSafetyTimer = undefined;
        }
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
            this.instantCurtainTimer = undefined;
        }
        this.stopGamepadClosePolling();
        this.stopModernHandoffPoll();
        this.stopPromptWatch();
        this.promptSuspended = false;
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        this.instantCurtainExpiresAt = 0;
        this.activeInstantAppId = undefined;
        this.prearmedInstantAppId = undefined;
        this.prearmLogoToken += 1;
        this.lastTriggerAt = 0;
        const curtains = Array.from(this.instantCurtainElementsByDocument.values()).filter((item) => item?.isConnected);
        if (!curtains.length || !this.instantCurtainVisible) {
            this.getAllSteamDocuments().forEach((doc) => doc.documentElement?.classList?.remove("launch-curtain-cursor-hidden"));
            return;
        }
        this.instantCurtainVisible = false;
        this.currentInstantStatusText = "";
        const modernHide = this.isModernMode();
        const modernFadeAlreadyCompleted = modernHide && this.modernFadeToBlackActive;
        for (const curtain of curtains) {
            try {
                const statusTextEl = curtain.querySelector(".launch-curtain-instant__status-text");
                if (statusTextEl) statusTextEl.textContent = "";
                const spinEl = curtain.querySelector(".launch-curtain-instant__spin");
                if (spinEl) spinEl.style.display = "none";
                curtain.classList.remove("launch-curtain-instant--art-visible");
            }
            catch (e) {}
            if (modernHide) {
                curtain.style.transition = "none";
                curtain.style.opacity = "1";
                curtain.classList.add("launch-curtain-instant--closing");
            }
            else {
                curtain.style.transition = "";
                curtain.style.opacity = "0";
            }
        }
        // Classic keeps the previous immediate-clear behavior. Modern deliberately
        // keeps its artwork alive for the 500 ms fade-to-black, even on a manual
        // close, so the transition cannot collapse into an abrupt cut.
        if (clearArtworkImmediately && !modernHide) {
            this.clearInstantArtwork();
        }
        this.instantCurtainHideTimer = window.setTimeout(() => {
            this.instantCurtainHideTimer = undefined;
            if (this.instantCurtainVisible) {
                return;
            }
            curtains.forEach((curtain) => {
                curtain.style.visibility = "hidden";
                curtain.style.display = "none";
                curtain.classList.remove("launch-curtain-instant--closing");
                curtain.ownerDocument?.documentElement?.classList?.remove("launch-curtain-cursor-hidden");
            });
            this.modernFadeToBlackActive = false;
            this.clearInstantArtwork();
        }, modernFadeAlreadyCompleted ? 40 : (modernHide ? 520 : 760));
    }
    destroyInstantCurtain() {
        if (this.instantCurtainSafetyTimer !== undefined) {
            window.clearTimeout(this.instantCurtainSafetyTimer);
            this.instantCurtainSafetyTimer = undefined;
        }
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
            this.instantCurtainTimer = undefined;
        }
        if (this.instantCurtainHideTimer !== undefined) {
            window.clearTimeout(this.instantCurtainHideTimer);
            this.instantCurtainHideTimer = undefined;
        }
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        this.stopGamepadClosePolling();
        for (const [doc, curtain] of this.instantCurtainElementsByDocument.entries()) {
            try { this.instantCurtainObserversByDocument.get(doc)?.disconnect?.(); } catch (_error) {}
            try { doc.removeEventListener("keydown", this.handleKeyDown, true); } catch (_error) {}
            try { doc.removeEventListener("keyup", this.handleKeyClose, true); } catch (_error) {}
            try { doc.removeEventListener("pointerdown", this.handlePointerDown, true); } catch (_error) {}
            try { doc.removeEventListener("mousedown", this.handleMouseDown, true); } catch (_error) {}
            try { doc.removeEventListener("touchstart", this.handleTouchStart, true); } catch (_error) {}
            try { doc.removeEventListener("pointerover", this.handlePointerOver, true); } catch (_error) {}
            try { doc.removeEventListener("focusin", this.handleFocusIn, true); } catch (_error) {}
            try { doc.removeEventListener("click", this.handleClick, true); } catch (_error) {}
            try { doc.documentElement?.classList?.remove("launch-curtain-cursor-hidden"); } catch (_error) {}
            try { curtain?.remove?.(); } catch (_error) {}
        }
        this.instantCurtainObserversByDocument.clear();
        this.instantCurtainKeyDocuments.clear();
        this.instantCurtainElementsByDocument.clear();
        this.instantCurtainElement = undefined;
        this.instantCurtainVisible = false;
        this.modernFadeToBlackActive = false;
        this.promptSuspended = false;
        this.activeInstantAppId = undefined;
        this.prearmedInstantAppId = undefined;
        this.prearmLogoToken += 1;
        this.lastTriggerAt = 0;
    }
    updateInstantCurtainLogo(appId, logoSource, isShortcut = false, showLogo = true, preservePrearm = false) {
        this.activeInstantAppId = appId;
        if (!preservePrearm) {
            this.prearmedInstantAppId = undefined;
        }
        if (!showLogo) {
            this.logoPreviewToken += 1;
            this.setInstantCurtainLogo("", false);
            return;
        }
        const source = String(logoSource || "").trim();
        const fallbackSource = this.rawFallbackLogoSource();
        const immediate = this.browserImageUrl(source);
        this.setInstantCurtainLogo(immediate, true);
        if (!source) {
            this.logoPreviewToken += 1;
            return;
        }
        const token = ++this.logoPreviewToken;
        void this.resolveUiImageUrl(source, fallbackSource).then((url) => {
            if (token !== this.logoPreviewToken || this.activeInstantAppId !== appId || !this.currentInstantShowLogo) {
                return;
            }
            this.setInstantCurtainLogo(url || this.fallbackLogoUrl(), true);
        });
    }
    setInstantCurtainLogo(logoUrl, showLogo = true) {
        this.currentInstantLogoUrl = logoUrl || "";
        this.currentInstantShowLogo = showLogo !== false;
        const desiredUrl = this.currentInstantLogoUrl;
        const desiredVisible = this.currentInstantShowLogo;
        for (const curtain of this.instantCurtains()) {
            const slot = curtain.querySelector(".launch-curtain-instant__logo-slot");
            if (!slot) continue;
            if (
                slot.dataset.lcLogoUrl === desiredUrl
                && slot.dataset.lcLogoVisible === String(desiredVisible)
            ) {
                continue;
            }
            slot.innerHTML = desiredVisible ? this.logoMarkup(desiredUrl) : "";
            slot.dataset.lcLogoUrl = desiredUrl;
            slot.dataset.lcLogoVisible = String(desiredVisible);
            this.wireInstantLogoFallback(curtain);
        }
        this.applyInstantLogoPlacement(this.gameSettingsForApp(this.currentBackdropAppId));
        this.applyInstantLogoShadow(this.currentBackdropAppId);
        this.preloadLogo(desiredUrl);
    }
    refreshPreparedFallback() {
        if (this.instantCurtainVisible || this.prearmedInstantAppId) {
            return;
        }
        const fallback = this.fallbackLogoUrl();
        this.setInstantCurtainLogo(fallback);
        if (!this.fallbackLogoResolvedUrl && this.rawFallbackLogoSource()) {
            this.refreshFallbackLogoUrl();
        }
    }
    logoMarkup(logoUrl) {
        const fallbackLogoUrl = this.fallbackLogoUrl();
        const fallbackMarkup = fallbackLogoUrl
            ? `<img class="launch-curtain-instant__logo-image launch-curtain-instant__fallback-logo-image" src="${this.escapeHtml(fallbackLogoUrl)}" alt="Playhub" />`
            : "";
        return logoUrl
            ? `
        <img class="launch-curtain-instant__logo-image" src="${this.escapeHtml(logoUrl)}" alt="Logo" />
        <div class="launch-curtain-instant__fallback-logo">${fallbackMarkup}</div>
      `
            : "";
    }
    wireInstantLogoFallback(curtain) {
        const logoImage = curtain.querySelector(".launch-curtain-instant__logo-image");
        const fallbackLogo = curtain.querySelector(".launch-curtain-instant__fallback-logo");
        if (logoImage && fallbackLogo) {
            const src = logoImage.getAttribute("src") || "";
            const shouldShowFallbackWhileLoading = /^https?:\/\//i.test(src);
            if (shouldShowFallbackWhileLoading) {
                fallbackLogo.style.display = "block";
            }
            const fadeIn = (im) => { try { requestAnimationFrame(() => im.classList.add("launch-curtain-instant__logo-image--in")); } catch (e) { im.classList.add("launch-curtain-instant__logo-image--in"); } };
            logoImage.addEventListener("load", () => {
                fallbackLogo.style.display = "none";
                fadeIn(logoImage);
            }, { once: true });
            logoImage.addEventListener("error", () => {
                logoImage.remove();
                fallbackLogo.style.display = "block";
                const fb = fallbackLogo.querySelector(".launch-curtain-instant__logo-image");
                if (fb) fadeIn(fb);
            }, { once: true });
            if (logoImage.complete && logoImage.naturalWidth > 0) {
                fallbackLogo.style.display = "none";
                fadeIn(logoImage);
            }
            const fbImg = fallbackLogo.querySelector(".launch-curtain-instant__logo-image");
            if (fbImg) {
                if (fbImg.complete && fbImg.naturalWidth > 0) fadeIn(fbImg);
                else fbImg.addEventListener("load", () => fadeIn(fbImg), { once: true });
            }
        }
    }
    preloadLogo(logoUrl) {
        if (!logoUrl || !/^(?:https?:\/\/|file:\/\/|data:|blob:)/i.test(logoUrl)) {
            return;
        }
        const image = new Image();
        image.decoding = "async";
        image.src = logoUrl;
    }
    gamepadButtonPressed(indices) {
        const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
        return pads.some((pad) => {
            if (!pad) {
                return false;
            }
            return indices.some((index) => Boolean(pad.buttons[index]?.pressed));
        });
    }
    currentFocusedPlayButton() {
        for (const doc of this.getAllSteamDocuments()) {
            const active = doc.activeElement;
            if (this.isElementNode(active) && this.isPlayButtonEvent(active, [])) {
                return active;
            }
            if (this.isElementNode(active)) {
                let parent = active.parentElement;
                for (let depth = 0; parent && depth < 5; depth += 1) {
                    if (this.isPlayButtonEvent(parent, [])) {
                        return parent;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return undefined;
    }
    visibleSteamAttentionPrompt() {
        const selector = this.postPlayPromptSelector();
        for (const doc of this.getAllSteamDocuments()) {
            let prompts = [];
            try {
                prompts = Array.from(doc.querySelectorAll(selector));
            }
            catch (_error) {
                continue;
            }
            for (const prompt of prompts) {
                if (!this.isElementNode(prompt) || prompt.closest?.("[data-launch-curtain-surface='true']")) {
                    continue;
                }
                const rect = prompt.getBoundingClientRect();
                const style = doc.defaultView?.getComputedStyle?.(prompt);
                if (
                    rect.width < 260
                    || rect.height < 100
                    || style?.display === "none"
                    || style?.visibility === "hidden"
                    || Number(style?.opacity ?? "1") <= 0.01
                ) {
                    continue;
                }
                const actions = Array.from(prompt.querySelectorAll('button, [role="button"], [role="menuitem"], [role="option"], [data-focusable="true"]'))
                    .filter((item) => {
                        const actionRect = item.getBoundingClientRect();
                        const actionStyle = doc.defaultView?.getComputedStyle?.(item);
                        return actionRect.width > 24
                            && actionRect.height > 20
                            && actionStyle?.display !== "none"
                            && actionStyle?.visibility !== "hidden";
                    });
                if (actions.length <= 0 || actions.length > 10) {
                    continue;
                }
                const text = (prompt.innerText || prompt.textContent || "").replace(/\s+/g, " ").trim();
                const labels = actions.flatMap((item) => this.getLabels(item)).join(" ");
                if (POST_PLAY_CONFIRM_PATTERN.test(`${text} ${labels}`) || (text.length >= 10 && text.length <= 1800 && actions.length <= 4)) {
                    return { prompt, actions, doc };
                }
            }
        }
        return undefined;
    }
    currentFocusedPostPlayConfirm() {
        const attention = this.visibleSteamAttentionPrompt();
        if (!attention) {
            return undefined;
        }
        const active = attention.doc.activeElement;
        if (this.isElementNode(active) && attention.prompt.contains(active)) {
            return active;
        }
        return attention.actions.find((item) => item.matches?.(":focus, .gpfocus, [data-gpfocus]"))
            || attention.actions[0];
    }
    suspendInstantCurtainForPrompt() {
        if (!this.instantCurtainVisible || this.promptSuspended) {
            return;
        }
        this.promptSuspended = true;
        if (this.instantCurtainSafetyTimer !== undefined) {
            window.clearTimeout(this.instantCurtainSafetyTimer);
            this.instantCurtainSafetyTimer = undefined;
        }
        this.postPlayCoverUntil = Math.max(this.postPlayCoverUntil, Date.now() + POST_PLAY_PROMPT_HOLD_MS);
        this.instantCurtainVisible = false;
        this.stopGamepadClosePolling();
        this.stopModernHandoffPoll();
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
            this.instantCurtainTimer = undefined;
        }
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        for (const curtain of this.instantCurtains()) {
            curtain.classList.remove("launch-curtain-instant--art-visible");
            curtain.style.transition = "none";
            curtain.style.opacity = "0";
            curtain.style.visibility = "hidden";
            curtain.style.display = "none";
            curtain.ownerDocument?.documentElement?.classList?.remove("launch-curtain-cursor-hidden");
        }
        void hideBlackCover().catch(() => {});
        void setNativePromptVisible({ visible: true }).catch((error) => {
            console.warn("Launch Curtain could not release focus for the Steam prompt", error);
        });
        this.dbg("native Steam attention prompt revealed");
    }
    startPromptWatch() {
        if (this.promptWatchTimer !== undefined) {
            return;
        }
        const poll = () => {
            this.promptWatchTimer = undefined;
            if (!this.setupDone) {
                return;
            }
            const attention = this.visibleSteamAttentionPrompt();
            if (this.promptSuspended && attention) {
                this.postPlayCoverUntil = Date.now() + POST_PLAY_PROMPT_HOLD_MS;
            }
            if (Date.now() > this.postPlayCoverUntil && !this.promptSuspended) {
                return;
            }
            if (this.instantCurtainVisible && attention) {
                this.suspendInstantCurtainForPrompt();
            }
            else if (this.promptSuspended && !attention) {
                this.dbg("Steam attention prompt dismissed without a launch selection");
                this.requestCloseAllCurtains();
                return;
            }
            this.promptWatchTimer = window.setTimeout(poll, 120);
        };
        this.promptWatchTimer = window.setTimeout(poll, 120);
    }
    stopPromptWatch() {
        if (this.promptWatchTimer !== undefined) {
            window.clearTimeout(this.promptWatchTimer);
            this.promptWatchTimer = undefined;
        }
    }
    startGamepadLaunchPolling() {
        this.stopGamepadLaunchPolling();
        this.gamepadLaunchPressed = this.gamepadButtonPressed([0]);
        const initialPlayButton = this.gamepadLaunchPressed ? undefined : this.currentFocusedPlayButton();
        this.gamepadLaunchArmedButton = initialPlayButton;
        this.gamepadLaunchArmedAppId = initialPlayButton
            ? this.findAppIdForEvent(initialPlayButton, this.parentPath(initialPlayButton))
            : undefined;
        const poll = () => {
            if (!this.setupDone) {
                return;
            }
            const confirmPressed = this.gamepadButtonPressed([0]);
            const focusedPlayButton = this.currentFocusedPlayButton();
            const focusedPlayAppId = focusedPlayButton
                ? this.findAppIdForEvent(focusedPlayButton, this.parentPath(focusedPlayButton))
                : undefined;
            if (this.enabled && confirmPressed && !this.gamepadLaunchPressed && !this.instantCurtainVisible) {
                const wasPlayFocusedBeforePress = Boolean(
                    focusedPlayButton
                    && this.gamepadLaunchArmedButton
                    && (
                        (focusedPlayAppId && this.gamepadLaunchArmedAppId
                            ? focusedPlayAppId === this.gamepadLaunchArmedAppId
                            : focusedPlayButton === this.gamepadLaunchArmedButton)
                    )
                );
                if (focusedPlayButton && wasPlayFocusedBeforePress) {
                    this.handleLaunchInput("play button gamepad", focusedPlayButton, this.parentPath(focusedPlayButton));
                }
                else if (!focusedPlayButton) {
                    const confirmTarget = this.currentFocusedPostPlayConfirm() || document.activeElement;
                    const confirmPath = this.parentPath(confirmTarget);
                    if (!this.cancelPostPlayInteraction("post-play gamepad", confirmTarget, confirmPath)) {
                        this.coverPostPlayInteraction("post-play gamepad", confirmTarget, confirmPath);
                    }
                }
            }
            if (!confirmPressed) {
                this.gamepadLaunchArmedButton = focusedPlayButton;
                this.gamepadLaunchArmedAppId = focusedPlayAppId;
            }
            this.gamepadLaunchPressed = confirmPressed;
            this.gamepadLaunchTimer = window.setTimeout(poll, 50);
        };
        this.gamepadLaunchTimer = window.setTimeout(poll, 50);
    }
    stopGamepadLaunchPolling() {
        if (this.gamepadLaunchTimer !== undefined) {
            window.clearTimeout(this.gamepadLaunchTimer);
            this.gamepadLaunchTimer = undefined;
        }
        this.gamepadLaunchPressed = false;
        this.gamepadLaunchArmedButton = undefined;
        this.gamepadLaunchArmedAppId = undefined;
    }
    startGamepadClosePolling() {
        this.stopGamepadClosePolling();
        this.gamepadClosePressed = this.gamepadButtonPressed([1]);
        this.gamepadCloseIgnoreUntil = Date.now() + 650;
        this.gamepadCloseOverlayRunning = false;
        this.gamepadCloseStatusCheckedAt = 0;
        this.gamepadCloseIdleSince = 0;
        this.gamepadClosePending = false;
        const poll = () => {
            const now = Date.now();
            if (now - this.gamepadCloseStatusCheckedAt >= 350) {
                this.gamepadCloseStatusCheckedAt = now;
                void getStatus().then((status) => {
                    this.gamepadCloseOverlayRunning = Boolean(status?.curtain_running);
                    if (this.gamepadCloseOverlayRunning) this.gamepadCloseIdleSince = 0;
                }).catch(() => {});
            }
            const closeSurfaceActive = this.instantCurtainVisible || this.gamepadCloseOverlayRunning;
            if (!closeSurfaceActive) {
                if (!this.gamepadCloseIdleSince) this.gamepadCloseIdleSince = now;
                if (now >= this.gamepadCloseIgnoreUntil && now - this.gamepadCloseIdleSince >= 1800) {
                    this.stopGamepadClosePolling();
                    return;
                }
            }
            else {
                this.gamepadCloseIdleSince = 0;
            }
            const closePressed = this.gamepadButtonPressed([1]);
            if (closeSurfaceActive && closePressed && !this.gamepadClosePressed && now >= this.gamepadCloseIgnoreUntil) {
                this.gamepadClosePending = true;
            }
            if (this.gamepadClosePending && !closePressed && this.gamepadClosePressed) {
                this.gamepadClosePending = false;
                this.dismissInputSuppressionUntil = now + 900;
                this.requestCloseAllCurtains();
                return;
            }
            this.gamepadClosePressed = closePressed;
            this.gamepadCloseFrame = window.requestAnimationFrame(poll);
        };
        this.gamepadCloseFrame = window.requestAnimationFrame(poll);
    }
    stopGamepadClosePolling() {
        if (this.gamepadCloseFrame !== undefined) {
            window.cancelAnimationFrame(this.gamepadCloseFrame);
            this.gamepadCloseFrame = undefined;
        }
        this.gamepadClosePressed = false;
        this.gamepadCloseIgnoreUntil = 0;
        this.gamepadCloseOverlayRunning = false;
        this.gamepadCloseStatusCheckedAt = 0;
        this.gamepadCloseIdleSince = 0;
        this.gamepadClosePending = false;
    }
    requestCloseAllCurtains() {
        this.stopRuntimeSoundbite("curtain manually closed");
        this.dismissInputSuppressionUntil = Math.max(this.dismissInputSuppressionUntil, Date.now() + 900);
        this.postPlayCoverUntil = 0;
        this.postPlayCoverReadyAt = 0;
        this.stopPromptWatch();
        this.promptSuspended = false;
        void setNativePromptVisible({ visible: false }).catch(() => {});
        this.hideInstantCurtain(true);
        void hideBlackCover().catch((error) => {
            console.warn("Launch Curtain black pre-cover close failed", error);
        });
        void hideCurtain().catch((error) => {
            console.warn("Launch Curtain gamepad close failed", error);
        });
    }
    toFileUrl(path) {
        if (!path.trim()) {
            return "";
        }
        const normalized = path.replace(/\\/g, "/");
        const prefixed = normalized.startsWith("/") ? normalized : `/${normalized}`;
        return `file://${encodeURI(prefixed)}`;
    }
    escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
}
const playButtonHook = new PlayButtonLaunchHook();




// UI impostazioni + per-gioco + menu contestuale + rotte. Ricostruito dal dist.
const rowTextStyle = {
    fontSize: "12px",
    lineHeight: "16px",
    color: "var(--decky-text-color-secondary, #b8c0cc)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
};
function SoundbiteSpeakerIcon() {
    return SP_JSX.jsx("svg", { viewBox: "0 0 24 24", width: 16, height: 16, "aria-hidden": true, focusable: false, children: SP_JSX.jsx("path", { fill: "currentColor", d: "M3 9v6h4l5 4V5L7 9H3zm11.5-.5v7a4 4 0 0 0 0-7zm0-4v2.1a6 6 0 0 1 0 10.8v2.1a8 8 0 0 0 0-15z" }) });
}

function ApiKeyIcon() {
    return SP_JSX.jsx("svg", { viewBox: "0 0 24 24", width: 16, height: 16, "aria-hidden": true, focusable: false, children: SP_JSX.jsx("path", { fill: "currentColor", d: "M7 14a5 5 0 1 1 3.9 1.9L9 18H7v2H5v2H2v-3l5.1-5.1A5 5 0 0 1 7 14zm5-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" }) });
}

function ExternalLinkIcon() {
    return SP_JSX.jsx("svg", { viewBox: "0 0 24 24", width: 16, height: 16, "aria-hidden": true, focusable: false, children: SP_JSX.jsx("path", { fill: "currentColor", d: "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" }) });
}

function LaunchCurtainPageStyles() {
    return SP_JSX.jsx("style", { children: `
      .lc-settings-page { color: #fff; height: 100%; min-height: 0; }
      .lc-settings-page .lc-card { min-width: 0; box-sizing: border-box; padding: 14px 16px; margin: 0 0 12px; border-radius: 10px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.08); overflow: hidden; }
      .lc-settings-page .lc-card__header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; min-width: 0; }
      .lc-settings-page .lc-card__heading { flex: 1; min-width: 0; }
      .lc-settings-page .lc-card__title { font-size: 15px; font-weight: 700; }
      .lc-settings-page .lc-card__desc { margin-top: 4px; font-size: 12px; line-height: 1.4; opacity: .66; overflow-wrap: anywhere; }
      .lc-settings-page .lc-card__body { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; gap: 8px; }
      .lc-settings-page .lc-scraper-tabs { display: flex; gap: 8px; margin-bottom: 12px; min-width: 0; }
      .lc-settings-page .lc-scraper-tab { flex: 1 1 0; min-width: 0 !important; color: #fff !important; border: 1px solid rgba(255,255,255,.08) !important; background: rgba(255,255,255,.045) !important; }
      .lc-settings-page .lc-scraper-tab:hover,
      .lc-settings-page .lc-scraper-tab:focus,
      .lc-settings-page .lc-scraper-tab:focus-visible,
      .lc-settings-page .lc-scraper-tab:focus-within,
      .lc-settings-page .lc-scraper-tab.gpfocus,
      .lc-settings-page .lc-scraper-tab.focus,
      .lc-settings-page .lc-scraper-tab[data-focus-visible-added],
      .lc-settings-page .lc-scraper-tab--focused { color: #fff !important; opacity: 1 !important; background: rgba(255,255,255,.19) !important; border-color: rgba(255,255,255,.92) !important; outline: 3px solid rgba(255,255,255,.88) !important; outline-offset: -3px !important; box-shadow: 0 0 0 2px rgba(80,150,255,.7), inset 0 0 0 1px rgba(120,180,255,.5) !important; transform: translateY(-1px); }
      .lc-settings-page .lc-scraper-tab--active { color: #fff !important; background: rgba(255,255,255,.18) !important; border-color: rgba(255,255,255,.26) !important; }
      .lc-settings-page .lc-selected-game { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: center; width: 100%; min-width: 0; box-sizing: border-box; padding: 10px; border-radius: 8px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.09); overflow: hidden; }
      .lc-settings-page .lc-appearance-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; align-items: stretch; width: 100%; min-width: 0; margin-bottom: 12px; }
      .lc-settings-page .lc-appearance-grid > .lc-card { display: flex; flex-direction: column; height: 100%; margin: 0; }
      .lc-settings-page .lc-results-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; width: 100%; min-width: 0; }
      .lc-settings-page .lc-background-result,
      .lc-settings-page .lc-playstation-result { width: 100% !important; max-width: 100%; min-width: 0; box-sizing: border-box; overflow: hidden; }
      .lc-settings-page .lc-background-result > *,
      .lc-settings-page .lc-playstation-result > * { min-width: 0; }
      .lc-settings-page .lc-soundbite-result { display: grid; grid-template-columns: minmax(0,1fr) 42px 42px; gap: 10px; align-items: center; min-height: 56px; }
      .lc-settings-page .lc-soundbite-icon-button { width: 42px !important; min-width: 42px !important; height: 42px !important; min-height: 42px !important; padding: 0 !important; display: grid !important; place-items: center !important; border-radius: 6px !important; }
      .lc-settings-page .lc-soundbite-icon-button:focus,
      .lc-settings-page .lc-soundbite-icon-button:focus-visible,
      .lc-settings-page .lc-soundbite-icon-button.gpfocus { background: #f0b429 !important; color: #151515 !important; box-shadow: 0 0 0 3px rgba(255,255,255,.9) !important; }
      .lc-settings-page .lc-soundbite-icon-button:focus svg,
      .lc-settings-page .lc-soundbite-icon-button:focus-visible svg,
      .lc-settings-page .lc-soundbite-icon-button.gpfocus svg { color: #151515 !important; fill: currentColor !important; }
      .lc-settings-page .lc-mini-spinner { display: inline-block; width: 17px; height: 17px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: lcMiniSpin .8s linear infinite; }
      @keyframes lcMiniSpin { to { transform: rotate(360deg); } }
      .lc-settings-page .lc-close-button { width: 100%; margin: 8px 0 0; }
      .lc-editor-page .lc-card { margin: 0; }
      .lc-editor-page .lc-editor-layout { display: grid; grid-template-columns: minmax(0,1fr) 410px; gap: 16px; align-items: center; width: 100%; min-width: 0; }
      .lc-editor-page .lc-editor-preview { position: relative; width: 100%; min-width: 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 9px; background: #090909; border: 1px solid rgba(255,255,255,.14); box-sizing: border-box; }
      .lc-editor-page .lc-editor-screen { position: absolute; left: 21%; top: 21%; width: 58%; height: 58%; overflow: visible; background: #000; }
      .lc-editor-page .lc-editor-preview__backdrop { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; max-width: none !important; max-height: none !important; object-fit: fill; transform-origin: center center; z-index: 1; }
      .lc-editor-page .lc-editor-screen-clip { position: absolute; inset: 0; overflow: hidden; z-index: 2; pointer-events: none; }
      .lc-editor-page .lc-editor-preview__logo { position: absolute; width: 42%; max-height: 20%; object-fit: contain; transform-origin: center center; }
      .lc-editor-page .lc-editor-outside-mask { position: absolute; z-index: 3; background: rgba(0,0,0,.62); pointer-events: none; }
      .lc-editor-page .lc-editor-outside-mask--top { left: 0; top: 0; width: 100%; height: 21%; }
      .lc-editor-page .lc-editor-outside-mask--bottom { left: 0; bottom: 0; width: 100%; height: 21%; }
      .lc-editor-page .lc-editor-outside-mask--left { left: 0; top: 21%; width: 21%; height: 58%; }
      .lc-editor-page .lc-editor-outside-mask--right { right: 0; top: 21%; width: 21%; height: 58%; }
      .lc-editor-page .lc-editor-screen-frame { position: absolute; inset: 21%; z-index: 4; border: 2px solid rgba(255,255,255,.88); box-shadow: 0 0 0 1px rgba(0,0,0,.65), 0 0 16px rgba(0,0,0,.38); pointer-events: none; }
      .lc-editor-page .lc-editor-preview--screen-only .lc-editor-screen { left: 0; top: 0; width: 100%; height: 100%; overflow: hidden; }
      .lc-editor-page .lc-editor-preview--screen-only .lc-editor-outside-mask,
      .lc-editor-page .lc-editor-preview--screen-only .lc-editor-screen-frame { display: none; }
      .lc-editor-page .lc-editor-controls { width: 410px; max-width: 410px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
      .lc-editor-page .lc-editor-button-row { display: flex; gap: 8px; justify-content: stretch; min-width: 0; }
      .lc-editor-page .lc-editor-button-row > * { flex: 1 1 0; min-width: 0 !important; }
      .lc-editor-page .lc-editor-button-row--center > * { flex: 0 1 100%; }
      .lc-editor-page .lc-editor-target-label { margin: 5px 1px -1px; font-size: 11px; line-height: 15px; opacity: .62; }
      .lc-editor-page .lc-editor-target-active { border: 1px solid rgba(255,255,255,.95) !important; box-shadow: inset 0 0 0 1px rgba(255,255,255,.32) !important; }
      @media (max-width: 1180px) {
        .lc-editor-page .lc-editor-layout { grid-template-columns: 1fr; }
        .lc-editor-page .lc-editor-controls { width: 100%; max-width: none; }
      }
      @media (max-width: 1050px) {
        .lc-settings-page .lc-appearance-grid,
        .lc-settings-page .lc-results-grid { grid-template-columns: 1fr; }
      }
    ` });
}
function SettingsCard({ title, description, children, trailing, className = "" }) {
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: `lc-card${className ? ` ${className}` : ""}`, children: [
        title || description || trailing ? SP_JSX.jsxs("div", { className: "lc-card__header", children: [
                SP_JSX.jsxs("div", { className: "lc-card__heading", children: [
                        title ? SP_JSX.jsx("div", { className: "lc-card__title", children: title }) : null,
                        description ? SP_JSX.jsx("div", { className: "lc-card__desc", children: description }) : null
                    ] }),
                trailing || null
            ] }) : null,
        SP_JSX.jsx("div", { className: "lc-card__body", children: children })
    ] });
}
function QamSectionHeading({ icon, children }) {
    return SP_JSX.jsxs("div", { className: "lcQamSectionLabel", children: [icon, SP_JSX.jsx("span", { children })] });
}
function QamButton({ icon, children, ...props }) {
    const hasIcon = !!icon;
    return SP_JSX.jsx(DFL.DialogButton, { ...props, className: `lcQamButton${props.className ? ` ${props.className}` : ""}`, children: SP_JSX.jsxs("span", { className: `lcQamButtonInner${hasIcon ? "" : " lcQamButtonInner--noIcon"}`, children: [hasIcon ? icon : null, SP_JSX.jsx("span", { children })] }) });
}

const IISU_LOGO_DATA_URI = 'data:image/png;base64,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';
const STEAMGRIDDB_LOGO_DATA_URI = 'data:image/png;base64,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';

const openExternalUrl = (url) => {
    const target = String(url || "").trim();
    if (!target) return;
    try {
        const navigation = DFL.Navigation || globalThis.Navigation;
        if (navigation?.NavigateToExternalWeb) {
            navigation.NavigateToExternalWeb(target);
            return;
        }
        if (globalThis.SteamClient?.System?.OpenInSystemBrowser) {
            globalThis.SteamClient.System.OpenInSystemBrowser(target);
            return;
        }
        globalThis.open?.(target, "_blank", "noopener,noreferrer");
    }
    catch (error) {
        console.warn("Launch Curtain could not open external link", target, error);
    }
};
function QamSiteButton({ url, logoSrc, children, title, logoClassName = "" }) {
    const open = () => openExternalUrl(url);
    return SP_JSX.jsx(DFL.DialogButton, {
        focusable: true,
        title: title || String(children || ""),
        onClick: open,
        onOKButton: open,
        className: "lcQamSiteButton",
        children: SP_JSX.jsxs("span", { className: "lcQamSiteButtonInner", children: [
            logoSrc ? SP_JSX.jsx("img", { className: `lcQamSiteLogo${logoClassName ? ` ${logoClassName}` : ""}`, src: logoSrc, alt: "", "aria-hidden": true }) : null,
            SP_JSX.jsx("span", { className: "lcQamSiteButtonLabel", children })
        ] })
    });
}

function QamVolumeStepper({ label, value, min = 0, max = 100, step = 5, disabled = false, onChange }) {
    const numeric = Math.max(min, Math.min(max, Number(value) || 0));
    const update = (next) => {
        const bounded = Math.max(min, Math.min(max, next));
        if (!disabled && bounded !== numeric)
            void onChange(bounded);
    };
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", className: "lcQamStepper", children: [
        SP_JSX.jsx("div", { className: "lcQamStepperLabel", children: label }),
        SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", className: "lcQamStepperControls", children: [
            SP_JSX.jsx(DFL.DialogButton, { className: "lcQamStepperButton", title: `${label} -`, disabled: disabled || numeric <= min, onClick: () => update(numeric - step), children: SP_JSX.jsx(FaMinus, {}) }),
            SP_JSX.jsx("div", { className: "lcQamStepperValue", children: `${numeric}%` }),
            SP_JSX.jsx(DFL.DialogButton, { className: "lcQamStepperButton", title: `${label} +`, disabled: disabled || numeric >= max, onClick: () => update(numeric + step), children: SP_JSX.jsx(FaPlus, {}) })
        ] })
    ] });
}
function notify(result, strings) {
    toaster.toast({
        title: result.ok ? strings.toastTitle : strings.toastAttention,
        body: result.message
    });
}
function confirmDestructive(strings, title, description, onConfirm) {
    let modal = null;
    const close = () => modal?.Close?.();
    const run = () => { close(); void onConfirm(); };
    modal = DFL.showModal(
        SP_JSX.jsx(DFL.ConfirmModal, {
            strTitle: title,
            strDescription: description,
            strOKButtonText: strings.yes ?? "Yes",
            strCancelButtonText: strings.no ?? "No",
            bDestructiveWarning: true,
            onOK: run,
            onCancel: close,
            closeModal: close
        }),
        undefined,
        { strTitle: title }
    );
}

function Content() {
    const strings = getStrings();
    const [settings, setSettings] = SP_REACT.useState(undefined);
    const [, setStatus] = SP_REACT.useState(undefined);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [playStationBulkStatus, setPlayStationBulkStatus] = SP_REACT.useState(undefined);
    const [iidbBulkStatus, setIidbBulkStatus] = SP_REACT.useState(undefined);
    const [showGamesWithSoundbites, setShowGamesWithSoundbites] = SP_REACT.useState(false);
    const [showGamesWithoutSoundbites, setShowGamesWithoutSoundbites] = SP_REACT.useState(false);
    const [showSoundbiteExclusions, setShowSoundbiteExclusions] = SP_REACT.useState(false);
    const [steamGridApiKeyDraft, setSteamGridApiKeyDraft] = SP_REACT.useState("");
    const steamGridApiInputRef = SP_REACT.useRef(null);
    const iidbBulkStopRef = SP_REACT.useRef(false);
    const refresh = async () => {
        try {
            const nextStatus = await getStatus();
            setStatus(nextStatus);
        }
        catch (error) {
            console.warn("Launch Curtain could not refresh status", error);
        }
    };
    SP_REACT.useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const nextSettings = await getSettings();
                if (mounted) {
                    playButtonHook.setSettingsCache(nextSettings);
                    playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
                    playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
                    setSettings(nextSettings);
                    setSteamGridApiKeyDraft(String(nextSettings.steamgriddb_api_key || ""));
                }
            }
            catch (error) {
                console.warn("Launch Curtain could not load settings", error);
            }
            try {
                const nextStatus = await getStatus();
                if (mounted) {
                    setStatus(nextStatus);
                }
            }
            catch (error) {
                console.warn("Launch Curtain could not load status", error);
            }
        };
        load();
        const timer = window.setInterval(() => {
            refresh();
        }, 2000);
        return () => {
            mounted = false;
            window.clearInterval(timer);
        };
    }, []);
    const setAutoMode = async (checked) => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const result = checked ? await startAutoMode() : await stopAutoMode();
            notify(result, strings);
            const nextSettings = await getSettings();
            playButtonHook.setEnabled(Boolean(nextSettings.auto_mode));
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        catch (error) {
            console.warn("Launch Curtain could not change auto mode", error);
            toaster.toast({
                title: strings.toastAttention,
                body: "Could not change Launch Curtain settings."
            });
        }
        finally {
            setBusy(false);
        }
    };
    const setTimeoutValue = async (seconds) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({
            curtain_timeout: seconds,
            launch_curtain_max_seconds: seconds
        });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setExitDelayValue = async (seconds) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ game_settle_seconds: seconds });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setTimeoutEnabled = async (enabled) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ timeout_enabled: enabled });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setCurtainMode = async (mode) => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const nextSettings = await saveSettings({ curtain_mode: mode });
            playButtonHook.setEnabled(mode !== "off");
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        finally {
            setBusy(false);
        }
    };
    const setShowLaunchInfo = async (enabled) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ show_launch_info: enabled });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
    };
    const chooseLogo = async () => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const picked = await openFilePicker(FILE_SELECTION_FILE, settings.custom_logo_path || "C:\\", true, false, undefined, undefined, false, true);
            const logoPath = picked.realpath || picked.path;
            const nextSettings = await saveSettings({ custom_logo_path: logoPath });
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        catch (error) {
            console.warn("Launch Curtain logo picker failed", error);
            toaster.toast({
                title: strings.toastAttention,
                body: strings.logoPickerError
            });
        }
        finally {
            setBusy(false);
        }
    };
    const useDefaultLogo = async () => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const nextSettings = await saveSettings({ custom_logo_path: "" });
            playButtonHook.setLogoPath("");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        finally {
            setBusy(false);
        }
    };
    const timeoutOptions = Array.from({ length: 12 }, (_item, index) => (index + 1) * 5).map((seconds) => ({
        data: seconds,
        label: `${seconds} s`
    }));
    const selectedTimeout = timeoutOptions.some((option) => option.data === settings?.curtain_timeout)
        ? settings?.curtain_timeout
        : 50;
    const exitDelayOptions = Array.from({ length: 11 }, (_item, seconds) => ({
        data: seconds,
        label: `${seconds} s`
    }));
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === settings?.game_settle_seconds)
        ? settings?.game_settle_seconds
        : 3;
    const createGameCache = async () => {
        setBusy(true);
        try {
            const apps = collectSteamAppsForCache();
            const result = await buildGameCache({ apps });
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            toaster.toast({ title: strings.toastTitle, body: result.message || `Cached ${result.cached ?? apps.length} games.` });
        }
        catch (error) {
            console.warn("Launch Curtain cache build failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not create Launch Curtain cache." });
        }
        finally {
            setBusy(false);
        }
    };
    const cleanupLaunchImages = async () => {
        setBusy(true);
        try {
            const result = await cleanupUnusedLaunchImages();
            toaster.toast({
                title: result.ok ? strings.toastTitle : strings.toastAttention,
                body: result.message || `Removed ${result.removed ?? 0} unused launch image(s).`
            });
        }
        catch (error) {
            console.warn("Launch Curtain launch image cleanup failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not clean unused launch images." });
        }
        finally {
            setBusy(false);
        }
    };
    const cleanupUnusedSoundbiteFiles = async () => {
        setBusy(true);
        try {
            const result = await cleanupUnusedSoundbites();
            toaster.toast({
                title: result.ok ? strings.toastTitle : strings.toastAttention,
                body: result.message || `${strings.removedUnusedSoundbites ?? "Removed unused Soundbites"}: ${result.removed ?? 0}`
            });
        }
        catch (error) {
            console.warn("Launch Curtain unused Soundbite cleanup failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.cleanupUnusedSoundbitesFailed ?? "Could not remove unused Soundbites." });
        }
        finally {
            setBusy(false);
        }
    };
    const runPlayStationBulk = async (remove = false) => {
        const hasExistingCurtain = (game) => {
            if (remove)
                return false;
            const perGame = settings?.per_game?.[String(game.app_id)];
            return Boolean(String(perGame?.fullscreen_image_path ?? "").trim());
        };
        const games = collectSteamAppsForCache()
            .filter((game) => (
                !game.is_shortcut
                && game.title
                && !/^App \d+$/i.test(game.title)
                && (remove || game.is_installed)
                && !hasExistingCurtain(game)
            ))
            .sort((a, b) => String(a.title).localeCompare(String(b.title)));
        if (!games.length) {
            toaster.toast({
                title: strings.toastAttention,
                body: remove ? strings.playStationBulkError : strings.noInstalledGames
            });
            return;
        }
        setBusy(true);
        let applied = 0;
        let skipped = 0;
        let failed = 0;
        try {
            let nextIndex = 0;
            let completed = 0;
            const concurrency = remove ? 1 : 3;
            const worker = async () => {
                while (true) {
                    const index = nextIndex;
                    nextIndex += 1;
                    if (index >= games.length)
                        return;
                    const game = games[index];
                    setPlayStationBulkStatus({ title: game.title, current: completed, total: games.length, remove });
                    try {
                        const result = remove
                            ? await removePlayStationAsset({ app_id: game.app_id })
                            : await applyPlayStationAsset({ app_id: game.app_id, title: game.title });
                        if (result?.ok && (remove ? result.removed : true))
                            applied += 1;
                        else if (result?.skipped || (remove && result?.ok))
                            skipped += 1;
                        else
                            failed += 1;
                    }
                    catch (error) {
                        failed += 1;
                        console.warn("Launch Curtain PlayStation bulk item failed", game.title, error);
                    }
                    completed += 1;
                    setPlayStationBulkStatus({ title: game.title, current: completed, total: games.length, remove });
                }
            };
            await Promise.all(Array.from({ length: Math.min(concurrency, games.length) }, () => worker()));
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            toaster.toast({
                title: strings.toastTitle,
                body: `${remove ? strings.playStationBulkRemoved : strings.playStationBulkApplied}: ${applied}. ${strings.playStationBulkSkipped}: ${skipped}. ${strings.playStationBulkFailed}: ${failed}.`
            });
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation bulk failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.playStationBulkError });
        }
        finally {
            setPlayStationBulkStatus(undefined);
            setBusy(false);
        }
    };
    const saveSoundbiteMasterVolume = async (value) => {
        if (!settings)
            return;
        const nextSettings = await saveSettings({ soundbite_master_volume: Math.max(0, Math.min(100, Number(value) || 0)) });
        playButtonHook.setSettingsCache(nextSettings);
        setSettings(nextSettings);
    };
    const soundbiteLibraryGames = collectSteamAppsForCache()
        .filter((game) => game.title && !/^App \d+$/i.test(game.title))
        .sort((a, b) => String(a.title).localeCompare(String(b.title)));
    const installedBulkGames = soundbiteLibraryGames.filter((game) => game.is_installed || game.is_shortcut);
    const excludedSoundbiteIds = new Set((settings?.soundbite_auto_assign_excluded_app_ids || []).map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0));
    const gamesWithSoundbites = soundbiteLibraryGames.filter((game) => Boolean(String(settings?.per_game?.[String(game.app_id)]?.soundbite_path || "").trim()));
    const gamesWithoutSoundbites = soundbiteLibraryGames.filter((game) => !Boolean(String(settings?.per_game?.[String(game.app_id)]?.soundbite_path || "").trim()));
    const toggleSoundbiteExclusion = async (appId) => {
        if (!settings)
            return;
        const next = new Set(excludedSoundbiteIds);
        if (next.has(appId))
            next.delete(appId);
        else
            next.add(appId);
        const nextSettings = await saveSettings({ soundbite_auto_assign_excluded_app_ids: Array.from(next).sort((a, b) => a - b) });
        playButtonHook.setSettingsCache(nextSettings);
        setSettings(nextSettings);
    };
    const runIidbBulk = async (kind, remove = false) => {
        if (!settings)
            return;
        iidbBulkStopRef.current = false;
        let games = remove ? soundbiteLibraryGames : installedBulkGames;
        if (kind === "soundbite") {
            games = remove
                ? games.filter((game) => Boolean(settings?.per_game?.[String(game.app_id)]?.iidb_soundbite_managed))
                : games.filter((game) => !String(settings?.per_game?.[String(game.app_id)]?.soundbite_path || "").trim() && !excludedSoundbiteIds.has(game.app_id));
        }
        else {
            games = remove
                ? games.filter((game) => Boolean(settings?.per_game?.[String(game.app_id)]?.iidb_asset_managed))
                : games.filter((game) => !String(settings?.per_game?.[String(game.app_id)]?.fullscreen_image_path || "").trim());
        }
        if (!games.length) {
            toaster.toast({ title: strings.toastAttention, body: remove ? (kind === "soundbite" ? strings.noGamesWithSoundbites : strings.noImagesFound) : (strings.noInstalledGames ?? strings.noImagesFound) });
            return;
        }
        setBusy(true);
        let applied = 0;
        let skipped = 0;
        let failed = 0;
        try {
            let nextIndex = 0;
            let completed = 0;
            // Network downloads/searches are pipelined, but destructive removals
            // stay sequential so settings/file deletion remains deterministic.
            const concurrency = remove ? 1 : (kind === "soundbite" ? 3 : 2);
            const worker = async () => {
                while (true) {
                    if (iidbBulkStopRef.current)
                        return;
                    const index = nextIndex;
                    nextIndex += 1;
                    if (index >= games.length)
                        return;
                    const game = games[index];
                    setIidbBulkStatus({ kind, remove, title: game.title, current: completed, total: games.length, applied, skipped, failed });
                    try {
                        let result;
                        if (kind === "soundbite")
                            result = remove ? await removeIidbSoundbite({ app_id: game.app_id }) : await applyIidbSoundbite({ app_id: game.app_id, title: game.title });
                        else
                            result = remove ? await removeIidbAsset({ app_id: game.app_id }) : await applyIidbAsset({ app_id: game.app_id, title: game.title });
                        if (result?.ok && !result?.skipped)
                            applied += 1;
                        else if (result?.skipped)
                            skipped += 1;
                        else
                            failed += 1;
                    }
                    catch (error) {
                        failed += 1;
                        console.warn("Launch Curtain iiDB bulk item failed", kind, game.title, error);
                    }
                    completed += 1;
                    setIidbBulkStatus({ kind, remove, title: game.title, current: completed, total: games.length, applied, skipped, failed });
                }
            };
            await Promise.all(Array.from({ length: Math.min(concurrency, games.length) }, () => worker()));
            const stopped = iidbBulkStopRef.current;
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            toaster.toast({
                title: strings.toastTitle,
                body: `${stopped ? `${strings.bulkStopped}. ` : ""}${strings.bulkApplied}: ${applied}. ${strings.bulkSkipped}: ${skipped}. ${strings.bulkFailed}: ${failed}.`
            });
        }
        catch (error) {
            console.warn("Launch Curtain iiDB bulk failed", error);
            toaster.toast({ title: strings.toastAttention, body: "iiDB bulk operation failed." });
        }
        finally {
            setIidbBulkStatus(undefined);
            setBusy(false);
            iidbBulkStopRef.current = false;
        }
    };
    const stopIidbBulk = () => {
        iidbBulkStopRef.current = true;
    };
    const renderQamGameList = (games, emptyText, exclusionMode = false) => SP_JSX.jsx("div", { className: "lcQamGameList", children: games.length ? games.map((game) => SP_JSX.jsxs("div", { className: "lcQamGameRow", children: [
        SP_JSX.jsx("span", { title: game.title, children: game.title }),
        exclusionMode ? SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy, onClick: () => { void toggleSoundbiteExclusion(game.app_id); }, children: excludedSoundbiteIds.has(game.app_id) ? strings.excluded : strings.included }) : null
    ] }, game.app_id)) : SP_JSX.jsx("div", { className: "lcQamHelp", children: emptyText }) });

    const focusSteamGridApiInput = () => focusTextInputWithSteamKeyboard(steamGridApiInputRef.current);
    const saveSteamGridApiKey = async () => {
        if (!settings)
            return;
        setBusy(true);
        try {
            const nextSettings = await saveSettings({ steamgriddb_api_key: String(steamGridApiKeyDraft || "").trim() });
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            setSteamGridApiKeyDraft(String(nextSettings.steamgriddb_api_key || ""));
            toaster.toast({ title: strings.toastTitle, body: String(nextSettings.steamgriddb_api_key || "").trim() ? (strings.steamGridApiSaved ?? "SteamGridDB API key saved.") : (strings.steamGridApiCleared ?? "SteamGridDB API key cleared.") });
        }
        catch (error) {
            console.warn("Launch Curtain SteamGridDB API key save failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.steamGridApiSaveFailed ?? "Could not save the SteamGridDB API key." });
        }
        finally {
            setBusy(false);
        }
    };
    const createSettingsBackup = async () => {
        if (!settings)
            return;
        try {
            const picked = await openFilePicker(FILE_SELECTION_FOLDER, "C:\\", false, true, undefined, undefined, false, true);
            const folder = picked.realpath || picked.path || "";
            if (!folder)
                return;
            setBusy(true);
            const result = await createBackup({ folder });
            if (result?.ok) {
                const suffix = Number(result.missing_external_files || 0) > 0 ? ` ${strings.backupMissingFiles ?? "Some external files could not be included."}` : "";
                toaster.toast({ title: strings.toastTitle, body: `${strings.backupCreated ?? "Backup created."} ${result.path || folder}.${suffix}` });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: result?.message || strings.backupFailed || "Could not create the backup." });
            }
        }
        catch (error) {
            if (!String(error || "").toLowerCase().includes("cancel")) {
                console.warn("Launch Curtain backup picker failed", error);
                toaster.toast({ title: strings.toastAttention, body: strings.backupFailed ?? "Could not create the backup." });
            }
        }
        finally {
            setBusy(false);
        }
    };
    const restoreSettingsBackup = async (folder) => {
        setBusy(true);
        try {
            const result = await restoreBackup({ folder });
            if (!result?.ok) {
                toaster.toast({ title: strings.toastAttention, body: result?.message || strings.restoreBackupFailed || "Could not restore the backup." });
                return;
            }
            const nextSettings = await getSettings();
            playButtonHook.setEnabled(Boolean(nextSettings.auto_mode));
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            setSteamGridApiKeyDraft(String(nextSettings.steamgriddb_api_key || ""));
            await refresh();
            toaster.toast({ title: strings.toastTitle, body: strings.backupRestored ?? "Backup restored successfully." });
        }
        catch (error) {
            console.warn("Launch Curtain backup restore failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.restoreBackupFailed ?? "Could not restore the backup." });
        }
        finally {
            setBusy(false);
        }
    };
    const chooseBackupToRestore = async () => {
        try {
            const picked = await openFilePicker(FILE_SELECTION_FOLDER, "C:\\", false, true, undefined, undefined, false, true);
            const folder = picked.realpath || picked.path || "";
            if (!folder)
                return;
            confirmDestructive(
                strings,
                strings.restoreBackup ?? "Restore backup",
                `${strings.confirmRestoreBackup ?? "Restore this backup? Current Launch Curtain settings and managed files will be replaced."}\n${folder}`,
                () => restoreSettingsBackup(folder)
            );
        }
        catch (error) {
            if (!String(error || "").toLowerCase().includes("cancel")) {
                console.warn("Launch Curtain restore picker failed", error);
                toaster.toast({ title: strings.toastAttention, body: strings.restoreBackupFailed ?? "Could not restore the backup." });
            }
        }
    };

    const curtainModeOptions = [
        { data: "modern", label: strings.modeModern ?? I18N.en.modeModern ?? "Modern (in Steam UI)" },
        { data: "classic", label: strings.modeClassic ?? I18N.en.modeClassic ?? "Classic (overlay window)" },
        { data: "off", label: strings.modeOff ?? I18N.en.modeOff ?? "Off" }
    ];
    const selectedCurtainMode = settings?.curtain_mode ?? "modern";
    return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamRedesign", children: [
        SP_JSX.jsx("style", { children: `
          .lcQamRedesign,.lcQamRedesign *{box-sizing:border-box;min-width:0;letter-spacing:0}
          .lcQamRedesign{width:100%;padding:2px 12px 26px 4px;overflow-x:hidden;color:#fff}
          .lcQamSectionLabel{display:flex;align-items:center;gap:8px;margin:14px 4px 7px;font-size:12px;font-weight:800;text-transform:uppercase;opacity:.56}
          .lcQamSectionLabel svg{width:13px;height:13px;flex:none}
          .lcQamCard{width:100%;margin:0 0 9px;padding:12px;border:1px solid rgba(255,255,255,.085);border-radius:6px;background:rgba(255,255,255,.035);overflow:hidden}
          .lcQamCard [class*="PanelSectionRow"]{width:100%!important;max-width:100%!important;padding-left:0!important;padding-right:0!important;border-top:none!important;border-bottom:none!important;box-shadow:none!important}
          .lcQamRedesign hr,.lcQamRedesign [class*="Divider"],.lcQamRedesign [class*="Separator"]{display:none!important;border:0!important;background:none!important}
          .lcQamRedesign [class*="PanelSection"]:before,.lcQamRedesign [class*="PanelSection"]:after{display:none!important}
          .lcQamAutomationCard>*{border-top:0!important;border-bottom:0!important;box-shadow:none!important;background-image:none!important}
          .lcQamAutomationCard>*:before,.lcQamAutomationCard>*:after{border:0!important;box-shadow:none!important;background:none!important}
          .lcQamAutomationCard [class*="PanelSectionRow"],.lcQamAutomationCard [class*="ToggleField"],.lcQamAutomationCard [class*="DropdownItem"]{border-top:0!important;border-bottom:0!important;box-shadow:none!important;background-image:none!important}
          .lcQamCard [class*="Dropdown"]{max-width:100%!important}
          .lcQamDropdownBlock{display:flex;flex-direction:column;gap:7px;width:100%;padding:8px 0 10px}
          .lcQamDropdownLabel{font-size:14px;line-height:18px;color:#fff}
          .lcQamDropdownControl,.lcQamDropdownControl>div,.lcQamDropdownControl [role="combobox"]{width:100%!important;max-width:100%!important}
          .lcQamHelp{margin:3px 2px 8px;font-size:12px;line-height:1.35;opacity:.57;overflow-wrap:anywhere}
          .lcQamMeta{margin:0 2px 10px;font-size:12px;line-height:1.35;opacity:.58;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .lcQamButton{width:100%!important;min-height:38px!important;padding:0 10px!important;border-radius:5px!important;color:#fff!important;font-size:14px!important}
          .lcQamButtonInner{display:grid;grid-template-columns:18px minmax(0,1fr);align-items:center;gap:9px;width:100%;text-align:left}.lcQamButtonInner--noIcon{grid-template-columns:minmax(0,1fr)!important}
          .lcQamButtonInner svg{width:15px;height:15px;justify-self:center}
          .lcQamButton:hover,.lcQamButton:focus,.lcQamButton.gpfocus{background:rgba(240,180,41,.16)!important;color:#fff!important;border-color:rgba(240,180,41,.92)!important;box-shadow:0 0 0 2px rgba(240,180,41,.22)!important}
          .lcQamButton:hover *,.lcQamButton:focus *,.lcQamButton.gpfocus *{color:inherit!important}
          .lcQamButton:disabled{opacity:.35!important}
          .lcQamButtonStack{display:grid;gap:7px}
          .lcQamStepper{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;width:100%;margin-bottom:7px}
          .lcQamStepperLabel{font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .lcQamStepperControls{display:grid;grid-template-columns:38px 58px 38px;align-items:center;gap:6px}
          .lcQamStepperButton{width:38px!important;min-width:38px!important;height:36px!important;min-height:36px!important;padding:0!important;display:grid!important;place-items:center!important}
          .lcQamStepperButton svg{width:13px;height:13px}
          .lcQamStepperValue{text-align:center;font-size:14px;font-weight:700;font-variant-numeric:tabular-nums}
          .lcQamStatus{padding:9px 10px;margin-bottom:8px;border-radius:5px;background:rgba(240,180,41,.09);font-size:12px;line-height:1.35}
          .lcQamProgress{height:5px;margin-top:7px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.09)}
          .lcQamProgress>div{height:100%;background:rgba(255,255,255,.82);transition:width .15s ease}
          .lcQamGameList{display:flex;flex-direction:column;gap:5px;margin-top:7px;max-height:280px;overflow:auto}
          .lcQamGameRow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 8px;border-radius:5px;background:rgba(255,255,255,.04);font-size:12px}
          .lcQamGameRow>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .lcQamGameRow button{min-width:82px!important;height:30px!important;min-height:30px!important;font-size:11px!important}
          .lcQamCredits{margin:15px 5px 2px;font-size:11px;line-height:1.45;opacity:.62;text-align:center;overflow-wrap:anywhere}
          .lcQamSiteButton{width:100%!important;min-height:38px!important;margin:3px 0 8px!important;padding:0 10px!important;border-radius:5px!important;color:#fff!important}.lcQamSiteButtonInner{display:flex;align-items:center;gap:10px;width:100%;text-align:left;font-size:14px}.lcQamSiteButtonLabel{display:block;min-width:0}.lcQamSiteLogo{display:block;flex:0 0 22px;object-fit:contain;object-position:center center;width:22px;height:auto;max-width:22px;max-height:22px}.lcQamSiteLogo--iisu,.lcQamSiteLogo--sgdb{width:22px;max-width:22px;height:auto;max-height:22px}.lcQamSiteButton:hover,.lcQamSiteButton:focus,.lcQamSiteButton.gpfocus{background:rgba(240,180,41,.16)!important;color:#fff!important;border-color:rgba(240,180,41,.92)!important;outline:2px solid rgba(255,255,255,.88)!important;outline-offset:-2px!important}
        ` }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaRocket, {}), children: strings.automation }),
        SP_JSX.jsxs("section", { className: "lcQamCard lcQamAutomationCard", children: [
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamDropdownBlock", children: [
                SP_JSX.jsx("div", { className: "lcQamDropdownLabel", children: strings.launchMode ?? I18N.en.launchMode ?? "Launch mode" }),
                SP_JSX.jsx("div", { className: "lcQamDropdownControl", children: SP_JSX.jsx(DFL.Dropdown, { menuLabel: strings.launchMode ?? I18N.en.launchMode ?? "Launch mode", rgOptions: curtainModeOptions, selectedOption: selectedCurtainMode, disabled: busy || !settings, onChange: (option) => { if (typeof option.data === "string") void setCurtainMode(option.data); } }) })
            ] }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.launchInfo ?? I18N.en.launchInfo ?? "Launch info", bottomSeparator: "none", checked: Boolean(settings?.show_launch_info), disabled: busy || !settings, onChange: (checked) => { void setShowLaunchInfo(checked); } }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.timeoutEnabled ?? I18N.en.timeoutEnabled ?? "Enable timeout", bottomSeparator: "none", checked: settings?.timeout_enabled ?? false, disabled: busy || !settings, onChange: (checked) => { void setTimeoutEnabled(checked); } }),
            SP_JSX.jsx("div", { className: "lcQamHelp", children: (settings?.timeout_enabled ?? false) ? (strings.timeoutHelp ?? I18N.en.timeoutHelp ?? "How long the launch screen can stay visible while waiting for the game to become fullscreen.") : (strings.timeoutDisabledHelp ?? I18N.en.timeoutDisabledHelp ?? "When disabled, the launch screen hides only after fullscreen detection or manual close.") }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.timeout, bottomSeparator: "none", rgOptions: timeoutOptions, selectedOption: selectedTimeout, disabled: busy || !settings || !(settings.timeout_enabled ?? false), onChange: (option) => { if (typeof option.data === "number") void setTimeoutValue(option.data); } }),
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.exitDelayHelp ?? I18N.en.exitDelayHelp ?? "How long Launch Curtain stays visible after detecting that the game is ready." }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay ?? I18N.en.exitDelay ?? "Exit delay", bottomSeparator: "none", rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !settings, onChange: (option) => { if (typeof option.data === "number") void setExitDelayValue(option.data); } }),
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaImage, {}), children: strings.playStationAssets ?? I18N.en.playStationAssets ?? "PlayStation Assets" }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.playStationAssetProtectionHelp ?? I18N.en.playStationAssetProtectionHelp ?? "PlayStation Assets are applied only to installed games without an existing curtain. iiDB and manual/local assets are never replaced." }),
            playStationBulkStatus ? SP_JSX.jsxs("div", { className: "lcQamStatus", children: [`${playStationBulkStatus.remove ? strings.removingPlayStationAssets : strings.downloadingPlayStationAssets} (${playStationBulkStatus.current}/${playStationBulkStatus.total})`, SP_JSX.jsx("div", { style: { marginTop: 3, fontWeight: 700 }, children: playStationBulkStatus.title })] }) : null,
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaDownload, {}), disabled: busy || !settings, onClick: () => { void runPlayStationBulk(false); }, children: strings.downloadPlayStationAssetsInstalled }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => confirmDestructive(strings, strings.removePlayStationAssets, strings.confirmRemovePlayStationAssets, () => runPlayStationBulk(true)), children: strings.removePlayStationAssets })
            ] })
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaImage, {}), children: strings.iidbAssets }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.iidbAssetProtectionHelp }),
            iidbBulkStatus?.kind === "asset" ? SP_JSX.jsxs("div", { className: "lcQamStatus", children: [
                `${iidbBulkStatus.remove ? strings.removingIidbAssets : strings.downloadingIidbAssets} (${iidbBulkStatus.current}/${iidbBulkStatus.total})`,
                SP_JSX.jsx("div", { style: { marginTop: 3, fontWeight: 700 }, children: iidbBulkStatus.title }),
                SP_JSX.jsx("div", { className: "lcQamProgress", children: SP_JSX.jsx("div", { style: { width: `${Math.round((iidbBulkStatus.current / Math.max(1, iidbBulkStatus.total)) * 100)}%` } }) })
            ] }) : null,
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaDownload, {}), disabled: busy || !settings, onClick: () => { void runIidbBulk("asset", false); }, children: strings.downloadIidbAssets }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => confirmDestructive(strings, strings.removeIidbAssets, strings.confirmRemoveIidbAssets, () => runIidbBulk("asset", true)), children: strings.removeIidbAssets }),
                iidbBulkStatus?.kind === "asset" ? SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaUndo, {}), onClick: stopIidbBulk, children: strings.bulkStop }) : null
            ] })
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(SoundbiteSpeakerIcon, {}), children: strings.iidbSoundbites ?? I18N.en.iidbSoundbites ?? "iiDB Soundbites" }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx(QamVolumeStepper, { label: strings.soundbiteMasterVolume, value: Number(settings?.soundbite_master_volume ?? 100), min: 0, max: 100, step: 5, disabled: busy || !settings, onChange: saveSoundbiteMasterVolume }),
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.soundbiteMasterVolumeHelp }),
            iidbBulkStatus?.kind === "soundbite" ? SP_JSX.jsxs("div", { className: "lcQamStatus", children: [
                `${iidbBulkStatus.remove ? strings.removingSoundbites : strings.downloadingSoundbites} (${iidbBulkStatus.current}/${iidbBulkStatus.total})`,
                SP_JSX.jsx("div", { style: { marginTop: 3, fontWeight: 700 }, children: iidbBulkStatus.title }),
                SP_JSX.jsx("div", { className: "lcQamProgress", children: SP_JSX.jsx("div", { style: { width: `${Math.round((iidbBulkStatus.current / Math.max(1, iidbBulkStatus.total)) * 100)}%` } }) })
            ] }) : null,
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaDownload, {}), disabled: busy || !settings, onClick: () => { void runIidbBulk("soundbite", false); }, children: strings.bulkSoundbites }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => confirmDestructive(strings, strings.removeIidbSoundbites, strings.confirmRemoveIidbSoundbites, () => runIidbBulk("soundbite", true)), children: strings.removeIidbSoundbites }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => confirmDestructive(strings, strings.deleteUnusedSoundbites, strings.confirmDeleteUnusedSoundbites, cleanupUnusedSoundbiteFiles), children: strings.deleteUnusedSoundbites }),
                iidbBulkStatus?.kind === "soundbite" ? SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaUndo, {}), onClick: stopIidbBulk, children: strings.bulkStop }) : null,
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTools, {}), disabled: busy || !settings, onClick: () => setShowGamesWithoutSoundbites((value) => !value), children: showGamesWithoutSoundbites ? strings.hideGamesWithoutSoundbites : strings.showGamesWithoutSoundbites }),
                showGamesWithoutSoundbites ? renderQamGameList(gamesWithoutSoundbites, strings.noGamesWithoutSoundbites) : null,
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTools, {}), disabled: busy || !settings, onClick: () => setShowGamesWithSoundbites((value) => !value), children: showGamesWithSoundbites ? strings.hideGamesWithSoundbites : strings.showGamesWithSoundbites }),
                showGamesWithSoundbites ? renderQamGameList(gamesWithSoundbites, strings.noGamesWithSoundbites) : null,
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTools, {}), disabled: busy || !settings, onClick: () => setShowSoundbiteExclusions((value) => !value), children: strings.manageSoundbiteExclusions }),
                showSoundbiteExclusions ? SP_JSX.jsxs(SP_REACT.Fragment, { children: [SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.soundbiteExclusionHelp }), renderQamGameList(soundbiteLibraryGames, strings.noInstalledGames, true)] }) : null
            ] })
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(ApiKeyIcon, {}), children: "SteamGridDB" }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.steamGridApiHelp ?? "SteamGridDB Hero search uses your personal API key. Launch Curtain does not bundle an API key." }),
            SP_JSX.jsx(SearchQuerySteamField, { label: strings.steamGridApiKey ?? "SteamGridDB API key", value: steamGridApiKeyDraft, disabled: busy || !settings, placeholder: strings.steamGridApiPlaceholder ?? "Paste your personal API key", inputRef: steamGridApiInputRef, onChange: setSteamGridApiKeyDraft, onBlur: () => {}, openKeyboard: focusSteamGridApiInput, password: true }),
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(ExternalLinkIcon, {}), onClick: () => openExternalUrl("https://www.steamgriddb.com/profile/preferences/api"), children: strings.steamGridApiPage ?? "Open SteamGridDB API page" }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(ApiKeyIcon, {}), disabled: busy || !settings, onClick: () => { void saveSteamGridApiKey(); }, children: strings.saveSteamGridApiKey ?? "Save SteamGridDB API key" })
            ] })
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaImage, {}), children: strings.logo }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx("div", { className: "lcQamMeta", title: settings?.custom_logo_path || "", children: settings?.custom_logo_path ? `${strings.customLogo}: ${settings.custom_logo_path}` : strings.defaultLogo }),
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaFolderOpen, {}), disabled: busy || !settings, onClick: () => { void chooseLogo(); }, children: strings.chooseLogo }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaUndo, {}), disabled: busy || !settings || !settings.custom_logo_path, onClick: () => { void useDefaultLogo(); }, children: strings.useDefaultLogo })
            ] })
        ] }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaTools, {}), children: strings.maintenance }),
        SP_JSX.jsx("section", { className: "lcQamCard", children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
            SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTools, {}), disabled: busy || !settings, onClick: () => { void createGameCache(); }, children: strings.refreshGameCache }),
            SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => confirmDestructive(strings, strings.deleteUnusedImages, strings.confirmDeleteUnusedImages, cleanupLaunchImages), children: strings.deleteUnusedImages })
        ] }) }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaFolderOpen, {}), children: strings.backup ?? "Backup" }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.backupHelp ?? "Create or restore a complete backup of Launch Curtain settings, curtains, Soundbites and referenced local files." }),
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaDownload, {}), disabled: busy || !settings, onClick: () => { void createSettingsBackup(); }, children: strings.createBackup ?? "Create backup" }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaUndo, {}), disabled: busy || !settings, onClick: () => { void chooseBackupToRestore(); }, children: strings.restoreBackup ?? "Restore backup" })
            ] })
        ] }),
        SP_JSX.jsxs("div", { className: "lcQamCredits", children: [
            SP_JSX.jsx("div", { children: strings.iisuCredits ?? "Special thanks to the iiSU team and community for creating iiDB and for the incredible work behind its growing collection of game artwork and soundbites. Their passion for presentation, preservation, and beautifully curated game assets has made Launch Curtain’s iiDB integration possible. Huge thanks for building such a valuable resource for the gaming community and for making these assets accessible to projects like this one." }),
            SP_JSX.jsx(QamSiteButton, { url: "https://iisu.network/", logoSrc: IISU_LOGO_DATA_URI, logoClassName: "lcQamSiteLogo--iisu", title: "iiSU", children: "iiSU" }),
            SP_JSX.jsx("div", { style: { marginTop: 10 }, children: strings.steamGridCredits ?? "SteamGridDB Hero artwork is provided through the SteamGridDB API and remains third-party content." }),
            SP_JSX.jsx(QamSiteButton, { url: "https://www.steamgriddb.com/", logoSrc: STEAMGRIDDB_LOGO_DATA_URI, logoClassName: "lcQamSiteLogo--sgdb", title: "SteamGridDB", children: "SteamGridDB" })
        ] })
    ] }) });
}

const getAppOverviewSafe = (appId) => {
    try {
        return globalThis.appStore?.GetAppOverviewByAppID?.(appId) ?? globalThis.window?.appStore?.GetAppOverviewByAppID?.(appId) ?? null;
    }
    catch (_error) {
        return null;
    }
};
const appNameForId = (appId) => {
    const overview = getAppOverviewSafe(appId);
    return overview?.display_name || overview?.localized_name || overview?.name || `App ${appId}`;
};
const collectSteamAppsForCache = () => {
    const byId = new Map();
    const add = (entry) => {
        const appId = Number(entry?.appid ?? entry?.app_id ?? entry?.unAppID ?? entry?.nAppID ?? entry);
        if (!Number.isFinite(appId) || appId <= 0)
            return;
        const overview = getAppOverviewSafe(appId) || entry;
        let isInstalled = false;
        try {
            isInstalled = overview?.BIsInstalled?.() === true;
        }
        catch (_error) {}
        isInstalled = isInstalled
            || overview?.local_per_client_data?.installed === true
            || entry?.local_per_client_data?.installed === true
            || overview?.installed === true
            || entry?.installed === true
            || Number(overview?.size_on_disk ?? entry?.size_on_disk ?? 0) > 0;
        byId.set(appId, {
            app_id: appId,
            title: overview?.display_name || overview?.localized_name || overview?.name || entry?.title || `App ${appId}`,
            is_shortcut: Boolean(overview?.BIsShortcut?.() || overview?.BIsModOrShortcut?.() || Number(overview?.app_type) === 1073741824 || appId >= 2147483648),
            is_installed: isInstalled
        });
    };
    try {
        globalThis.appStore?.allApps?.forEach?.(add);
        globalThis.appStore?.m_mapAppOverview?.forEach?.(add);
        globalThis.window?.appStore?.allApps?.forEach?.(add);
        globalThis.window?.appStore?.m_mapAppOverview?.forEach?.(add);
    }
    catch (_error) {
        // Steam changes these internals often; cache creation remains best effort.
    }
    return Array.from(byId.values());
};
const currentRouteAppId = () => {
    const paths = [
        globalThis.Router?.WindowStore?.GamepadUIMainWindowInstance?.m_history?.location?.pathname,
        globalThis.Router?.WindowStore?.GamepadUIMainWindowInstance?.m_history?.location?.hash,
        globalThis.window?.location?.pathname,
        globalThis.window?.location?.hash
    ];
    for (const path of paths) {
        const match = String(path || "").match(/launch-curtain\/(\d+)/i);
        if (match) {
            const appId = Number(match[1]);
            if (Number.isFinite(appId) && appId > 0)
                return appId;
        }
    }
    return 0;
};
const appIdFromRouteParams = (params) => {
    const appId = Number(params?.appid ?? params?.appId);
    return Number.isFinite(appId) && appId > 0 ? appId : 0;
};
const getLaunchCurtainRouteAppId = (pathname) => {
    const path = pathname || globalThis.window?.location?.pathname || "";
    const match = String(path || "").match(/\/launch-curtain\/(\d+)/);
    if (!match)
        return 0;
    return normalizeMenuAppId(match[1]);
};
const pageStyle = { padding: 24, paddingTop: 86, paddingBottom: 196, minHeight: "100%", width: "100%", minWidth: 0, boxSizing: "border-box", scrollPaddingTop: 86, scrollPaddingBottom: 196 };
const editorPageStyle = { ...pageStyle, minHeight: "calc(100vh - 282px)", display: "flex", flexDirection: "column", justifyContent: "center" };
const wallpaperResultsStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
};
const wallpaperResultRowStyle = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    borderRadius: "0.4rem",
    padding: "0.6rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid transparent",
    display: "grid",
    gridTemplateColumns: "minmax(14.3rem, 36%) minmax(0, 1fr) minmax(7.25rem, auto)",
    gap: "0.6rem",
    alignItems: "center"
};
const wallpaperPreviewStyle = {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "0.35rem",
    background: "rgba(0,0,0,0.25)"
};
const playStationCoverStyle = {
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    borderRadius: "0.35rem",
    background: "rgba(0,0,0,0.25)"
};
const toFileUrlForUi = (path) => {
    if (!path?.trim?.())
        return "";
    const normalized = path.replace(/\\/g, "/");
    const prefixed = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `file://${encodeURI(prefixed)}`;
};
const focusTextInputWithSteamKeyboard = (element) => {
    if (!element)
        return;
    try {
        element.focus?.();
        element.select?.();
    }
    catch (_error) {
        // Best effort only.
    }
    try {
        const input = globalThis.SteamClient?.Input;
        const rect = element.getBoundingClientRect?.();
        if (input?.ShowFloatingGamepadTextInput && rect) {
            input.ShowFloatingGamepadTextInput(0, rect.left, rect.top, rect.width, rect.height);
            return;
        }
        if (input?.ShowGamepadTextInput) {
            input.ShowGamepadTextInput(0, 0, "", String(element.value || ""), 256);
            return;
        }
        globalThis.SteamClient?.System?.ShowVirtualKeyboard?.();
    }
    catch (error) {
        console.warn("Launch Curtain could not open Steam keyboard", error);
    }
};
const nativeTextFieldComponent = () => DFL.TextField || DFL.TextInput || DFL.TextEntry || DFL.TextBox || null;
const textValueFromChange = (eventOrValue) => {
    if (typeof eventOrValue === "string")
        return eventOrValue;
    return String(eventOrValue?.target?.value ?? eventOrValue?.currentTarget?.value ?? eventOrValue?.value ?? "");
};
function SearchQuerySteamField({ label, value, disabled, placeholder, inputRef, onChange, onBlur, openKeyboard, password = false }) {
    const NativeTextField = nativeTextFieldComponent();
    const handleChange = (eventOrValue) => onChange(textValueFromChange(eventOrValue));
    if (NativeTextField) {
        return SP_JSX.jsx(NativeTextField, { label: label, value: value, disabled: disabled, placeholder: placeholder, focusable: true, ref: inputRef, bIsPassword: password, type: password ? "password" : "text", onChange: handleChange, onBlur: onBlur, onFocus: () => {}, onClick: openKeyboard, onOKButton: openKeyboard, onSubmit: openKeyboard });
    }
    return SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }, children: [
        SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: label }),
        SP_JSX.jsx(DFL.Focusable, { focusable: true, "flow-children": "row", noFocusRing: false, onClick: openKeyboard, onPointerDown: openKeyboard, onOKButton: openKeyboard, onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openKeyboard();
                }
            }, style: { width: "100%" }, children: SP_JSX.jsx("input", { ref: inputRef, tabIndex: 0, value: value, disabled: disabled, placeholder: placeholder, inputMode: "text", type: password ? "password" : "text", onFocus: () => {}, onClick: openKeyboard, onPointerDown: openKeyboard, onChange: handleChange, onBlur: onBlur, style: {
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "0.35rem",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(0,0,0,0.25)",
                    color: "white",
                    padding: "0.55rem 0.65rem",
                    fontSize: "0.9rem"
                } }) })
    ] });
}
const fallbackWallpaperPreview = (event, result) => {
    const image = event.currentTarget;
    const current = String(image.getAttribute?.("src") || image.src || "");
    const candidates = [result?.preview_url, result?.image_url, result?.thumbnail_url]
        .filter((url, index, all) => Boolean(url) && all.indexOf(url) === index);
    const next = candidates.find((url) => url !== current && url !== image.src);
    if (next) {
        image.src = next;
        return;
    }
    image.style.opacity = "0.35";
};
const numericDropdownValue = (option) => {
    const candidate = option?.data ?? option?.value ?? option;
    const value = Number(candidate);
    return Number.isFinite(value) ? value : undefined;
};
const logoShadowFilter = (opacityPercent, blurPercent, scale) => {
    const opacity = Math.max(0, Math.min(100, Number(opacityPercent) || 0)) / 100;
    if (!(opacity > 0)) return "none";
    const bl = Math.max(0, Math.min(100, Number(blurPercent) || 0));
    const s = typeof scale === "number" ? scale : 1;
    const blurPx = Math.round((3 + (bl / 100) * 55) * s);
    const offPx = Math.max(1, Math.round(8 * s));
    const one = `drop-shadow(0 ${offPx}px ${blurPx}px rgba(0,0,0,${opacity}))`;
    return one + " " + one;
};
const EDITOR_SCREEN_ASPECT = 16 / 9;
function backgroundPlacementForAspect(imageAspect, scaleValue, positionX, positionY, viewportAspect = EDITOR_SCREEN_ASPECT) {
    const aspect = Number.isFinite(Number(imageAspect)) && Number(imageAspect) > 0 ? Number(imageAspect) : viewportAspect;
    const scale = Math.max(1, Math.min(2, Number(scaleValue) / 100 || 1));
    let baseWidth = 100;
    let baseHeight = 100;
    if (aspect > viewportAspect)
        baseWidth = (aspect / viewportAspect) * 100;
    else if (aspect < viewportAspect)
        baseHeight = (viewportAspect / aspect) * 100;
    const scaledWidth = baseWidth * scale;
    const scaledHeight = baseHeight * scale;
    const xTravel = Math.max(0, (scaledWidth - 100) / 2);
    const yTravel = Math.max(0, (scaledHeight - 100) / 2);
    const panX = Math.max(0, Math.min(100, Number(positionX) || 0));
    const panY = Math.max(0, Math.min(100, Number(positionY) || 0));
    return {
        width: baseWidth,
        height: baseHeight,
        left: 50 + ((panX - 50) / 50) * xTravel,
        top: 50 + ((panY - 50) / 50) * yTravel,
        scale
    };
}

function LogoEditorSurface({ backdropPath, logoSource, fallbackLogoPath, initial, onSave, onClose, strings, initialTarget = "logo", logoEnabled = true }) {
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Math.round(Number(value))));
    const [draft, setDraft] = SP_REACT.useState({
        logo_position_x: clamp(initial?.logo_position_x ?? 50, 0, 100),
        logo_position_y: clamp(initial?.logo_position_y ?? 50, 0, 100),
        logo_scale: clamp(initial?.logo_scale ?? 100, 50, 200),
        background_position_x: clamp(initial?.background_position_x ?? 50, 0, 100),
        background_position_y: clamp(initial?.background_position_y ?? 50, 0, 100),
        background_scale: clamp(initial?.background_scale ?? 100, 100, 200),
        background_opacity: clamp(initial?.background_opacity ?? 100, 0, 100),
        logo_shadow_opacity: clamp(initial?.logo_shadow_opacity ?? 0, 0, 100),
        logo_shadow_blur: clamp(initial?.logo_shadow_blur ?? 40, 0, 100)
    });
    const draftRef = SP_REACT.useRef(draft);
    const closingRef = SP_REACT.useRef(false);
    const [backdropUrl, setBackdropUrl] = SP_REACT.useState("");
    const [backdropAspect, setBackdropAspect] = SP_REACT.useState(EDITOR_SCREEN_ASPECT);
    const [logoUrl, setLogoUrl] = SP_REACT.useState("");
    const [saving, setSaving] = SP_REACT.useState(false);
    const canEditLogo = logoEnabled !== false;
    const [editorTarget, setEditorTarget] = SP_REACT.useState(!canEditLogo || initialTarget === "background" ? "background" : "logo");
    const normalizeBackgroundTransform = (positionX, positionY, scaleValue) => ({
        background_position_x: clamp(positionX, 0, 100),
        background_position_y: clamp(positionY, 0, 100),
        background_scale: clamp(scaleValue, 100, 200)
    });
    const updateDraft = (partial) => setDraft((current) => {
        const next = { ...current, ...partial };
        draftRef.current = next;
        return next;
    });
    SP_REACT.useEffect(() => {
        draftRef.current = draft;
    }, [draft]);
    SP_REACT.useEffect(() => {
        if (!canEditLogo && editorTarget !== "background")
            setEditorTarget("background");
    }, [canEditLogo, editorTarget]);
    SP_REACT.useEffect(() => () => {
        if (!closingRef.current) {
            closingRef.current = true;
            void onSave(draftRef.current).catch((error) => console.warn("Launch Curtain editor unmount autosave failed", error));
        }
    }, []);
    const move = (dx, dy) => {
        if (editorTarget === "background") {
            updateDraft(normalizeBackgroundTransform(
                draftRef.current.background_position_x + dx,
                draftRef.current.background_position_y + dy,
                draftRef.current.background_scale
            ));
            return;
        }
        updateDraft({
            logo_position_x: clamp(draftRef.current.logo_position_x + dx, 0, 100),
            logo_position_y: clamp(draftRef.current.logo_position_y + dy, 0, 100)
        });
    };
    const resize = (delta) => {
        if (editorTarget === "background") {
            updateDraft(normalizeBackgroundTransform(
                draftRef.current.background_position_x,
                draftRef.current.background_position_y,
                draftRef.current.background_scale + delta
            ));
            return;
        }
        updateDraft({ logo_scale: clamp(draftRef.current.logo_scale + delta, 50, 200) });
    };
    const reset = () => {
        if (editorTarget === "background") {
            updateDraft({ background_position_x: 50, background_position_y: 50, background_scale: 100 });
            return;
        }
        updateDraft({ logo_position_x: 50, logo_position_y: 50, logo_scale: 100 });
    };
    const saveAndClose = async () => {
        if (closingRef.current)
            return;
        closingRef.current = true;
        setSaving(true);
        try {
            await onSave(draftRef.current);
        }
        catch (error) {
            closingRef.current = false;
            console.warn("Launch Curtain editor autosave failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.editorSaveFailed || "Could not save the editor settings." });
            return;
        }
        finally {
            setSaving(false);
        }
        onClose();
    };
    const buttonStyle = { minWidth: "5.5rem" };
    const backgroundOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    const logoShadowOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    const logoShadowBlurOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const loadPreview = async () => {
            try {
                const [backdrop, logo] = await Promise.all([
                    getImagePreview({ source: backdropPath || "" }),
                    canEditLogo ? getImagePreview({ source: logoSource || "", fallback: fallbackLogoPath || "" }) : Promise.resolve({ url: "" })
                ]);
                if (cancelled)
                    return;
                setBackdropUrl(backdrop?.url || "");
                setLogoUrl(logo?.url || "");
            }
            catch (error) {
                console.warn("Launch Curtain logo placement preview failed", error);
                if (!cancelled) {
                    setBackdropUrl(toFileUrlForUi(backdropPath || ""));
                    setLogoUrl(canEditLogo ? (logoSource ? playButtonHook.normalizeLogoSource(logoSource) : toFileUrlForUi(fallbackLogoPath || "")) : "");
                }
            }
        };
        void loadPreview();
        return () => { cancelled = true; };
    }, [backdropPath, logoSource, fallbackLogoPath, canEditLogo]);
    const handlePreviewKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp": event.preventDefault(); move(0, -1); break;
            case "ArrowDown": event.preventDefault(); move(0, 1); break;
            case "ArrowLeft": event.preventDefault(); move(-1, 0); break;
            case "ArrowRight": event.preventDefault(); move(1, 0); break;
            default: break;
        }
    };
    const backdropPlacement = backgroundPlacementForAspect(
        backdropAspect,
        draft.background_scale,
        draft.background_position_x,
        draft.background_position_y
    );
    const useExtendedBackdropPreview = Math.abs(backdropAspect - EDITOR_SCREEN_ASPECT) > 0.01;
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "launch-curtain-main lc-settings-page lc-editor-page", style: { position: "relative", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        SP_JSX.jsx(LaunchCurtainPageStyles, {}),
        SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: editorPageStyle, children: [
            SP_JSX.jsx(SettingsCard, { title: strings.editorTitle, children: SP_JSX.jsxs("div", { className: "lc-editor-layout", children: [
                SP_JSX.jsxs("div", { className: `lc-editor-preview ${useExtendedBackdropPreview ? "lc-editor-preview--extended" : "lc-editor-preview--screen-only"}`, "aria-hidden": true, style: { pointerEvents: "none" }, children: [
                    SP_JSX.jsxs("div", { className: "lc-editor-screen", children: [
                        backdropUrl ? SP_JSX.jsx("img", { src: backdropUrl, className: "lc-editor-preview__backdrop", onLoad: (event) => {
                            const image = event.currentTarget;
                            const nextAspect = image?.naturalWidth > 0 && image?.naturalHeight > 0 ? image.naturalWidth / image.naturalHeight : EDITOR_SCREEN_ASPECT;
                            setBackdropAspect(nextAspect);
                        }, style: {
                            width: `${backdropPlacement.width}%`,
                            height: `${backdropPlacement.height}%`,
                            left: `${backdropPlacement.left}%`,
                            top: `${backdropPlacement.top}%`,
                            transform: `translate(-50%, -50%) scale(${backdropPlacement.scale})`,
                            opacity: draft.background_opacity / 100
                        } }) : null,
                        SP_JSX.jsx("div", { className: "lc-editor-screen-clip", children: canEditLogo && logoUrl ? SP_JSX.jsx("img", { src: logoUrl, className: "lc-editor-preview__logo", style: {
                            left: `${draft.logo_position_x}%`,
                            top: `${draft.logo_position_y}%`,
                            transform: `translate(-50%, -50%) scale(${draft.logo_scale / 100})`,
                            filter: logoShadowFilter(draft.logo_shadow_opacity, draft.logo_shadow_blur, 0.32)
                        } }) : null })
                    ] }),
                    SP_JSX.jsx("div", { className: "lc-editor-outside-mask lc-editor-outside-mask--top" }),
                    SP_JSX.jsx("div", { className: "lc-editor-outside-mask lc-editor-outside-mask--bottom" }),
                    SP_JSX.jsx("div", { className: "lc-editor-outside-mask lc-editor-outside-mask--left" }),
                    SP_JSX.jsx("div", { className: "lc-editor-outside-mask lc-editor-outside-mask--right" }),
                    SP_JSX.jsx("div", { className: "lc-editor-screen-frame" })
                ] }),
                SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "lc-editor-controls", children: [
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.backgroundOpacity, rgOptions: backgroundOpacityOptions, selectedOption: draft.background_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ background_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowOpacity, disabled: !canEditLogo, rgOptions: logoShadowOpacityOptions, selectedOption: draft.logo_shadow_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined && canEditLogo) updateDraft({ logo_shadow_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowBlur ?? "Blur ombra del logo", disabled: !canEditLogo, rgOptions: logoShadowBlurOptions, selectedOption: draft.logo_shadow_blur, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined && canEditLogo) updateDraft({ logo_shadow_blur: value }); } }),
                    SP_JSX.jsx("div", { className: "lc-editor-target-label", children: strings.whatToEdit ?? "What do you want to edit?" }),
                    SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row", children: [
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => setEditorTarget("background"), style: buttonStyle, className: editorTarget === "background" ? "lc-editor-target-active" : "", children: strings.background ?? "Background" }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: canEditLogo, disabled: !canEditLogo, onClick: () => { if (canEditLogo) setEditorTarget("logo"); }, style: buttonStyle, className: canEditLogo && editorTarget === "logo" ? "lc-editor-target-active" : "", children: strings.logo ?? "Logo" })
                    ] }),
                    SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row lc-editor-button-row--center", children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, -1), style: buttonStyle, children: strings.up }) }),
                    SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row", children: [
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(-1, 0), style: buttonStyle, children: strings.left }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: reset, style: buttonStyle, children: strings.reset }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(1, 0), style: buttonStyle, children: strings.right })
                    ] }),
                    SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row lc-editor-button-row--center", children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, 1), style: buttonStyle, children: strings.down }) }),
                    SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row", children: [
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(-10), style: buttonStyle, children: strings.smaller }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(10), style: buttonStyle, children: strings.bigger })
                    ] })
                ] })
            ] }) }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: saving, className: "lc-close-button", onClick: () => { void saveAndClose(); }, children: saving ? (strings.saving || "Saving...") : (strings.close || "Close") })
        ] }) })
    ] });
}
function LogoEditorPage() {
    const strings = getStrings();
    const routeParams = DFL.useParams();
    const appId = appIdFromRouteParams(routeParams) || currentRouteAppId();
    const [payload, setPayload] = SP_REACT.useState(undefined);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        if (!appId)
            return () => { cancelled = true; };
        void getGameSettings({ app_id: appId }).then((next) => {
            if (!cancelled)
                setPayload(next);
        }).catch((error) => console.warn("Launch Curtain editor settings load failed", error));
        return () => { cancelled = true; };
    }, [appId]);
    if (!appId)
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.noGameSelected }) });
    if (!payload)
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.loading }) });
    const raw = payload.settings || {};
    const resolved = payload.resolved || {};
    const saveEditor = async (next) => {
        await saveGameSettings({ app_id: appId, settings: next });
        const allSettings = await getSettings();
        playButtonHook.setSettingsCache(allSettings);
    };
    const closeEditor = () => {
        try {
            if (typeof DFL.Navigation?.NavigateBack === "function") {
                DFL.Navigation.NavigateBack();
                return;
            }
        }
        catch (_error) {}
        DFL.Navigation?.Navigate?.(`/launch-curtain/${appId}`);
    };
    return SP_JSX.jsx(LogoEditorSurface, {
        backdropPath: resolved.fullscreen_image_path || raw.fullscreen_image_path || "",
        logoSource: payload.logo_source || payload.default_logo_path || "",
        fallbackLogoPath: payload.default_logo_path || "",
        initial: resolved,
        initialTarget: resolved.show_logo === false ? "background" : "logo",
        logoEnabled: resolved.show_logo !== false,
        strings,
        onSave: saveEditor,
        onClose: closeEditor
    }, `launch-curtain-editor-${appId}`);
}
function GameSettingsPage() {
    const strings = getStrings();
    const routeParams = DFL.useParams();
    const paramsAppId = appIdFromRouteParams(routeParams);
    const [routePathname, setRoutePathname] = SP_REACT.useState(globalThis.window?.location?.pathname || "");
    const routePathAppId = getLaunchCurtainRouteAppId(routePathname);
    const appId = paramsAppId || routePathAppId || currentRouteAppId();
    const [payload, setPayload] = SP_REACT.useState(undefined);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [imageResolution, setImageResolution] = SP_REACT.useState("3840x2160");
    const [imageSearchQuery, setImageSearchQuery] = SP_REACT.useState("");
    const [imageSearchBusy, setImageSearchBusy] = SP_REACT.useState(false);
    const [imageResults, setImageResults] = SP_REACT.useState([]);
    const [imageSearchMessage, setImageSearchMessage] = SP_REACT.useState("");
    const [selectedImageId, setSelectedImageId] = SP_REACT.useState("");
    const [playStationBusy, setPlayStationBusy] = SP_REACT.useState(false);
    const [playStationGames, setPlayStationGames] = SP_REACT.useState([]);
    const [playStationBackgrounds, setPlayStationBackgrounds] = SP_REACT.useState([]);
    const [playStationMessage, setPlayStationMessage] = SP_REACT.useState("");
    const [selectedPlayStationGameId, setSelectedPlayStationGameId] = SP_REACT.useState("");
    const [selectedPlayStationGame, setSelectedPlayStationGame] = SP_REACT.useState(undefined);
    const [activeScraper, setActiveScraper] = SP_REACT.useState("playstation");
    const [focusedScraper, setFocusedScraper] = SP_REACT.useState("");
    const [backdropPreviewUrl, setBackdropPreviewUrl] = SP_REACT.useState("");
    const [soundbiteSearchQuery, setSoundbiteSearchQuery] = SP_REACT.useState("");
    const [soundbiteResults, setSoundbiteResults] = SP_REACT.useState([]);
    const [soundbiteBusy, setSoundbiteBusy] = SP_REACT.useState(false);
    const [soundbiteMessage, setSoundbiteMessage] = SP_REACT.useState("");
    const [soundbitePreviewingId, setSoundbitePreviewingId] = SP_REACT.useState("");
    const [soundbitePreviewLoadingId, setSoundbitePreviewLoadingId] = SP_REACT.useState("");
    const [soundbiteDownloadingId, setSoundbiteDownloadingId] = SP_REACT.useState("");
    const soundbiteAudioRef = SP_REACT.useRef(null);
    const soundbiteSearchInputRef = SP_REACT.useRef(null);
    const soundbiteVolumeSaveSequenceRef = SP_REACT.useRef(0);
    const exitDelayOptions = Array.from({ length: 11 }, (_item, seconds) => ({ data: seconds, label: `${seconds} s` }));
    const forceModeOptions = [
        { data: "auto", label: strings.modeAuto ?? I18N.en.modeAuto ?? "Auto" },
        { data: "classic", label: strings.modeClassic ?? I18N.en.modeClassic ?? "Classic (overlay window)" },
        { data: "modern", label: strings.modeModern ?? I18N.en.modeModern ?? "Modern (in Steam UI)" }
    ];
    const gameTimeoutOptions = Array.from({ length: 12 }, (_item, index) => (index + 1) * 5).map((seconds) => ({ data: seconds, label: `${seconds} s` }));
    const gameTitle = appNameForId(appId);
    const defaultSearchQuery = /^App \d+$/i.test(gameTitle) ? "" : `${gameTitle}`;
    const searchInputRef = SP_REACT.useRef(null);
    const playStationSearchInputRef = SP_REACT.useRef(null);
    const focusSearchInput = () => focusTextInputWithSteamKeyboard(searchInputRef.current);
    const focusPlayStationSearchInput = () => focusTextInputWithSteamKeyboard(playStationSearchInputRef.current);
    const focusSoundbiteSearchInput = () => focusTextInputWithSteamKeyboard(soundbiteSearchInputRef.current);
    SP_REACT.useEffect(() => {
        let lastPath = globalThis.window?.location?.pathname || "";
        const timer = globalThis.window?.setInterval?.(() => {
            const currentPath = globalThis.window?.location?.pathname || "";
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                setRoutePathname(currentPath);
            }
        }, 150);
        return () => {
            if (timer)
                globalThis.window?.clearInterval?.(timer);
        };
    }, []);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        setPayload(undefined);
        setImageResults([]);
        setImageSearchMessage("");
        setSelectedImageId("");
        setPlayStationGames([]);
        setPlayStationBackgrounds([]);
        setPlayStationMessage("");
        setSelectedPlayStationGameId("");
        setSelectedPlayStationGame(undefined);
        setImageSearchQuery(defaultSearchQuery);
        setSoundbiteResults([]);
        setSoundbiteMessage("");
        setSoundbitePreviewingId("");
        try { soundbiteAudioRef.current?.pause?.(); } catch (_error) {}
        soundbiteAudioRef.current = null;
        setSoundbiteSearchQuery(defaultSearchQuery);
        if (!appId) {
            setBusy(false);
            return () => {
                cancelled = true;
            };
        }
        setBusy(true);
        void getGameSettings({ app_id: appId }).then((next) => {
            if (cancelled)
                return;
            setPayload(next);
            const savedQuery = String(next?.settings?.background_search_query || "").trim();
            setImageSearchQuery(savedQuery || defaultSearchQuery);
            const savedSoundbiteQuery = String(next?.settings?.soundbite_search_query || "").trim();
            setSoundbiteSearchQuery(savedSoundbiteQuery || defaultSearchQuery);
        }).finally(() => {
            if (!cancelled)
                setBusy(false);
        });
        return () => {
            cancelled = true;
            try { soundbiteAudioRef.current?.pause?.(); } catch (_error) {}
            soundbiteAudioRef.current = null;
        };
    }, [appId, defaultSearchQuery]);
    const raw = payload?.settings || {};
    const resolved = payload?.resolved || {};
    const selectedBackdropPath = resolved.fullscreen_image_path || raw.fullscreen_image_path || "";
    SP_REACT.useEffect(() => {
        let cancelled = false;
        setBackdropPreviewUrl("");
        if (!selectedBackdropPath) {
            return () => { cancelled = true; };
        }
        const loadPreview = async () => {
            try {
                const preview = await getImagePreview({ source: selectedBackdropPath });
                if (!cancelled) {
                    setBackdropPreviewUrl(preview?.url || toFileUrlForUi(selectedBackdropPath));
                }
            }
            catch (error) {
                console.warn("Launch Curtain selected backdrop preview failed", error);
                if (!cancelled) {
                    setBackdropPreviewUrl(toFileUrlForUi(selectedBackdropPath));
                }
            }
        };
        void loadPreview();
        return () => {
            cancelled = true;
        };
    }, [selectedBackdropPath]);
    const selectedServices = activeScraper === "playstation" ? [] : [activeScraper];
    const savePartial = async (partial) => {
        if (!appId)
            return;
        const currentAppId = appId;
        setBusy(true);
        try {
            const next = await saveGameSettings({ app_id: currentAppId, settings: partial });
            if ((currentRouteAppId() || paramsAppId || currentAppId) === currentAppId)
                setPayload(next);
            const allSettings = await getSettings();
            playButtonHook.setSettingsCache(allSettings);
        }
        finally {
            setBusy(false);
        }
    };
    const saveSoundbiteVolume = async (value) => {
        if (!appId || !payload)
            return;
        const currentAppId = appId;
        const volume = Math.max(0, Math.min(100, Number(value) || 0));
        const sequence = ++soundbiteVolumeSaveSequenceRef.current;
        // Optimistic local update keeps Steam's slider fluid instead of locking the
        // entire per-game settings page for every 5% step while dragging.
        setPayload((current) => current ? {
            ...current,
            settings: { ...(current.settings || {}), soundbite_volume: volume },
            resolved: { ...(current.resolved || {}), soundbite_volume: volume }
        } : current);
        try {
            const next = await saveGameSettings({ app_id: currentAppId, settings: { soundbite_volume: volume } });
            if (sequence === soundbiteVolumeSaveSequenceRef.current && (currentRouteAppId() || paramsAppId || currentAppId) === currentAppId)
                setPayload(next);
        }
        catch (error) {
            console.warn("Launch Curtain Soundbite volume save failed", error);
        }
    };
    const chooseBackdrop = async () => {
        setBusy(true);
        try {
            let startPath = raw.fullscreen_image_path || "C:\\";
            for (let attempts = 0; attempts < 8; attempts += 1) {
                const picked = await openFilePicker(FILE_SELECTION_FILE, startPath, true, false, undefined, undefined, false, true);
                const selectedPath = picked.realpath || picked.path || "";
                if (!selectedPath) {
                    return;
                }
                const validation = await validateLaunchImagePath({ path: selectedPath });
                if (validation.ok && validation.is_file) {
                    await savePartial({ fullscreen_image_path: validation.path || selectedPath });
                    return;
                }
                if (validation.is_dir && validation.path) {
                    startPath = validation.path;
                    continue;
                }
                toaster.toast({ title: strings.toastAttention, body: strings.chooseFileNotFolder });
                return;
            }
            toaster.toast({ title: strings.toastAttention, body: strings.chooseFileNotFolder });
        }
        catch (error) {
            console.warn("Launch Curtain backdrop picker failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.imagePickerFailed });
        }
        finally {
            setBusy(false);
        }
    };
    const searchImages = async () => {
        const title = /^App \d+$/i.test(gameTitle) ? "" : gameTitle;
        const query = imageSearchQuery.trim();
        if (!title || !query) {
            setImageSearchMessage(!title ? strings.gameTitleUnavailable : strings.enterSearchQuery);
            return;
        }
        setImageSearchBusy(true);
        setImageSearchMessage("");
        try {
            persistSearchQuery(query);
            const result = await searchGoogleImages({ app_id: appId, title, query, resolution: imageResolution, services: selectedServices });
            const results = Array.isArray(result.results) ? result.results : [];
            setImageResults(results);
            setSelectedImageId(results[0]?.id || results[0]?.image_url || "");
            setImageSearchMessage(results.length ? strings.imagesFound : (result?.message || strings.noImagesFound));
        }
        catch (error) {
            console.warn("Launch Curtain background image search failed", error);
            setImageResults([]);
            setImageSearchMessage(strings.searchFailed);
        }
        finally {
            setImageSearchBusy(false);
        }
    };
    const searchPlayStationProducts = async () => {
        const query = imageSearchQuery.trim();
        if (!query) {
            setPlayStationMessage(strings.enterSearchQuery);
            return;
        }
        setPlayStationBusy(true);
        setPlayStationMessage("");
        setPlayStationBackgrounds([]);
        setSelectedPlayStationGameId("");
        setSelectedPlayStationGame(undefined);
        try {
            persistSearchQuery(query);
            const result = await searchPlayStationGames({ query });
            const results = Array.isArray(result?.results) ? result.results : [];
            setPlayStationGames(results);
            setPlayStationMessage(results.length ? strings.choosePlayStationGame : strings.noPlayStationGames);
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation game search failed", error);
            setPlayStationGames([]);
            setPlayStationMessage(strings.searchFailed);
        }
        finally {
            setPlayStationBusy(false);
        }
    };
    const selectPlayStationGame = async (game) => {
        const resultId = game?.id || game?.product_id || game?.product_url || "";
        if (!resultId || !game?.product_url)
            return;
        setSelectedPlayStationGameId(resultId);
        setSelectedPlayStationGame(game);
        setPlayStationBusy(true);
        setPlayStationBackgrounds([]);
        setPlayStationMessage(`${strings.readingBackgrounds} ${game.title || ""}`.trim());
        try {
            const result = await getPlayStationBackgrounds({
                product_url: game.product_url,
                title: game.title || imageSearchQuery.trim() || gameTitle,
                resolution: imageResolution
            });
            const backgrounds = Array.isArray(result?.results) ? result.results : [];
            setPlayStationBackgrounds(backgrounds);
            setSelectedImageId(backgrounds[0]?.id || backgrounds[0]?.image_url || "");
            setPlayStationMessage(backgrounds.length ? strings.chooseBackground : strings.noBackgrounds);
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation background lookup failed", error);
            setPlayStationMessage(strings.searchFailed);
        }
        finally {
            setPlayStationBusy(false);
        }
    };
    const persistSearchQuery = (value = imageSearchQuery) => {
        if (!appId || !payload)
            return;
        const query = String(value || "").trim();
        const storedQuery = query && query !== defaultSearchQuery ? query : "";
        void saveGameSettings({ app_id: appId, settings: { background_search_query: storedQuery } }).then((next) => {
            if ((currentRouteAppId() || paramsAppId || appId) === appId)
                setPayload(next);
        }).catch((error) => console.warn("Launch Curtain search query save failed", error));
    };
    const downloadImage = async (image) => {
        const title = /^App \d+$/i.test(gameTitle) ? "" : gameTitle;
        const imageUrl = image?.image_url || image?.thumbnail_url || "";
        if (!title || !imageUrl) {
            return;
        }
        setBusy(true);
        try {
            const next = await downloadGoogleImage({ app_id: appId, title, resolution: image?.resolution || imageResolution, image_url: imageUrl, source: image?.source || "" });
            if (next.ok) {
                setPayload(next);
                const allSettings = await getSettings();
                playButtonHook.setSettingsCache(allSettings);
                toaster.toast({ title: strings.toastTitle, body: strings.imageDownloaded });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: strings.imageDownloadFailed });
            }
        }
        catch (error) {
            console.warn("Launch Curtain background image download failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.imageDownloadFailed });
        }
        finally {
            setBusy(false);
        }
    };
    const stopSoundbitePreview = () => {
        try {
            if (soundbiteAudioRef.current) {
                soundbiteAudioRef.current.pause?.();
                soundbiteAudioRef.current.currentTime = 0;
            }
        }
        catch (_error) {}
        soundbiteAudioRef.current = null;
        setSoundbitePreviewingId("");
        setSoundbitePreviewLoadingId("");
    };
    const playSoundbitePreview = async (item, id) => {
        stopSoundbitePreview();
        const source = String(item?.audio_url || item?.soundbite_path || item?.path || item || "").trim();
        if (!source)
            return;
        setSoundbiteBusy(true);
        setSoundbitePreviewLoadingId(id);
        try {
            const preview = await getSoundbitePreview({ source });
            if (!preview?.ok || !preview?.url) {
                setSoundbiteMessage(preview?.message || strings.soundbiteDownloadFailed);
                return;
            }
            const audio = new Audio(preview.url);
            const gameVolume = Math.max(0, Math.min(100, Number(resolved.soundbite_volume ?? 100))) / 100;
            const masterVolume = Math.max(0, Math.min(100, Number(payload?.soundbite_master_volume ?? 100))) / 100;
            audio.volume = Math.max(0, Math.min(1, gameVolume * masterVolume));
            audio.onended = () => { soundbiteAudioRef.current = null; setSoundbitePreviewingId(""); };
            audio.onerror = () => { soundbiteAudioRef.current = null; setSoundbitePreviewingId(""); setSoundbiteMessage(strings.soundbiteDownloadFailed); };
            soundbiteAudioRef.current = audio;
            setSoundbitePreviewingId(id);
            await audio.play();
        }
        catch (error) {
            console.warn("Launch Curtain Soundbite preview failed", error);
            setSoundbiteMessage(strings.soundbiteDownloadFailed);
            stopSoundbitePreview();
        }
        finally {
            setSoundbitePreviewLoadingId("");
            setSoundbiteBusy(false);
        }
    };
    const persistSoundbiteSearchQuery = (value = soundbiteSearchQuery) => {
        if (!appId || !payload)
            return;
        const query = String(value || "").trim();
        const storedQuery = query && query !== defaultSearchQuery ? query : "";
        void saveGameSettings({ app_id: appId, settings: { soundbite_search_query: storedQuery } }).then((next) => setPayload(next)).catch((error) => console.warn("Soundbite query save failed", error));
    };
    const searchSoundbites = async () => {
        const query = soundbiteSearchQuery.trim();
        if (!query) {
            setSoundbiteMessage(strings.enterSearchQuery);
            return;
        }
        stopSoundbitePreview();
        setSoundbiteBusy(true);
        setSoundbiteMessage("");
        setSoundbiteResults([]);
        try {
            persistSoundbiteSearchQuery(query);
            const result = await searchIidbSoundbites({ title: gameTitle, query });
            const results = Array.isArray(result?.results) ? result.results : [];
            setSoundbiteResults(results);
            setSoundbiteMessage(results.length ? `${results.length} Soundbite${results.length === 1 ? "" : "s"}` : strings.noIidbSoundbites);
        }
        catch (error) {
            console.warn("Launch Curtain iiDB Soundbite search failed", error);
            setSoundbiteMessage(strings.searchFailed);
        }
        finally {
            setSoundbiteBusy(false);
        }
    };
    const downloadSoundbite = async (item) => {
        if (!appId || !item?.audio_url)
            return;
        const downloadId = String(item.id || item.audio_url || "");
        stopSoundbitePreview();
        setSoundbiteBusy(true);
        setSoundbiteDownloadingId(downloadId);
        try {
            const next = await downloadIidbSoundbite({ app_id: appId, title: gameTitle, audio_url: item.audio_url, soundbite_title: item.soundbite_title || item.title || item.source || "iiDB Soundbite", game_title: gameTitle });
            if (next?.ok) {
                setPayload(next);
                const allSettings = await getSettings();
                playButtonHook.setSettingsCache(allSettings);
                toaster.toast({ title: strings.toastTitle, body: next.message || strings.downloadApplySoundbite });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: next?.message || strings.soundbiteDownloadFailed });
            }
        }
        catch (error) {
            console.warn("Launch Curtain Soundbite download failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.soundbiteDownloadFailed });
        }
        finally {
            setSoundbiteDownloadingId("");
            setSoundbiteBusy(false);
        }
    };
    const chooseSoundbite = async () => {
        if (!appId)
            return;
        setSoundbiteBusy(true);
        try {
            const startPath = String(raw.soundbite_path || "C:\\");
            const picked = await openFilePicker(FILE_SELECTION_FILE, startPath, true, false, undefined, undefined, false, true);
            const selectedPath = picked.realpath || picked.path || "";
            if (!selectedPath)
                return;
            const validation = await validateSoundbitePath({ path: selectedPath });
            if (!validation?.ok) {
                toaster.toast({ title: strings.toastAttention, body: validation?.message || strings.soundbiteImportFailed });
                return;
            }
            const next = await importLocalSoundbite({ app_id: appId, path: validation.path || selectedPath });
            if (next?.ok) {
                setPayload(next);
                const allSettings = await getSettings();
                playButtonHook.setSettingsCache(allSettings);
                toaster.toast({ title: strings.toastTitle, body: strings.soundbiteImported });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: next?.message || strings.soundbiteImportFailed });
            }
        }
        catch (error) {
            console.warn("Launch Curtain Soundbite picker failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.soundbiteImportFailed });
        }
        finally {
            setSoundbiteBusy(false);
        }
    };
    const removeCurrentSoundbite = async () => {
        if (!appId)
            return;
        stopSoundbitePreview();
        setSoundbiteBusy(true);
        try {
            const result = await clearSoundbite({ app_id: appId });
            const next = await getGameSettings({ app_id: appId });
            setPayload(next);
            const allSettings = await getSettings();
            playButtonHook.setSettingsCache(allSettings);
            toaster.toast({ title: strings.toastTitle, body: result?.message || strings.removeSoundbite });
        }
        finally {
            setSoundbiteBusy(false);
        }
    };
    const renderSoundbiteResults = () => soundbiteResults.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: { display: "flex", flexDirection: "column", gap: 8 }, children: soundbiteResults.map((item, index) => {
        const resultId = String(item.id || item.audio_url || index);
        const isPreviewing = soundbitePreviewingId === resultId;
        const isPreviewLoading = soundbitePreviewLoadingId === resultId;
        const isDownloading = soundbiteDownloadingId === resultId;
        const resultGameTitle = String(gameTitle || item.game_title || item.title || "iiDB").trim();
        const resultSoundbiteTitle = String(item.soundbite_title || ((item.title && item.title !== resultGameTitle) ? item.title : "") || item.name || "iiDB Soundbite").trim();
        const durationSeconds = Math.max(0, Math.round(Number(item.duration_seconds) || 0));
        const durationLabel = durationSeconds ? `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, "0")}` : "";
        const iconButtonStyle = { width: 42, minWidth: 42, height: 42, minHeight: 42, padding: 0, display: "grid", placeItems: "center" };
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-soundbite-result", style: { ...wallpaperResultRowStyle, gridTemplateColumns: "minmax(0,1fr) 42px 42px" }, children: [
            SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [
                SP_JSX.jsx("div", { style: { fontSize: 14, fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: resultGameTitle }),
                SP_JSX.jsx("div", { style: { marginTop: 3, fontSize: 12, opacity: .55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: durationLabel ? `${resultSoundbiteTitle} · ${durationLabel}` : resultSoundbiteTitle })
            ] }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: "lc-soundbite-icon-button", title: isPreviewing ? strings.stopSoundbitePreview : strings.previewSoundbite, disabled: Boolean(soundbiteDownloadingId) || (Boolean(soundbitePreviewLoadingId) && !isPreviewLoading), onClick: () => { if (isPreviewing) stopSoundbitePreview(); else void playSoundbitePreview(item, resultId); }, style: iconButtonStyle, children: isPreviewLoading ? SP_JSX.jsx("span", { className: "lc-mini-spinner" }) : isPreviewing ? SP_JSX.jsx(FaPause, {}) : SP_JSX.jsx(FaPlay, {}) }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: "lc-soundbite-icon-button", title: strings.downloadApplySoundbite, disabled: Boolean(soundbiteDownloadingId), onClick: () => { void downloadSoundbite(item); }, style: iconButtonStyle, children: isDownloading ? SP_JSX.jsx("span", { className: "lc-mini-spinner" }) : SP_JSX.jsx(FaDownload, {}) })
        ] }, resultId);
    }) }) : null;

    const openLogoPlacement = () => {
        DFL.Navigation?.Navigate?.(`/launch-curtain/${appId}/editor`);
    };
    if (!appId) {
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.noGameSelected }) });
    }
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === (raw.exit_delay_seconds ?? resolved.exit_delay_seconds)) ? (raw.exit_delay_seconds ?? resolved.exit_delay_seconds) : (payload?.global_exit_delay_seconds ?? 3);
    const renderBackgroundResults = (results, loading = false) => results.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-results-grid", children: results.map((result) => {
        const resultId = result.id || result.image_url;
        const isSteamGridHero = String(result.source || "").toLowerCase().includes("steamgriddb") || (activeScraper === "steamgriddb" && String(result.asset_type || "").toLowerCase() === "hero");
        const previewStyle = isSteamGridHero
            ? { ...wallpaperPreviewStyle, aspectRatio: "auto", objectFit: "contain", width: "100%", height: "auto", maxHeight: "none", display: "block" }
            : wallpaperPreviewStyle;
        const cardStyle = isSteamGridHero
            ? { ...wallpaperResultRowStyle, gridTemplateColumns: "minmax(0,1fr)", alignItems: "stretch", border: selectedImageId === resultId ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border }
            : { ...wallpaperResultRowStyle, border: selectedImageId === resultId ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border };
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": isSteamGridHero ? "vertical" : "horizontal", noFocusRing: true, onFocus: () => setSelectedImageId(resultId), className: "lc-background-result", style: cardStyle, children: [
            SP_JSX.jsx("img", { src: isSteamGridHero ? result.image_url : (result.thumbnail_url || result.preview_url || result.image_url), onError: (event) => fallbackWallpaperPreview(event, result), style: previewStyle }),
            SP_JSX.jsxs("div", { style: { minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 4 }, children: [
                SP_JSX.jsx("div", { style: { fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.source || strings.background }),
                SP_JSX.jsx("span", { style: { fontSize: 12, opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: (result.width && result.height) ? `${result.width}×${result.height}` : (result.resolution || result.size || imageResolution) })
            ] }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || loading, onClick: () => { void downloadImage(result); }, style: isSteamGridHero ? { width: "100%" } : { width: "100%", minWidth: "7.25rem", maxWidth: "9rem" }, children: strings.download })
        ] }, resultId);
    }) }) : null;
    const renderPlayStationGames = () => playStationGames.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: { display: "flex", flexDirection: "column", gap: 8, width: "100%", minWidth: 0 }, children: playStationGames.map((game) => {
        const resultId = game.id || game.product_id || game.product_url;
        const isSelected = selectedPlayStationGameId === resultId;
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, onFocus: () => setSelectedPlayStationGameId(resultId), className: "lc-playstation-result", style: { ...wallpaperResultRowStyle, gridTemplateColumns: "minmax(0,1fr) minmax(9rem,auto)", border: isSelected ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border }, children: [
            SP_JSX.jsx("div", { style: { minWidth: 0, maxWidth: "100%", fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: game.title || strings.playStationGame }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || playStationBusy, onClick: () => { void selectPlayStationGame(game); }, style: { width: "100%", minWidth: "9rem", maxWidth: "11rem" }, children: playStationBusy && isSelected ? strings.loading : strings.viewBackgrounds })
        ] }, resultId);
    }) }) : null;
    const scraperTabs = (items, current, onChange) => SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-scraper-tabs", children: items.map((item) => {
        const focused = focusedScraper === item.id;
        return SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: `lc-scraper-tab${current === item.id ? " lc-scraper-tab--active" : ""}${focused ? " lc-scraper-tab--focused" : ""}`, onFocus: () => setFocusedScraper(item.id), onBlur: () => setFocusedScraper((value) => value === item.id ? "" : value), onMouseEnter: () => setFocusedScraper(item.id), onMouseLeave: () => setFocusedScraper((value) => value === item.id ? "" : value), onClick: () => onChange(item.id), children: item.label }, item.id);
    }) });
    const scraperContent = activeScraper === "playstation" ? SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: imageSearchQuery, disabled: busy || playStationBusy || !payload, placeholder: defaultSearchQuery || strings.playStationGame, inputRef: playStationSearchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusPlayStationSearchInput }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || playStationBusy || !payload || !imageSearchQuery.trim(), onClick: () => { void searchPlayStationProducts(); }, children: playStationBusy ? strings.searchingPlayStation : strings.searchPlayStation }),
        playStationMessage ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: playStationMessage }) : null,
        selectedPlayStationGame ? SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            SP_JSX.jsxs("div", { className: "lc-selected-game", children: [
                SP_JSX.jsx("div", { style: { minWidth: 0, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: selectedPlayStationGame.title || strings.playStationGame }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => { setSelectedPlayStationGame(undefined); setSelectedPlayStationGameId(""); setPlayStationBackgrounds([]); setPlayStationMessage(strings.choosePlayStationGame); }, style: { minWidth: "10rem", maxWidth: "12rem" }, children: strings.backToResults })
            ] }),
            renderBackgroundResults(playStationBackgrounds, playStationBusy)
        ] }) : renderPlayStationGames()
    ] }) : SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        activeScraper === "steamgriddb" ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: payload?.steamgriddb_configured ? (strings.steamGridHeroOnlyHelp ?? "SteamGridDB search returns Hero artwork only.") : (strings.steamGridApiRequired ?? "Configure your personal SteamGridDB API key in the Launch Curtain QAM before searching.") }) : null,
        SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: imageSearchQuery, disabled: busy || imageSearchBusy || !payload, placeholder: defaultSearchQuery || strings.gameWallpaper, inputRef: searchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusSearchInput }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || imageSearchBusy || !payload || /^App \d+$/i.test(gameTitle) || !imageSearchQuery.trim() || (activeScraper === "steamgriddb" && !payload?.steamgriddb_configured), onClick: () => { void searchImages(); }, children: imageSearchBusy ? strings.searching : strings.search }),
        imageSearchMessage ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: imageSearchMessage }) : null,
        renderBackgroundResults(imageResults, imageSearchBusy)
    ] });
    const pageContent = SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        SP_JSX.jsx(SettingsCard, { children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            SP_JSX.jsx(DFL.ToggleField, { label: strings.enableForGame, checked: resolved.enabled !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ enabled: checked }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay, rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !payload, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) void savePartial({ exit_delay_seconds: value }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.forceMode ?? I18N.en.forceMode ?? "Force mode for this game", rgOptions: forceModeOptions, selectedOption: (resolved.force_mode || "auto"), disabled: busy || !payload, onChange: (option) => { if (typeof option.data === "string") void savePartial({ force_mode: option.data }); } }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.gameTimeout ?? I18N.en.gameTimeout ?? "Timeout only for this game", checked: resolved.timeout_enabled === true, disabled: busy || !payload, onChange: (checked) => { void savePartial({ timeout_enabled: checked }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.gameTimeoutSeconds ?? I18N.en.gameTimeoutSeconds ?? "Timeout duration", rgOptions: gameTimeoutOptions, selectedOption: (typeof resolved.timeout_seconds === "number" ? resolved.timeout_seconds : 50), disabled: busy || !payload || resolved.timeout_enabled !== true, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) void savePartial({ timeout_seconds: value }); } })
        ] }) }),
        SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-appearance-grid", children: [
            SP_JSX.jsx(SettingsCard, { className: "lc-appearance-card", title: strings.editorTitle, description: strings.logoHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload, onClick: openLogoPlacement, children: strings.openEditor }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.showLogo, checked: resolved.show_logo !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ show_logo: checked }); } }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.logoZoom, checked: resolved.logo_zoom_enabled !== false, disabled: busy || !payload || resolved.show_logo === false, onChange: (checked) => { void savePartial({ logo_zoom_enabled: checked }); } }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.bgZoom ?? "Enable background zoom-out animation", checked: resolved.bg_zoom_enabled === true, disabled: busy || !payload, onChange: (checked) => { void savePartial({ bg_zoom_enabled: checked }); } })
            ] }) }),
            SP_JSX.jsx(SettingsCard, { className: "lc-appearance-card", title: strings.background, description: selectedBackdropPath || strings.noLaunchImage, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
                backdropPreviewUrl ? SP_JSX.jsx("div", { style: { width: "100%", display: "flex", justifyContent: "center" }, children: SP_JSX.jsx("img", { src: backdropPreviewUrl, style: { width: "100%", maxWidth: "680px", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 8 } }) }) : null,
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload, onClick: () => { void chooseBackdrop(); }, children: strings.chooseLaunchImage }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload || !raw.fullscreen_image_path, onClick: () => { void savePartial({ fullscreen_image_path: "" }); }, children: strings.clearLaunchImage })
            ] }) })
        ] }),
        SP_JSX.jsx(SettingsCard, { title: strings.soundbites, description: strings.soundbitesHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            resolved.soundbite_path ? SP_JSX.jsxs("div", { className: "lc-selected-game", children: [
                SP_JSX.jsxs("div", { style: { minWidth: 0 }, children: [
                    SP_JSX.jsx("div", { style: { fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: resolved.soundbite_title || String(resolved.soundbite_path).split(/[\\/]/).pop() || strings.soundbites }),
                    SP_JSX.jsx("div", { style: { ...rowTextStyle, marginTop: 3 }, children: resolved.soundbite_source === "local" ? strings.soundbiteLocal : strings.soundbiteIidb })
                ] }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: soundbiteBusy, onClick: () => { const id = "current"; if (soundbitePreviewingId === id) stopSoundbitePreview(); else void playSoundbitePreview({ soundbite_path: resolved.soundbite_path }, id); }, children: soundbitePreviewingId === "current" ? strings.stopSoundbitePreview : strings.previewSoundbite })
            ] }) : null,
            SP_JSX.jsx(DFL.SliderField, { label: strings.soundbiteVolume, value: Number(resolved.soundbite_volume ?? 100), min: 0, max: 100, step: 5, valueSuffix: "%", showValue: true, disabled: busy || soundbiteBusy || !payload, onChange: (value) => { void saveSoundbiteVolume(value); } }),
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: [
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || soundbiteBusy || !payload, onClick: () => { void chooseSoundbite(); }, children: strings.importSoundbite }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || soundbiteBusy || !resolved.soundbite_path, onClick: () => { void removeCurrentSoundbite(); }, children: strings.removeSoundbite })
            ] }),
            SP_JSX.jsx("div", { style: { height: 1, background: "rgba(255,255,255,.08)", margin: "4px 0" } }),
            SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: soundbiteSearchQuery, disabled: busy || soundbiteBusy || !payload, placeholder: defaultSearchQuery || strings.soundbites, inputRef: soundbiteSearchInputRef, onChange: setSoundbiteSearchQuery, onBlur: () => persistSoundbiteSearchQuery(), openKeyboard: focusSoundbiteSearchInput }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || soundbiteBusy || !payload || !soundbiteSearchQuery.trim(), onClick: () => { void searchSoundbites(); }, children: soundbiteBusy ? strings.searchingIidbSoundbites : strings.searchIidbSoundbites }),
            soundbiteMessage ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: soundbiteMessage }) : null,
            renderSoundbiteResults()
        ] }) }),
        SP_JSX.jsx(SettingsCard, { title: strings.downloadBackgrounds || strings.scrapers, description: strings.scrapersHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            scraperTabs([{ id: "playstation", label: "PlayStation" }, { id: "igdb", label: "IGDB" }, { id: "alphacoders", label: "AlphaCoders" }, { id: "nintendo", label: "Nintendo" }, { id: "xbox", label: "Xbox" }, { id: "iidb", label: "iiDB" }, { id: "steamgriddb", label: "SteamGridDB" }], activeScraper, (next) => { setActiveScraper(next); setFocusedScraper(""); setImageResults([]); setImageSearchMessage(""); setPlayStationMessage(""); }),
            scraperContent
        ] }) }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: "lc-close-button", onClick: () => { try { DFL.Navigation?.NavigateBack?.(); } catch (_error) {} }, children: strings.close || "Close" })
    ] });
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "launch-curtain-main lc-settings-page", style: { position: "relative", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        SP_JSX.jsx(LaunchCurtainPageStyles, {}),
        SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: pageStyle, children: pageContent }) })
    ] });
}
const LAUNCH_CURTAIN_MENU_KEY = "launch-curtain-game-settings";
const GAME_DETAIL_ROUTES = [
    "/library/app/:appid",
    "/library/details/:appid",
    "/library/:collection/app/:appid"
];
const DETAIL_PATTERNS = GAME_DETAIL_ROUTES.map((route) => {
    const pattern = route
        .replace(/\//g, "\\/")
        .replace(":collection", "[^\\/]+")
        .replace(":appid", "(\\d+)");
    return new RegExp(`^${pattern}`);
});
const normalizeMenuAppId = (value) => {
    const appId = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(appId) && appId > 0 ? appId : 0;
};
const getLibraryPath = () => {
    try {
        const focusedWindow = globalThis.window?.SteamUIStore?.GetFocusedWindowInstance?.() ?? DFL.Router?.WindowStore?.GamepadUIMainWindowInstance;
        const browserWindow = focusedWindow?.BrowserWindow ?? DFL.Router?.WindowStore?.GamepadUIMainWindowInstance?.BrowserWindow;
        return browserWindow?.location?.pathname ?? globalThis.window?.location?.pathname ?? "";
    }
    catch (_error) {
        return "";
    }
};
const readAppIdFromLibraryLocation = () => {
    const pathname = getLibraryPath();
    for (const pattern of DETAIL_PATTERNS) {
        const match = pathname.match(pattern);
        if (match?.[1]) {
            const appId = normalizeMenuAppId(match[1]);
            if (appId)
                return appId;
        }
    }
    return 0;
};
const extractAppId = (...candidates) => {
    for (const candidate of candidates) {
        if (typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0)
            return candidate;
        if (typeof candidate === "string") {
            const parsed = normalizeMenuAppId(candidate);
            if (parsed)
                return parsed;
        }
        if (candidate && typeof candidate === "object") {
            const possible = candidate.appid ?? candidate.app_id ?? candidate.unAppID ?? candidate.nAppID ?? candidate.id;
            const parsed = normalizeMenuAppId(possible);
            if (parsed)
                return parsed;
        }
    }
    return 0;
};
const extractAppIdFromTree = (node) => {
    if (!node)
        return 0;
    const candidate = extractAppId(node?.appid, node?.overview?.appid, node?._owner?.pendingProps?.overview?.appid, node?.props?.overview?.appid);
    if (candidate)
        return candidate;
    const children = node?.children ?? node?.props?.children;
    if (!children)
        return 0;
    if (Array.isArray(children)) {
        for (const child of children) {
            const result = extractAppIdFromTree(child);
            if (result)
                return result;
        }
        return 0;
    }
    return extractAppIdFromTree(children);
};
const coerceMenuChildren = (children) => {
    if (!children)
        return null;
    if (Array.isArray(children))
        return children;
    if (Array.isArray(children?.props?.children))
        return children.props.children;
    if (Array.isArray(children?.children))
        return children.children;
    return null;
};
const pruneLaunchCurtainMenu = (children) => {
    const list = coerceMenuChildren(children);
    if (!Array.isArray(list))
        return;
    const existing = list.findIndex((x) => x?.key === LAUNCH_CURTAIN_MENU_KEY);
    if (existing !== -1)
        list.splice(existing, 1);
};
const hasAppPropertiesAction = (items) => {
    if (!items?.length)
        return false;
    return !!DFL.findInReactTree(items, (node) => {
        const source = [
            node?.props?.onSelected,
            node?.props?.onClick,
            node?.onSelected,
            node?.onClick
        ].filter((handler) => typeof handler === "function").map((handler) => handler.toString()).join("\n");
        return source.includes("AppProperties") ||
            source.includes("ShowAppProperties");
    });
};
const isGameContextMenu = (items) => hasAppPropertiesAction(items);
const isLibraryAppContextMenu = (items) => {
    return hasAppPropertiesAction(items);
};
const deriveAppIdFromMenuItems = (items, fallback) => {
    if (!items?.length)
        return fallback || 0;
    const parent = items.find((entry) => entry?._owner?.pendingProps?.overview?.appid);
    const fromOwner = extractAppId(parent?._owner?.pendingProps?.overview?.appid);
    if (fromOwner)
        return fromOwner;
    const fromOverview = DFL.findInTree(items, (node) => node?.overview?.appid ?? node?.props?.overview?.appid, { walkable: ["props", "children", "_owner", "pendingProps"] });
    const overviewAppId = extractAppId(fromOverview?.overview?.appid, fromOverview?.props?.overview?.appid);
    if (overviewAppId)
        return overviewAppId;
    const foundAppNode = DFL.findInTree(items, (node) => node?.app?.appid ??
        node?.props?.app?.appid ??
        node?.appid ??
        node?.props?.appid ??
        node?.app_id ??
        node?.props?.app_id, { walkable: ["props", "children", "_owner", "pendingProps"] });
    const fromAppNode = extractAppId(foundAppNode?.app?.appid, foundAppNode?.props?.app?.appid, foundAppNode?.appid, foundAppNode?.props?.appid, foundAppNode?.app_id, foundAppNode?.props?.app_id);
    return fromAppNode || fallback || 0;
};
const insertLaunchCurtainMenu = (children, appId) => {
    const list = coerceMenuChildren(children);
    if (!Array.isArray(list) || !appId)
        return;
    pruneLaunchCurtainMenu(list);
    const propertiesMenuItemIdx = list.findIndex((item) => DFL.findInReactTree(item, (node) => {
        const handler = node?.onSelected ?? node?.props?.onSelected;
        return typeof handler === "function" && handler.toString().includes("AppProperties");
    }));
    const openLaunchCurtain = () => {
        const latestAppId = extractAppId(appId) || readAppIdFromLibraryLocation();
        if (!latestAppId) {
            toaster.toast({ title: "Launch Curtain", body: "Couldn't determine current game app id." });
            return;
        }
        DFL.Navigation.Navigate(`/launch-curtain/${latestAppId}`);
    };
    const menuItem = window.SP_REACT.createElement(DFL.MenuItem, { key: LAUNCH_CURTAIN_MENU_KEY, onSelected: openLaunchCurtain }, "Launch Curtain");
    if (propertiesMenuItemIdx >= 0)
        list.splice(propertiesMenuItemIdx, 0, menuItem);
    else
        list.push(menuItem);
};
const patchLaunchCurtainMenuItems = (menuItems, fallbackAppId) => {
    const entries = coerceMenuChildren(menuItems);
    if (!Array.isArray(entries) || !entries.length)
        return 0;
    if (!isGameContextMenu(entries) && !isLibraryAppContextMenu(entries))
        return 0;
    const derivedAppId = deriveAppIdFromMenuItems(entries, fallbackAppId);
    if (!derivedAppId)
        return 0;
    insertLaunchCurtainMenu(entries, derivedAppId);
    return derivedAppId;
};
const contextMenuPatch = (LibraryContextMenu) => {
    const patches = { unpatch: () => undefined, outer: null, inner: null };
    const state = { appId: 0 };
    const nestedPatches = Array();
    const patchedPrototypes = new WeakSet();
    patches.outer = DFL.afterPatch(LibraryContextMenu.prototype, "render", (_args, component) => {
        let appId = extractAppId(component?._owner?.pendingProps?.overview?.appid);
        try {
            if (!appId) {
                const foundApp = DFL.findInTree(component.props.children, (x) => x?.app?.appid, { walkable: ["props", "children"] });
                if (foundApp)
                    appId = extractAppId(foundApp.app.appid);
            }
        }
        catch (_error) {}
        if (appId)
            state.appId = appId;
        if (!patches.inner) {
            patches.inner = DFL.afterPatch(component, "type", (_unused, ret) => {
                const prototype = ret?.type?.prototype;
                if (!prototype || patchedPrototypes.has(prototype))
                    return ret;
                patchedPrototypes.add(prototype);
                if (typeof prototype.render === "function") {
                    nestedPatches.push(DFL.afterPatch(prototype, "render", (_args2, ret2) => {
                        const menuItems = ret2?.props?.children?.[0] ?? ret2?.props?.children;
                        try {
                            const routeAppId = readAppIdFromLibraryLocation();
                            const fallbackAppId = extractAppIdFromTree(ret2) || routeAppId;
                            const patched = patchLaunchCurtainMenuItems(menuItems, fallbackAppId);
                            if (patched)
                                state.appId = patched;
                        }
                        catch (_error) {}
                        return ret2;
                    }));
                }
                if (typeof prototype.shouldComponentUpdate === "function") {
                    nestedPatches.push(DFL.afterPatch(prototype, "shouldComponentUpdate", ([nextProps], shouldUpdate) => {
                        try {
                            if (shouldUpdate === true) {
                                const routeAppId = readAppIdFromLibraryLocation();
                                const fallbackAppId = extractAppIdFromTree(nextProps?.children) || routeAppId;
                                const patched = patchLaunchCurtainMenuItems(nextProps?.children, fallbackAppId);
                                if (patched)
                                    state.appId = patched;
                            }
                        }
                        catch (_error) {}
                        return shouldUpdate;
                    }));
                }
                return ret;
            });
        }
        else if (Array.isArray(component.props.children)) {
            const routeAppId = readAppIdFromLibraryLocation();
            const patched = patchLaunchCurtainMenuItems(component.props.children, appId || routeAppId);
            if (patched)
                state.appId = patched;
        }
        return component;
    });
    patches.unpatch = () => {
        nestedPatches.splice(0).forEach((patch) => patch?.unpatch?.());
        patches.outer?.unpatch?.();
        patches.inner?.unpatch?.();
    };
    return patches;
};
const installLaunchCurtainContextMenu = () => {
    try {
        const module = Object.values(DFL.findModuleByExport((e) => e?.toString?.().includes("().LibraryContextMenu"))).find((sibling) => sibling?.toString?.().includes("navigator:"));
        const LibraryContextMenu = DFL.fakeRenderComponent(module).type;
        return contextMenuPatch(LibraryContextMenu);
    }
    catch (error) {
        console.warn("Launch Curtain could not patch game context menu", error);
        return { unpatch: () => undefined };
    }
};
const runSilentStartupGameCacheRefresh = () => {
    let attempts = 0;
    const refresh = async () => {
        attempts += 1;
        try {
            const apps = collectSteamAppsForCache();
            if (!apps.length) {
                if (attempts < 4) {
                    window.setTimeout(refresh, 2500);
                }
                return;
            }
            await buildGameCache({ apps, silent: true, reason: "startup" });
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        }
        catch (error) {
            console.warn("Launch Curtain silent startup cache refresh failed", error);
        }
    };
    window.setTimeout(refresh, 2000);
};

const LAUNCH_CURTAIN_ROUTE = "/launch-curtain/:appid";
const LAUNCH_CURTAIN_EDITOR_ROUTE = "/launch-curtain/:appid/editor";





// Steam Controller / Steam Input close bridge. RegisterForControllerInputMessages
// only signals that input happened (it does not identify the button). The Steam
// Controller 2 is NOT visible to the browser Gamepad API, so if a web pad reports
// button B we honour B-only (Xbox pads); if NO web button is pressed but the Steam
// input event still fired, it is SC2 input and we treat it as a valid close.
function initSteamControllerClose() {
  try {
    const scaLog = callable("sca_input_diag");
    const S = (typeof SteamClient !== "undefined") ? SteamClient : (window && window.SteamClient);
    if (!S || !S.Input || typeof S.Input.RegisterForControllerInputMessages !== "function") {
      try { scaLog("RegisterForControllerInputMessages unavailable"); } catch (e) {}
      return function () {};
    }
    const registryKey = "__playhubLaunchCurtainControllerCleanup";
    try { if (typeof S.Input[registryKey] === "function") S.Input[registryKey](); } catch (e) {}
    const release = function (registration) {
      try {
        if (typeof registration === "function") registration();
        else if (registration) {
          if (typeof registration.Unregister === "function") registration.Unregister();
          else if (typeof registration.unregister === "function") registration.unregister();
          else if (typeof registration.Dispose === "function") registration.Dispose();
          else if (typeof registration.dispose === "function") registration.dispose();
        }
      } catch (e) {}
    };
    let curtainRunning = false, curtainSince = 0, lastDbg = 0;
    const statusTimer = window.setInterval(function () {
      try {
        Promise.resolve(getStatus()).then(function (st) {
          const running = !!(st && st.curtain_running);
          if (running && !curtainRunning) curtainSince = Date.now();
          curtainRunning = running;
        }).catch(function () {});
      } catch (e) {}
    }, 700);
    try { scaLog("SC2 close listener registered (status-gated)"); } catch (e) {}
    const registration = S.Input.RegisterForControllerInputMessages(function () {
      try {
        const h = playButtonHook;
        const now = Date.now();
        const instant = !!(h && h.instantCurtainVisible);
        const overlay = curtainRunning;
        const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
        const bPressed = pads.some((pad) => !!(pad && pad.buttons && pad.buttons[1] && pad.buttons[1].pressed));
        const anyPadButton = pads.some((pad) => pad && (pad.buttons || []).some((b) => b && b.pressed));
        const treatAsClose = bPressed || !anyPadButton;
        if ((instant || overlay) && now - lastDbg > 1500) {
          lastDbg = now;
          try { scaLog("SC2 input cover instant=" + instant + " overlay=" + overlay + " b=" + bPressed + " any=" + anyPadButton); } catch (e) {}
        }
        if (!treatAsClose) return;
        const overlayReady = overlay && (now - curtainSince >= 900);
        if (!instant && !overlayReady) return;
        if (instant && h && now < (h.gamepadCloseIgnoreUntil || 0)) return;
        try { scaLog("SC2 close triggered instant=" + instant + " overlay=" + overlayReady); } catch (e) {}
        if (h && typeof h.requestCloseAllCurtains === "function") h.requestCloseAllCurtains();
        else hideCurtain();
      } catch (e) {}
    });
    const cleanup = function () {
      window.clearInterval(statusTimer);
      release(registration);
      try { if (S.Input[registryKey] === cleanup) delete S.Input[registryKey]; } catch (e) {}
    };
    S.Input[registryKey] = cleanup;
    return cleanup;
  } catch (e) {}
  return function () {};
}



// Cattura e localizza le fasi GameAction che Steam espone durante il lancio.
function initLaunchInfo() {
  try {
    const setLaunchStatus = callable("set_launch_status");
    const scaLog = callable("sca_input_diag");
    const strings = getStrings();
    const A = (typeof SteamClient !== "undefined") ? SteamClient : (window && window.SteamClient);
    if (!A || !A.Apps) { try { scaLog("LAUNCHINFO no SteamClient.Apps"); } catch (e) {} return function () {}; }
    const registryKey = "__playhubLaunchCurtainLaunchInfoCleanup";
    try { if (typeof A.Apps[registryKey] === "function") A.Apps[registryKey](); } catch (e) {}
    const registrations = [];
    const keep = function (registration) {
      if (registration) registrations.push(registration);
      return registration;
    };
    const release = function (registration) {
      try {
        if (typeof registration === "function") registration();
        else if (registration) {
          if (typeof registration.Unregister === "function") registration.Unregister();
          else if (typeof registration.unregister === "function") registration.unregister();
          else if (typeof registration.Dispose === "function") registration.Dispose();
          else if (typeof registration.dispose === "function") registration.dispose();
        }
      } catch (e) {}
    };
    try { scaLog("LAUNCHINFO GameAction keys=" + Object.keys(A.Apps).filter(function (k) { return /GameAction/i.test(k); }).join(",")); } catch (e) {}
    let logged = 0;
    const dbg = function (t) { try { if (logged < 40) { logged++; scaLog(t); } } catch (e) {} };
    const send = function (t, phase) {
      const text = String(t == null ? "" : t);
      try { setLaunchStatus(phase ? { text, phase } : text); } catch (e) {}
      try { playButtonHook.setInstantStatus(text); } catch (e) {}
    };
    const humanize = function (s) {
      s = String(s == null ? "" : s).trim();
      if (!s) return "";
      s = s.replace(/[_\-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
      return s.charAt(0).toUpperCase() + s.slice(1);
    };
    const TASKMAP = {
      "Completed": strings.launchWaitingGame,
      "Done": strings.launchWaitingGame,
      "None": "",
      "Nothing": "",
      "Cancelled": "",
      "Cancelling": "",
      "Starting": strings.launchStarting,
      "CreatingProcess": strings.launchStarting,
      "CreatedProcess": strings.launchStarting,
      "LaunchApp": strings.launchStarting,
      "UpdatingAppTicket": strings.launchCheckingLicense,
      "SiteLicenseSeatCheckout": strings.launchCheckingLicense,
      "UpdatingDRM": strings.launchCheckingLicense,
      "CheckShaderDepotManifest": strings.launchCheckingFiles,
      "VerifyingFiles": strings.launchCheckingFiles,
      "RunningInstallScript": strings.launchInstallingComponents,
      "ProcessingInstallScript": strings.launchInstallingComponents,
      "InstallingRedistributables": strings.launchInstallingComponents,
      "SynchronizingCloud": strings.launchSyncingCloud,
      "SynchronizingStats": strings.launchSyncingStats,
      "SynchronizingControllerConfig": strings.launchSyncingController,
      "ShowInterstitials": strings.launchPreparing,
      "WaitingForOtherOperations": strings.launchDelayed,
      "WaitingForOtherApps": strings.launchDelayed,
      "DelayLaunch": strings.launchDelayed,
      "WaitingOnUserPrompts": strings.launchWaitingConfirmation,
      "WaitingGameWindow": strings.launchWaitingGame,
      "Updating": strings.launchUpdating
    };
    const onTask = function () {
      const args = Array.prototype.slice.call(arguments);
      dbg("GA_TASK " + JSON.stringify(args));
      let mapped = null;
      let textish = "";
      for (let i = 0; i < args.length; i++) {
        const value = args[i];
        if (typeof value !== "string") continue;
        if (Object.prototype.hasOwnProperty.call(TASKMAP, value)) mapped = TASKMAP[value];
        if (/[A-Za-z]/.test(value)) textish = value;
      }
      const completed = args.some(function (value) { return value === "Completed" || value === "Done"; });
      if (mapped !== null) send(mapped, completed ? "complete" : undefined);
      else if (textish) send(humanize(textish));
    };
    if (typeof A.Apps.RegisterForGameActionStart === "function") {
      keep(A.Apps.RegisterForGameActionStart(function () {
        dbg("GA_START " + JSON.stringify(Array.prototype.slice.call(arguments)));
        send(strings.launchStarting, "start");
      }));
    }
    if (typeof A.Apps.RegisterForGameActionTaskChange === "function") {
      keep(A.Apps.RegisterForGameActionTaskChange(onTask));
    }
    if (typeof A.Apps.RegisterForGameActionEnd === "function") {
      keep(A.Apps.RegisterForGameActionEnd(function () {
        dbg("GA_END " + JSON.stringify(Array.prototype.slice.call(arguments)));
        send(strings.launchWaitingGame, "complete");
      }));
    }
    if (typeof A.Apps.RegisterForGameActionShowError === "function") {
      keep(A.Apps.RegisterForGameActionShowError(function () {
        dbg("GA_ERR " + JSON.stringify(Array.prototype.slice.call(arguments)));
      }));
    }
    const cleanup = function () {
      registrations.splice(0).forEach(release);
      try { if (A.Apps[registryKey] === cleanup) delete A.Apps[registryKey]; } catch (e) {}
    };
    A.Apps[registryKey] = cleanup;
    return cleanup;
  } catch (e) {}
  return function () {};
}



const launchCurtainHookKey = "__playhubLaunchCurtainPlayHook";
try {
    const previousHook = globalThis[launchCurtainHookKey];
    if (previousHook && previousHook !== playButtonHook && typeof previousHook.cleanup === "function") {
        previousHook.cleanup();
    }
}
catch (error) {
    console.warn("Launch Curtain could not clean up the previous play hook", error);
}
globalThis[launchCurtainHookKey] = playButtonHook;

var index = definePlugin(() => {
    const menuPatch = installLaunchCurtainContextMenu();
    try {
        routerHook?.addRoute?.(LAUNCH_CURTAIN_ROUTE, () => SP_REACT.createElement(GameSettingsPage, null), { exact: true });
        routerHook?.addRoute?.(LAUNCH_CURTAIN_EDITOR_ROUTE, () => SP_REACT.createElement(LogoEditorPage, null), { exact: true });
    }
    catch (error) {
        console.warn("Launch Curtain could not add per-game route", error);
    }
    playButtonHook.setup();
    runSilentStartupGameCacheRefresh();
    const controllerCloseCleanup = initSteamControllerClose();
    const launchInfoCleanup = initLaunchInfo();
    void getSettings().then((settings) => {
        playButtonHook.setEnabled(Boolean(settings.auto_mode));
        playButtonHook.setSettingsCache(settings);
        playButtonHook.setLogoPath(settings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(settings.default_logo_path ?? "");
    }).catch((error) => {
        console.warn("Launch Curtain could not load initial settings", error);
    });
    return {
        name: "Launch Curtain",
        titleView: SP_JSX.jsxs("div", { className: DFL.staticClasses.Title, style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.45rem", width: "100%", marginLeft: "auto", paddingRight: 8 }, children: [SP_JSX.jsx(FaTheaterMasks, { size: 19 }), SP_JSX.jsx("span", { children: "Launch Curtain" })] }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaTheaterMasks, {}),
        alwaysRender: true,
        onDismount() {
            try { menuPatch?.unpatch?.(); } catch (error) { console.warn("Launch Curtain context menu unpatch failed", error); }
            try { routerHook?.removeRoute?.(LAUNCH_CURTAIN_EDITOR_ROUTE); } catch (error) { console.warn("Launch Curtain editor route remove failed", error); }
            try { routerHook?.removeRoute?.(LAUNCH_CURTAIN_ROUTE); } catch (error) { console.warn("Launch Curtain route remove failed", error); }
            try { controllerCloseCleanup?.(); } catch (error) { console.warn("Launch Curtain controller cleanup failed", error); }
            try { launchInfoCleanup?.(); } catch (error) { console.warn("Launch Curtain launch-info cleanup failed", error); }
            playButtonHook.cleanup();
            if (globalThis[launchCurtainHookKey] === playButtonHook) {
                delete globalThis[launchCurtainHookKey];
            }
            console.log("Launch Curtain unloaded");
        }
    };
});





export { index as default };
