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
const buildGameCache = callable("build_game_cache");
const cleanupUnusedLaunchImages = callable("cleanup_unused_launch_images");
const startAutoMode = callable("start_auto_mode");
const stopAutoMode = callable("stop_auto_mode");
const FILE_SELECTION_FILE = 0;



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
        maintenance: "Maintenance", refreshGameCache: "Refresh game cache", deleteUnusedImages: "Delete unused images",
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
        maintenance: "Manutenzione", refreshGameCache: "Aggiorna cache giochi", deleteUnusedImages: "Elimina immagini inutilizzate",
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
            logo_shadow_opacity: typeof raw.logo_shadow_opacity === "number" ? raw.logo_shadow_opacity : undefined,
            logo_shadow_blur: typeof raw.logo_shadow_blur === "number" ? raw.logo_shadow_blur : undefined,
            bg_zoom_enabled: typeof raw.bg_zoom_enabled === "boolean" ? raw.bg_zoom_enabled : ((this.settingsCache && this.settingsCache.bg_zoom_enabled) !== false),
            force_mode: (raw.force_mode === "classic" || raw.force_mode === "modern") ? raw.force_mode : "auto",
            timeout_enabled: typeof raw.timeout_enabled === "boolean" ? raw.timeout_enabled : undefined,
            timeout_seconds: typeof raw.timeout_seconds === "number" ? raw.timeout_seconds : undefined,
            exit_delay_seconds: typeof raw.exit_delay_seconds === "number" ? raw.exit_delay_seconds : undefined
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
        if (confirmedLaunch) {
            this.showNativeBlackCover(`${reason} confirmed black handoff`, CONFIRMED_LAUNCH_COVER_MS);
        }
        this.showInstantCurtain(appId, effectiveLogoSource, effectiveShortcut, gameSettings.show_logo !== false, confirmedLaunch ? Math.min(CONFIRMED_LAUNCH_COVER_MS, 4200) : PROBATION_COVER_MS);
        this.scheduleBackendLaunch(reason, appId, effectiveLogoSource, 0, effectiveShortcut, confirmedLaunch);
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
            void launchRequested(request).catch((error) => {
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
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; opacity: 0; z-index: 0; pointer-events: none;
          transition: opacity 550ms ease;
        }
        .launch-curtain-instant--art-visible .launch-curtain-instant__backdrop {
          opacity: var(--lc-backdrop-opacity, 1);
        }
        @keyframes launch-curtain-bg-zoom { from { transform: scale(1.06); } to { transform: scale(1); } }
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
    applyInstantBackdrop(appId) {
        const gs = this.gameSettingsForApp(appId);
        const cache = this.settingsCache || {};
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
        const on = this.gameSettingsForApp(appId).bg_zoom_enabled === true;
        for (const curtain of this.instantCurtains()) {
            const img = curtain.querySelector(".launch-curtain-instant__backdrop");
            if (!img) continue;
            if (!on) {
                img.classList.remove("launch-curtain-instant__backdrop--zoom");
                img.style.animationDelay = "";
                delete img.dataset.lcAnimationEpoch;
                continue;
            }
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
    startModernHandoffPoll() {
        this.stopModernHandoffPoll();
        this.modernHandoffArmed = false;
        const poll = () => {
            void getStatus().then((st) => {
                if (!this.instantCurtainVisible) { this.modernHandoffTimer = undefined; return; }
                this.syncModernCurtainSurfaces();
                if (st && st.modern_curtain_show === true) this.modernHandoffArmed = true;
                if (this.modernHandoffArmed && st && st.modern_curtain_show === false) {
                    this.dbg("handoff: hiding cover (game settled)");
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
        if (!wasVisible) {
            this.instantAnimationEpoch += 1;
            this.instantAnimationStartedAt = Date.now();
        }
        const curtains = this.instantCurtains();
        this.dbg("modern surfaces=" + curtains.length);
        for (const curtain of curtains) {
            curtain.ownerDocument?.documentElement?.classList?.add("launch-curtain-cursor-hidden");
            curtain.classList.remove("launch-curtain-instant--art-visible");
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
                curtain.classList.remove("launch-curtain-instant--art-visible");
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
        for (const curtain of curtains) {
            try {
                const statusTextEl = curtain.querySelector(".launch-curtain-instant__status-text");
                if (statusTextEl) statusTextEl.textContent = "";
                const spinEl = curtain.querySelector(".launch-curtain-instant__spin");
                if (spinEl) spinEl.style.display = "none";
                curtain.classList.remove("launch-curtain-instant--art-visible");
            }
            catch (e) {}
            curtain.style.transition = "";
            if (!modernHide) curtain.style.opacity = "0";
        }
        if (clearArtworkImmediately) {
            this.clearInstantArtwork();
        }
        if (modernHide) {
            // Transizione morbida curtain->gioco: i contenuti sfumano verso il NERO, breve
            // tenuta sul nero, poi il nero sfuma (a quel punto il gioco e' gia' in primo piano).
            window.setTimeout(() => {
                this.instantCurtains().forEach((c) => { c.style.transition = ""; c.style.opacity = "0"; });
            }, 480);
        }
        this.instantCurtainHideTimer = window.setTimeout(() => {
            this.instantCurtainHideTimer = undefined;
            if (this.instantCurtainVisible) {
                return;
            }
            curtains.forEach((curtain) => {
                curtain.style.visibility = "hidden";
                curtain.style.display = "none";
                curtain.ownerDocument?.documentElement?.classList?.remove("launch-curtain-cursor-hidden");
            });
            this.clearInstantArtwork();
        }, modernHide ? 1320 : 760);
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
      .lc-settings-page .lc-close-button { width: 100%; margin: 8px 0 0; }
      .lc-editor-page .lc-card { margin: 0; }
      .lc-editor-page .lc-editor-layout { display: grid; grid-template-columns: minmax(0,1fr) 410px; gap: 16px; align-items: center; width: 100%; min-width: 0; }
      .lc-editor-page .lc-editor-preview { position: relative; width: 100%; min-width: 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 9px; background: #000; border: 1px solid rgba(255,255,255,.14); box-sizing: border-box; }
      .lc-editor-page .lc-editor-preview__backdrop { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .lc-editor-page .lc-editor-preview__logo { position: absolute; width: 42%; max-height: 20%; object-fit: contain; transform-origin: center center; }
      .lc-editor-page .lc-editor-controls { width: 410px; max-width: 410px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
      .lc-editor-page .lc-editor-button-row { display: flex; gap: 8px; justify-content: stretch; min-width: 0; }
      .lc-editor-page .lc-editor-button-row > * { flex: 1 1 0; min-width: 0 !important; }
      .lc-editor-page .lc-editor-button-row--center > * { flex: 0 1 100%; }
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
    return SP_JSX.jsx(DFL.DialogButton, { ...props, className: `lcQamButton${props.className ? ` ${props.className}` : ""}`, children: SP_JSX.jsxs("span", { className: "lcQamButtonInner", children: [icon, SP_JSX.jsx("span", { children })] }) });
}
function notify(result, strings) {
    toaster.toast({
        title: result.ok ? strings.toastTitle : strings.toastAttention,
        body: result.message
    });
}
function Content() {
    const strings = getStrings();
    const [settings, setSettings] = SP_REACT.useState(undefined);
    const [, setStatus] = SP_REACT.useState(undefined);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [playStationBulkStatus, setPlayStationBulkStatus] = SP_REACT.useState(undefined);
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
            for (let index = 0; index < games.length; index += 1) {
                const game = games[index];
                setPlayStationBulkStatus({ title: game.title, current: index + 1, total: games.length, remove });
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
          .lcQamCard [class*="PanelSectionRow"]{width:100%!important;max-width:100%!important;padding-left:0!important;padding-right:0!important}
          .lcQamCard [class*="Dropdown"]{max-width:100%!important}
          .lcQamDropdownBlock{display:flex;flex-direction:column;gap:7px;width:100%;padding:8px 0 10px}
          .lcQamDropdownLabel{font-size:14px;line-height:18px;color:#fff}
          .lcQamDropdownControl,.lcQamDropdownControl>div,.lcQamDropdownControl [role="combobox"]{width:100%!important;max-width:100%!important}
          .lcQamHelp{margin:3px 2px 8px;font-size:12px;line-height:1.35;opacity:.57;overflow-wrap:anywhere}
          .lcQamMeta{margin:0 2px 10px;font-size:12px;line-height:1.35;opacity:.58;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .lcQamDivider{height:1px;margin:10px 0;background:rgba(255,255,255,.07)}
          .lcQamButton{width:100%!important;min-height:38px!important;padding:0 10px!important;border-radius:5px!important;color:#fff!important;font-size:14px!important}
          .lcQamButtonInner{display:grid;grid-template-columns:18px minmax(0,1fr);align-items:center;gap:9px;width:100%;text-align:left}
          .lcQamButtonInner svg{width:15px;height:15px;justify-self:center}
          .lcQamButton:hover,.lcQamButton:focus,.lcQamButton.gpfocus{background:rgba(240,180,41,.16)!important;color:#fff!important;border-color:rgba(240,180,41,.92)!important;box-shadow:0 0 0 2px rgba(240,180,41,.22)!important}
          .lcQamButton:hover *,.lcQamButton:focus *,.lcQamButton.gpfocus *{color:inherit!important}
          .lcQamButton:disabled{opacity:.35!important}
          .lcQamButtonStack{display:grid;gap:7px}
          .lcQamStatus{padding:9px 10px;margin-bottom:8px;border-radius:5px;background:rgba(240,180,41,.09);font-size:12px;line-height:1.35}
        ` }),
        SP_JSX.jsx(QamSectionHeading, { icon: SP_JSX.jsx(FaRocket, {}), children: strings.automation }),
        SP_JSX.jsxs("section", { className: "lcQamCard", children: [
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamDropdownBlock", children: [
                SP_JSX.jsx("div", { className: "lcQamDropdownLabel", children: strings.launchMode ?? I18N.en.launchMode ?? "Launch mode" }),
                SP_JSX.jsx("div", { className: "lcQamDropdownControl", children: SP_JSX.jsx(DFL.Dropdown, { menuLabel: strings.launchMode ?? I18N.en.launchMode ?? "Launch mode", rgOptions: curtainModeOptions, selectedOption: selectedCurtainMode, disabled: busy || !settings, onChange: (option) => { if (typeof option.data === "string") void setCurtainMode(option.data); } }) })
            ] }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.launchInfo ?? I18N.en.launchInfo ?? "Launch info", checked: Boolean(settings?.show_launch_info), disabled: busy || !settings, onChange: (checked) => { void setShowLaunchInfo(checked); } }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.timeoutEnabled ?? I18N.en.timeoutEnabled ?? "Enable timeout", checked: settings?.timeout_enabled ?? false, disabled: busy || !settings, onChange: (checked) => { void setTimeoutEnabled(checked); } }),
            SP_JSX.jsx("div", { className: "lcQamHelp", children: (settings?.timeout_enabled ?? false) ? (strings.timeoutHelp ?? I18N.en.timeoutHelp ?? "How long the launch screen can stay visible while waiting for the game to become fullscreen.") : (strings.timeoutDisabledHelp ?? I18N.en.timeoutDisabledHelp ?? "When disabled, the launch screen hides only after fullscreen detection or manual close.") }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.timeout, rgOptions: timeoutOptions, selectedOption: selectedTimeout, disabled: busy || !settings || !(settings.timeout_enabled ?? false), onChange: (option) => { if (typeof option.data === "number") void setTimeoutValue(option.data); } }),
            SP_JSX.jsx("div", { className: "lcQamHelp", children: strings.exitDelayHelp ?? I18N.en.exitDelayHelp ?? "How long Launch Curtain stays visible after detecting that the game is ready." }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay ?? I18N.en.exitDelay ?? "Exit delay", rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !settings, onChange: (option) => { if (typeof option.data === "number") void setExitDelayValue(option.data); } }),
            playStationBulkStatus ? SP_JSX.jsxs("div", { className: "lcQamStatus", children: [`${playStationBulkStatus.remove ? strings.removingPlayStationAssets : strings.downloadingPlayStationAssets} (${playStationBulkStatus.current}/${playStationBulkStatus.total})`, SP_JSX.jsx("div", { style: { marginTop: 3, fontWeight: 700 }, children: playStationBulkStatus.title })] }) : null,
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", className: "lcQamButtonStack", children: [
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaDownload, {}), disabled: busy || !settings, onClick: () => { void runPlayStationBulk(false); }, children: strings.downloadPlayStationAssetsInstalled }),
                SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => { void runPlayStationBulk(true); }, children: strings.removePlayStationAssets })
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
            SP_JSX.jsx(QamButton, { icon: SP_JSX.jsx(FaTrashAlt, {}), disabled: busy || !settings, onClick: () => { void cleanupLaunchImages(); }, children: strings.deleteUnusedImages })
        ] }) })
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
function SearchQuerySteamField({ label, value, disabled, placeholder, inputRef, onChange, onBlur, openKeyboard }) {
    const NativeTextField = nativeTextFieldComponent();
    const handleChange = (eventOrValue) => onChange(textValueFromChange(eventOrValue));
    if (NativeTextField) {
        return SP_JSX.jsx(NativeTextField, { label: label, value: value, disabled: disabled, placeholder: placeholder, focusable: true, ref: inputRef, onChange: handleChange, onBlur: onBlur, onFocus: () => {}, onClick: openKeyboard, onOKButton: openKeyboard, onSubmit: openKeyboard });
    }
    return SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }, children: [
        SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: label }),
        SP_JSX.jsx(DFL.Focusable, { focusable: true, "flow-children": "row", noFocusRing: false, onClick: openKeyboard, onPointerDown: openKeyboard, onOKButton: openKeyboard, onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openKeyboard();
                }
            }, style: { width: "100%" }, children: SP_JSX.jsx("input", { ref: inputRef, tabIndex: 0, value: value, disabled: disabled, placeholder: placeholder, inputMode: "text", onFocus: () => {}, onClick: openKeyboard, onPointerDown: openKeyboard, onChange: handleChange, onBlur: onBlur, style: {
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
function LogoEditorSurface({ backdropPath, logoSource, fallbackLogoPath, initial, onSave, onClose, strings }) {
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Math.round(Number(value))));
    const [draft, setDraft] = SP_REACT.useState({
        logo_position_x: clamp(initial?.logo_position_x ?? 50, 0, 100),
        logo_position_y: clamp(initial?.logo_position_y ?? 50, 0, 100),
        logo_scale: clamp(initial?.logo_scale ?? 100, 50, 200),
        background_opacity: clamp(initial?.background_opacity ?? 100, 0, 100),
        logo_shadow_opacity: clamp(initial?.logo_shadow_opacity ?? 0, 0, 100),
        logo_shadow_blur: clamp(initial?.logo_shadow_blur ?? 40, 0, 100)
    });
    const draftRef = SP_REACT.useRef(draft);
    const closingRef = SP_REACT.useRef(false);
    const [backdropUrl, setBackdropUrl] = SP_REACT.useState("");
    const [logoUrl, setLogoUrl] = SP_REACT.useState("");
    const [saving, setSaving] = SP_REACT.useState(false);
    const updateDraft = (partial) => setDraft((current) => {
        const next = { ...current, ...partial };
        draftRef.current = next;
        return next;
    });
    SP_REACT.useEffect(() => {
        draftRef.current = draft;
    }, [draft]);
    SP_REACT.useEffect(() => () => {
        if (!closingRef.current) {
            closingRef.current = true;
            void onSave(draftRef.current).catch((error) => console.warn("Launch Curtain editor unmount autosave failed", error));
        }
    }, []);
    const move = (dx, dy) => updateDraft({
        logo_position_x: clamp(draftRef.current.logo_position_x + dx, 0, 100),
        logo_position_y: clamp(draftRef.current.logo_position_y + dy, 0, 100)
    });
    const resize = (delta) => updateDraft({ logo_scale: clamp(draftRef.current.logo_scale + delta, 50, 200) });
    const reset = () => updateDraft({ logo_position_x: 50, logo_position_y: 50, logo_scale: 100 });
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
                    getImagePreview({ source: logoSource || "", fallback: fallbackLogoPath || "" })
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
                    setLogoUrl(logoSource ? playButtonHook.normalizeLogoSource(logoSource) : toFileUrlForUi(fallbackLogoPath || ""));
                }
            }
        };
        void loadPreview();
        return () => { cancelled = true; };
    }, [backdropPath, logoSource, fallbackLogoPath]);
    const handlePreviewKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp": event.preventDefault(); move(0, -1); break;
            case "ArrowDown": event.preventDefault(); move(0, 1); break;
            case "ArrowLeft": event.preventDefault(); move(-1, 0); break;
            case "ArrowRight": event.preventDefault(); move(1, 0); break;
            default: break;
        }
    };
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "launch-curtain-main lc-settings-page lc-editor-page", style: { position: "relative", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        SP_JSX.jsx(LaunchCurtainPageStyles, {}),
        SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: editorPageStyle, children: [
            SP_JSX.jsx(SettingsCard, { title: strings.editorTitle, children: SP_JSX.jsxs("div", { className: "lc-editor-layout", children: [
                SP_JSX.jsx("div", { className: "lc-editor-preview", "aria-hidden": true, style: { pointerEvents: "none" }, children: [
                    backdropUrl ? SP_JSX.jsx("img", { src: backdropUrl, className: "lc-editor-preview__backdrop", style: { opacity: draft.background_opacity / 100 } }) : null,
                    logoUrl ? SP_JSX.jsx("img", { src: logoUrl, className: "lc-editor-preview__logo", style: {
                        left: `${draft.logo_position_x}%`,
                        top: `${draft.logo_position_y}%`,
                        transform: `translate(-50%, -50%) scale(${draft.logo_scale / 100})`,
                        filter: logoShadowFilter(draft.logo_shadow_opacity, draft.logo_shadow_blur, 0.32)
                    } }) : null
                ] }),
                SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "lc-editor-controls", children: [
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.backgroundOpacity, rgOptions: backgroundOpacityOptions, selectedOption: draft.background_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ background_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowOpacity, rgOptions: logoShadowOpacityOptions, selectedOption: draft.logo_shadow_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ logo_shadow_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowBlur ?? "Blur ombra del logo", rgOptions: logoShadowBlurOptions, selectedOption: draft.logo_shadow_blur, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ logo_shadow_blur: value }); } }),
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
        }).finally(() => {
            if (!cancelled)
                setBusy(false);
        });
        return () => {
            cancelled = true;
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
            const result = await searchGoogleImages({ title, query, resolution: imageResolution, services: selectedServices });
            const results = Array.isArray(result.results) ? result.results : [];
            setImageResults(results);
            setSelectedImageId(results[0]?.id || results[0]?.image_url || "");
            setImageSearchMessage(results.length ? strings.imagesFound : strings.noImagesFound);
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
            const next = await downloadGoogleImage({ app_id: appId, title, resolution: image?.resolution || imageResolution, image_url: imageUrl });
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
    const openLogoPlacement = () => {
        DFL.Navigation?.Navigate?.(`/launch-curtain/${appId}/editor`);
    };
    if (!appId) {
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.noGameSelected }) });
    }
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === (raw.exit_delay_seconds ?? resolved.exit_delay_seconds)) ? (raw.exit_delay_seconds ?? resolved.exit_delay_seconds) : (payload?.global_exit_delay_seconds ?? 3);
    const renderBackgroundResults = (results, loading = false) => results.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-results-grid", children: results.map((result) => {
        const resultId = result.id || result.image_url;
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, onFocus: () => setSelectedImageId(resultId), className: "lc-background-result", style: { ...wallpaperResultRowStyle, border: selectedImageId === resultId ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border }, children: [
            SP_JSX.jsx("img", { src: result.thumbnail_url || result.preview_url || result.image_url, onError: (event) => fallbackWallpaperPreview(event, result), style: wallpaperPreviewStyle }),
            SP_JSX.jsxs("div", { style: { minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 4 }, children: [
                SP_JSX.jsx("div", { style: { fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.source || strings.background }),
                SP_JSX.jsx("span", { style: { fontSize: 12, opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.resolution || result.size || (result.width && result.height ? `${result.width}x${result.height}` : imageResolution) })
            ] }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || loading, onClick: () => { void downloadImage(result); }, style: { width: "100%", minWidth: "7.25rem", maxWidth: "9rem" }, children: strings.download })
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
        SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: imageSearchQuery, disabled: busy || imageSearchBusy || !payload, placeholder: defaultSearchQuery || strings.gameWallpaper, inputRef: searchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusSearchInput }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || imageSearchBusy || !payload || /^App \d+$/i.test(gameTitle) || !imageSearchQuery.trim(), onClick: () => { void searchImages(); }, children: imageSearchBusy ? strings.searching : strings.search }),
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
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload || resolved.show_logo === false, onClick: openLogoPlacement, children: strings.openEditor }),
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
        SP_JSX.jsx(SettingsCard, { title: strings.downloadBackgrounds || strings.scrapers, description: strings.scrapersHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            scraperTabs([{ id: "playstation", label: "PlayStation" }, { id: "igdb", label: "IGDB" }, { id: "alphacoders", label: "AlphaCoders" }, { id: "nintendo", label: "Nintendo" }, { id: "xbox", label: "Xbox" }], activeScraper, (next) => { setActiveScraper(next); setFocusedScraper(""); setImageResults([]); setImageSearchMessage(""); setPlayStationMessage(""); }),
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
const isGameContextMenu = (items) => {
    if (!items?.length)
        return false;
    return !!DFL.findInReactTree(items, (node) => {
        const source = [
            node?.props?.onSelected,
            node?.props?.onClick,
            node?.onSelected,
            node?.onClick
        ].filter((handler) => typeof handler === "function").map((handler) => handler.toString()).join("\n");
        return source.includes("launchSource") ||
            source.includes("PlayGame") ||
            source.includes("Launch") ||
            source.includes("AppProperties") ||
            source.includes("ShowAppProperties");
    });
};
const isLibraryAppContextMenu = (items) => {
    if (!items?.length)
        return false;
    return !!DFL.findInReactTree(items, (node) => {
        const source = [
            node?.props?.onSelected,
            node?.props?.onClick,
            node?.onSelected,
            node?.onClick
        ].filter((handler) => typeof handler === "function").map((handler) => handler.toString()).join("\n");
        if (!source)
            return false;
        return source.includes("launchSource") ||
            source.includes("AppProperties") ||
            source.includes("ShowAppProperties") ||
            source.includes("InstallApp") ||
            source.includes("Download");
    });
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
    const patches = { unpatch: () => undefined };
    const state = { appId: 0 };
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
                DFL.afterPatch(ret.type.prototype, "render", (_args2, ret2) => {
                    const menuItems = ret2?.props?.children?.[0] ?? ret2?.props?.children;
                    try {
                        const fallbackAppId = extractAppIdFromTree(ret2) || state.appId;
                        const patched = patchLaunchCurtainMenuItems(menuItems, fallbackAppId);
                        if (patched)
                            state.appId = patched;
                    }
                    catch (_error) {}
                    return ret2;
                });
                DFL.afterPatch(ret.type.prototype, "shouldComponentUpdate", ([nextProps], shouldUpdate) => {
                    try {
                        if (shouldUpdate === true) {
                            const fallbackAppId = extractAppIdFromTree(nextProps?.children) || state.appId;
                            const patched = patchLaunchCurtainMenuItems(nextProps?.children, fallbackAppId);
                            if (patched)
                                state.appId = patched;
                        }
                    }
                    catch (_error) {}
                    return shouldUpdate;
                });
                return ret;
            });
        }
        else if (Array.isArray(component.props.children)) {
            const patched = patchLaunchCurtainMenuItems(component.props.children, appId || state.appId);
            if (patched)
                state.appId = patched;
        }
        return component;
    });
    patches.unpatch = () => { patches.outer?.unpatch?.(); patches.inner?.unpatch?.(); };
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
