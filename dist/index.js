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

const getSettings = callable("get_settings");
const saveSettings = callable("save_settings");
const getStatus = callable("get_status");
const hideCurtain = callable("hide_curtain");
const showBlackCover = callable("show_black_cover");
const hideBlackCover = callable("hide_black_cover");
const launchRequested = callable("launch_requested");
const resolveGameLogo = callable("resolve_game_logo");
const getGameSettings = callable("get_game_settings");
const saveGameSettings = callable("save_game_settings");
const resetGameSettings = callable("reset_game_settings");
const validateLaunchImagePath = callable("validate_launch_image_path");
const getImagePreview = callable("get_image_preview");
const searchGoogleImages = callable("search_google_images");
const downloadGoogleImage = callable("download_google_image");
const buildGameCache = callable("build_game_cache");
const cleanupUnusedLaunchImages = callable("cleanup_unused_launch_images");
const startAutoMode = callable("start_auto_mode");
const stopAutoMode = callable("stop_auto_mode");
const FILE_SELECTION_FILE = 0;
const I18N = {
    en: {
        curtain: "Curtain",
        automation: "Settings",
        timeout: "Timeout",
        foreground: "Foreground",
        showCurtain: "Show curtain",
        hideCurtain: "Hide curtain",
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
    return I18N[getLocaleKey()] ?? I18N.en;
}
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
const POST_PLAY_CONFIRM_PATTERN = /(play|launch|start|run|continue|accept|agree|ok|yes|gioca|avvia|continua|accetta|conferma|esegui|exe|configuration|configurazione|config|controller|keyboard|tastiera|terms|license|licenza|eula)/i;
class PlayButtonLaunchHook {
    constructor() {
        this.enabled = false;
        this.setupDone = false;
        this.lastTriggerAt = 0;
        this.lastNativeBlackCoverAt = 0;
        this.postPlayCoverUntil = 0;
        this.postPlayCoverReadyAt = 0;
        this.lastPostPlayCoverAt = 0;
        this.methodRestorers = [];
        this.instantCurtainExpiresAt = 0;
        this.instantCurtainVisible = false;
        this.backendLaunchToken = 0;
        this.prearmLogoToken = 0;
        this.gamepadClosePressed = false;
        this.gamepadLaunchPressed = false;
        this.gamepadCloseIgnoreUntil = 0;
        this.logoPath = "";
        this.defaultLogoPath = "";
        this.settingsCache = {};
        this.handlePointerDown = (event) => {
            this.coverPostPlayInteraction("post-play pointerdown", event.target, event.composedPath());
            this.handleLaunchInput("play button pointerdown", event.target, event.composedPath());
        };
        this.handleMouseDown = (event) => {
            this.coverPostPlayInteraction("post-play mousedown", event.target, event.composedPath());
            this.handleLaunchInput("play button mousedown", event.target, event.composedPath());
        };
        this.handleTouchStart = (event) => {
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
            this.handleLaunchInput("play button click", event.target, event.composedPath());
        };
        this.handleKeyDown = (event) => {
            if (event.key === "Escape" && this.instantCurtainVisible) {
                event.preventDefault();
                event.stopPropagation();
                this.requestCloseAllCurtains();
                return;
            }
            if (!["Enter", " "].includes(event.key)) {
                return;
            }
            this.coverPostPlayInteraction("post-play keydown", document.activeElement, []);
            if (this.isPlayButtonEvent(document.activeElement, [])) {
                this.handleLaunchInput("play button keydown", document.activeElement, []);
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
        this.setupDone = true;
        this.ensureInstantCurtainPrepared();
        document.addEventListener("pointerdown", this.handlePointerDown, true);
        document.addEventListener("mousedown", this.handleMouseDown, true);
        document.addEventListener("touchstart", this.handleTouchStart, true);
        document.addEventListener("pointerover", this.handlePointerOver, true);
        document.addEventListener("focusin", this.handleFocusIn, true);
        document.addEventListener("click", this.handleClick, true);
        document.addEventListener("keydown", this.handleKeyDown, true);
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        window.addEventListener("focus", this.handleWindowFocus);
        this.patchSteamClient();
        this.startGamepadLaunchPolling();
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
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        window.removeEventListener("focus", this.handleWindowFocus);
        this.restoreMethodPatches();
        this.stopGamepadLaunchPolling();
        this.hideInstantCurtain();
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
        this.preloadLogo(this.fallbackLogoUrl());
        this.refreshPreparedFallback();
    }
    setDefaultLogoPath(path) {
        this.defaultLogoPath = path;
        this.preloadLogo(this.fallbackLogoUrl());
        this.refreshPreparedFallback();
    }
    setSettingsCache(settings) {
        this.settingsCache = settings || {};
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
        if (!this.enabled || this.instantCurtainVisible || !this.isPlayButtonEvent(target, composedPath)) {
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
            if (!(item instanceof HTMLElement)) {
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
        let current = target instanceof HTMLElement ? target : null;
        while (current && path.length < 10) {
            path.push(current);
            current = current.parentElement;
        }
        return path;
    }
    isExactPlayButton(element) {
        if (this.hasBlockedContext(element)) {
            return false;
        }
        const labels = this.getLabels(element);
        return labels.some((label) => {
            const normalized = this.normalizeLabel(label);
            if (BLOCKED_PLAY_LABEL_HINTS.test(label)) {
                return false;
            }
            return PLAY_LABELS.has(normalized)
                || Array.from(PLAY_LABELS).some((playLabel) => normalized.startsWith(`${playLabel} `));
        });
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
            if (!(item instanceof HTMLElement)) {
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
        return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`;
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
            isShortcut ? undefined : this.steamLogoUrl(appId)
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
    fallbackLogoUrl() {
        return this.toFileUrl(this.logoPath) || this.toFileUrl(this.defaultLogoPath);
    }
    normalizeLogoSource(source) {
        if (/^https?:\/\//i.test(source) || source.startsWith("file://")) {
            return source;
        }
        return this.toFileUrl(source) || source;
    }
    trigger(reason, appId, logoSource, confirmedLaunch = false, isShortcut = false) {
        if (!this.enabled) {
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
            const initialLogoSource = logoSource || (isShortcut ? undefined : this.steamLogoUrl(appId));
            if (delayMs <= 0) {
                run(initialLogoSource);
            }
            else {
                this.backendLaunchTimer = window.setTimeout(() => run(initialLogoSource), delayMs);
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
    showInstantLaunchSurface() {
        this.showNativeBlackCover("SteamClient immediate black cover", LAUNCH_BRIDGE_COVER_MS);
        this.revealInstantCurtain(PROBATION_COVER_MS);
    }
    showNativeBlackCover(reason, ttlMs = PROBATION_COVER_MS) {
        if (!this.enabled) {
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
        if (this.instantCurtainVisible || now - this.lastPostPlayCoverAt < 550) {
            return false;
        }
        if (!this.isPostPlayConfirmCandidate(target, composedPath)) {
            return false;
        }
        this.lastPostPlayCoverAt = now;
        this.showNativeBlackCover(reason, POST_PLAY_CONFIRM_COVER_MS);
        this.revealInstantCurtain(POST_PLAY_CONFIRM_COVER_MS);
        return true;
    }
    isPostPlayConfirmCandidate(target, composedPath) {
        const candidates = this.getCandidateElements(target, composedPath);
        if (candidates.length <= 0) {
            return false;
        }
        return candidates.some((element) => {
            const labels = this.getLabels(element).join(" ");
            if (POST_PLAY_CONFIRM_PATTERN.test(labels)) {
                return true;
            }
            const promptAncestor = element.closest?.('[role="dialog"], [aria-modal="true"], [class*="Modal"], [class*="modal"], [class*="Dialog"], [class*="dialog"], [class*="Popup"], [class*="popup"]');
            if (!(promptAncestor instanceof HTMLElement)) {
                return false;
            }
            const rect = promptAncestor.getBoundingClientRect();
            const text = (promptAncestor.innerText || promptAncestor.textContent || "").replace(/\s+/g, " ").trim();
            return rect.width >= 260 && rect.height >= 120 && (POST_PLAY_CONFIRM_PATTERN.test(text) || text.length >= 10);
        });
    }
    patchSteamClient() {
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
        const original = apps[methodName];
        if (typeof original !== "function") {
            return;
        }
        const originalFn = original;
        const wrapped = function (...args) {
            playButtonHook.showInstantLaunchSurface();
            const appId = playButtonHook.extractAppIdFromUnknown(args);
            playButtonHook.trigger(`SteamClient.Apps.${methodName}`, appId, undefined, true, methodName === "RunShortcut");
            return originalFn.apply(this, args);
        };
        try {
            apps[methodName] = wrapped;
            this.methodRestorers.push(() => {
                if (apps[methodName] === wrapped) {
                    apps[methodName] = original;
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
    ensureInstantCurtainPrepared() {
        if (this.instantCurtainElement?.isConnected) {
            return this.instantCurtainElement;
        }
        const curtain = document.createElement("div");
        curtain.className = "launch-curtain-instant";
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
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          cursor: none;
          transition: opacity 500ms ease;
          will-change: opacity;
          contain: layout paint style;
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
        }
        .launch-curtain-instant__fallback-logo {
          display: none;
        }
        .launch-curtain-instant__fallback-logo--visible {
          display: block;
        }
        .launch-curtain-instant__fallback-logo-image {
          display: block;
        }
      </style>
      <div class="launch-curtain-instant__stack">
        <div class="launch-curtain-instant__logo-slot">
          ${this.logoMarkup(this.fallbackLogoUrl())}
        </div>
      </div>
    `;
        document.documentElement.appendChild(curtain);
        this.instantCurtainElement = curtain;
        this.wireInstantLogoFallback(curtain);
        this.preloadLogo(this.fallbackLogoUrl());
        return curtain;
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
        this.applyInstantLogoPlacement(this.gameSettingsForApp(appId));
        if (!showLogo) {
            this.setInstantCurtainLogo("", false);
            return;
        }
        const fallbackLogo = isShortcut ? this.fallbackLogoUrl() : this.steamLogoUrl(appId);
        this.setInstantCurtainLogo(logoSource || fallbackLogo, true);
        const token = ++this.prearmLogoToken;
        void this.resolveGameLogoSource(appId, logoSource, isShortcut).then((resolvedLogoSource) => {
            if (token !== this.prearmLogoToken
                || this.instantCurtainVisible
                || this.prearmedInstantAppId !== appId
                || !resolvedLogoSource) {
                return;
            }
            this.setInstantCurtainLogo(resolvedLogoSource);
        }).catch((error) => {
            console.warn("Launch Curtain prearm logo lookup failed", error);
        });
    }
    showInstantCurtain(appId, logoSource, isShortcut = false, showLogo = true, durationMs = PROBATION_COVER_MS) {
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
        const curtain = this.ensureInstantCurtainPrepared();
        const stack = curtain.querySelector(".launch-curtain-instant__stack");
        if (!stack) {
            return;
        }
        const x = Math.max(0, Math.min(100, Number(settings.logo_position_x ?? 50)));
        const y = Math.max(0, Math.min(100, Number(settings.logo_position_y ?? 50)));
        const scale = Math.max(50, Math.min(200, Number(settings.logo_scale ?? 100))) / 100;
        stack.style.left = `${x}%`;
        stack.style.top = `${y}%`;
        stack.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    revealInstantCurtain(durationMs = PROBATION_COVER_MS) {
        if (!this.enabled) {
            return;
        }
        const curtain = this.ensureInstantCurtainPrepared();
        if (this.instantCurtainHideTimer !== undefined) {
            window.clearTimeout(this.instantCurtainHideTimer);
            this.instantCurtainHideTimer = undefined;
        }
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
        }
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        this.instantCurtainVisible = true;
        document.documentElement.classList.add("launch-curtain-cursor-hidden");
        curtain.style.transition = "none";
        curtain.style.visibility = "visible";
        curtain.style.opacity = "1";
        curtain.getBoundingClientRect();
        this.instantCurtainTransitionFrame = window.requestAnimationFrame(() => {
            this.instantCurtainTransitionFrame = undefined;
            curtain.style.transition = "";
        });
        const safeDurationMs = Math.max(600, Math.min(4200, Number(durationMs) || PROBATION_COVER_MS));
        this.instantCurtainExpiresAt = Date.now() + safeDurationMs;
        this.instantCurtainTimer = window.setTimeout(() => this.hideInstantCurtain(), safeDurationMs);
        this.startGamepadClosePolling();
    }
    hideExpiredInstantCurtain() {
        if (this.instantCurtainVisible && this.instantCurtainExpiresAt > 0 && Date.now() >= this.instantCurtainExpiresAt) {
            this.hideInstantCurtain();
        }
    }
    hideInstantCurtain() {
        if (this.instantCurtainTimer !== undefined) {
            window.clearTimeout(this.instantCurtainTimer);
            this.instantCurtainTimer = undefined;
        }
        this.stopGamepadClosePolling();
        if (this.instantCurtainTransitionFrame !== undefined) {
            window.cancelAnimationFrame(this.instantCurtainTransitionFrame);
            this.instantCurtainTransitionFrame = undefined;
        }
        this.instantCurtainExpiresAt = 0;
        this.activeInstantAppId = undefined;
        this.prearmedInstantAppId = undefined;
        this.prearmLogoToken += 1;
        this.lastTriggerAt = 0;
        const curtain = this.instantCurtainElement;
        if (!curtain || !this.instantCurtainVisible) {
            document.documentElement.classList.remove("launch-curtain-cursor-hidden");
            return;
        }
        this.instantCurtainVisible = false;
        curtain.style.transition = "";
        curtain.style.opacity = "0";
        this.instantCurtainHideTimer = window.setTimeout(() => {
            this.instantCurtainHideTimer = undefined;
            if (this.instantCurtainVisible) {
                return;
            }
            curtain.style.visibility = "hidden";
            document.documentElement.classList.remove("launch-curtain-cursor-hidden");
            this.refreshPreparedFallback();
        }, 550);
    }
    destroyInstantCurtain() {
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
        document.documentElement.classList.remove("launch-curtain-cursor-hidden");
        this.instantCurtainElement?.remove();
        this.instantCurtainElement = undefined;
        this.instantCurtainVisible = false;
        this.activeInstantAppId = undefined;
        this.prearmedInstantAppId = undefined;
        this.prearmLogoToken += 1;
        this.lastTriggerAt = 0;
    }
    updateInstantCurtainLogo(appId, logoSource, isShortcut = false, showLogo = true) {
        if (!showLogo) {
            this.setInstantCurtainLogo("", false);
            this.activeInstantAppId = appId;
            this.prearmedInstantAppId = undefined;
            return;
        }
        const logoUrl = logoSource || (isShortcut ? this.fallbackLogoUrl() : this.steamLogoUrl(appId));
        if (!logoUrl) {
            return;
        }
        this.setInstantCurtainLogo(logoUrl, true);
        this.activeInstantAppId = appId;
        this.prearmedInstantAppId = undefined;
    }
    setInstantCurtainLogo(logoUrl, showLogo = true) {
        const curtain = this.ensureInstantCurtainPrepared();
        const slot = curtain.querySelector(".launch-curtain-instant__logo-slot");
        if (!slot) {
            return;
        }
        if (!showLogo) {
            slot.innerHTML = "";
            return;
        }
        slot.innerHTML = this.logoMarkup(logoUrl);
        this.wireInstantLogoFallback(curtain);
        this.preloadLogo(logoUrl);
    }
    refreshPreparedFallback() {
        if (this.instantCurtainVisible || this.prearmedInstantAppId) {
            return;
        }
        this.setInstantCurtainLogo(this.fallbackLogoUrl());
    }
    logoMarkup(logoUrl) {
        const fallbackLogoUrl = this.fallbackLogoUrl();
        const fallbackMarkup = fallbackLogoUrl
            ? `<img class="launch-curtain-instant__logo-image launch-curtain-instant__fallback-logo-image" src="${this.escapeHtml(fallbackLogoUrl)}" alt="Playhub" />`
            : `<div class="launch-curtain-instant__logo launch-curtain-instant__fallback-logo-text">playhub</div>`;
        return logoUrl
            ? `
        <img class="launch-curtain-instant__logo-image" src="${this.escapeHtml(logoUrl)}" alt="Logo" />
        <div class="launch-curtain-instant__fallback-logo">${fallbackMarkup}</div>
      `
            : `<div class="launch-curtain-instant__fallback-logo launch-curtain-instant__fallback-logo--visible">${fallbackMarkup}</div>`;
    }
    wireInstantLogoFallback(curtain) {
        const logoImage = curtain.querySelector(".launch-curtain-instant__logo-image");
        const fallbackLogo = curtain.querySelector(".launch-curtain-instant__fallback-logo");
        if (logoImage && fallbackLogo) {
            logoImage.addEventListener("error", () => {
                logoImage.remove();
                fallbackLogo.style.display = "block";
            }, { once: true });
        }
    }
    preloadLogo(logoUrl) {
        if (!logoUrl || (!/^https?:\/\//i.test(logoUrl) && !logoUrl.startsWith("file://"))) {
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
        const active = document.activeElement;
        if (active instanceof HTMLElement && this.isPlayButtonEvent(active, [])) {
            return active;
        }
        if (active instanceof HTMLElement) {
            let parent = active.parentElement;
            for (let depth = 0; parent && depth < 5; depth += 1) {
                if (this.isPlayButtonEvent(parent, [])) {
                    return parent;
                }
                parent = parent.parentElement;
            }
        }
        return undefined;
    }
    startGamepadLaunchPolling() {
        this.stopGamepadLaunchPolling();
        this.gamepadLaunchPressed = this.gamepadButtonPressed([0]);
        const poll = () => {
            if (!this.setupDone) {
                return;
            }
            const confirmPressed = this.gamepadButtonPressed([0]);
            if (this.enabled && confirmPressed && !this.gamepadLaunchPressed && !this.instantCurtainVisible) {
                const focusedPlayButton = this.currentFocusedPlayButton();
                if (focusedPlayButton) {
                    this.handleLaunchInput("play button gamepad", focusedPlayButton, this.parentPath(focusedPlayButton));
                }
                else {
                    this.coverPostPlayInteraction("post-play gamepad", document.activeElement, []);
                }
            }
            this.gamepadLaunchPressed = confirmPressed;
            this.gamepadLaunchFrame = window.requestAnimationFrame(poll);
        };
        this.gamepadLaunchFrame = window.requestAnimationFrame(poll);
    }
    stopGamepadLaunchPolling() {
        if (this.gamepadLaunchFrame !== undefined) {
            window.cancelAnimationFrame(this.gamepadLaunchFrame);
            this.gamepadLaunchFrame = undefined;
        }
        this.gamepadLaunchPressed = false;
    }
    startGamepadClosePolling() {
        this.stopGamepadClosePolling();
        this.gamepadClosePressed = this.gamepadButtonPressed([0, 1]);
        this.gamepadCloseIgnoreUntil = Date.now() + 650;
        const poll = () => {
            if (!this.instantCurtainVisible) {
                this.stopGamepadClosePolling();
                return;
            }
            const closePressed = this.gamepadButtonPressed([0, 1]);
            if (closePressed && !this.gamepadClosePressed && Date.now() >= this.gamepadCloseIgnoreUntil) {
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
    }
    requestCloseAllCurtains() {
        this.postPlayCoverUntil = 0;
        this.postPlayCoverReadyAt = 0;
        this.hideInstantCurtain();
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
const rowTextStyle = {
    fontSize: "12px",
    lineHeight: "16px",
    color: "var(--decky-text-color-secondary, #b8c0cc)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
};
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
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: strings.automation, children: [SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: strings.autoLaunchCurtain, checked: Boolean(settings?.auto_mode), disabled: busy, onChange: (checked) => {
                                void setAutoMode(checked);
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: strings.timeoutEnabled ?? I18N.en.timeoutEnabled ?? "Enable timeout", checked: settings?.timeout_enabled ?? false, disabled: busy || !settings, onChange: (checked) => {
                                void setTimeoutEnabled(checked);
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: (settings?.timeout_enabled ?? false)
                                ? (strings.timeoutHelp ?? I18N.en.timeoutHelp ?? "How long the launch screen can stay visible while waiting for the game to become fullscreen.")
                                : (strings.timeoutDisabledHelp ?? I18N.en.timeoutDisabledHelp ?? "When disabled, the launch screen hides only after fullscreen detection or manual close.") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: strings.timeout, rgOptions: timeoutOptions, selectedOption: selectedTimeout, disabled: busy || !settings || !(settings.timeout_enabled ?? false), onChange: (option) => {
                                if (typeof option.data === "number") {
                                    void setTimeoutValue(option.data);
                                }
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: strings.exitDelayHelp ?? I18N.en.exitDelayHelp ?? "How long Launch Curtain stays visible after detecting that the game is ready." }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay ?? I18N.en.exitDelay ?? "Exit delay", rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !settings, onChange: (option) => {
                                if (typeof option.data === "number") {
                                    void setExitDelayValue(option.data);
                                }
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => {
                                void createGameCache();
                            }, children: "Create/refresh game cache" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => {
                                void cleanupLaunchImages();
                            }, children: "Delete unused launch images" }) })] }), SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: strings.logo, children: [SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: rowTextStyle, children: settings?.custom_logo_path ? `${strings.customLogo}: ${settings.custom_logo_path}` : strings.defaultLogo }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => {
                                void chooseLogo();
                            }, children: strings.chooseLogo }) }), SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings || !settings.custom_logo_path, onClick: () => {
                                void useDefaultLogo();
                            }, children: strings.useDefaultLogo }) })] })] }));
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
        byId.set(appId, {
            app_id: appId,
            title: overview?.display_name || overview?.localized_name || overview?.name || entry?.title || `App ${appId}`,
            is_shortcut: Boolean(overview?.BIsShortcut?.() || overview?.BIsModOrShortcut?.() || Number(overview?.app_type) === 1073741824 || appId >= 2147483648)
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
const pageStyle = { padding: 24, paddingTop: 48, paddingBottom: 120, minHeight: "100vh", boxSizing: "border-box" };
const wallpaperResultsStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
};
const wallpaperResultRowStyle = {
    width: "100%",
    borderRadius: "0.4rem",
    padding: "0.6rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid transparent",
    display: "grid",
    gridTemplateColumns: "11rem minmax(0, 1fr) auto",
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
function SearchQuerySteamField({ value, disabled, placeholder, inputRef, onChange, onBlur, openKeyboard }) {
    const NativeTextField = nativeTextFieldComponent();
    const handleChange = (eventOrValue) => onChange(textValueFromChange(eventOrValue));
    if (NativeTextField) {
        return SP_JSX.jsx(NativeTextField, { label: "Search query", value: value, disabled: disabled, placeholder: placeholder, focusable: true, ref: inputRef, onChange: handleChange, onBlur: onBlur, onFocus: () => {}, onClick: openKeyboard, onOKButton: openKeyboard, onSubmit: openKeyboard });
    }
    return SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }, children: [
        SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: "Search query" }),
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
function LogoPlacementModal({ closeModal, title, backdropPath, logoSource, fallbackLogoPath, initial, onSave }) {
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Math.round(Number(value))));
    const [draft, setDraft] = SP_REACT.useState({
        logo_position_x: clamp(initial?.logo_position_x ?? 50, 0, 100),
        logo_position_y: clamp(initial?.logo_position_y ?? 50, 0, 100),
        logo_scale: clamp(initial?.logo_scale ?? 100, 50, 200),
        background_opacity: clamp(initial?.background_opacity ?? 100, 0, 100)
    });
    const [backdropUrl, setBackdropUrl] = SP_REACT.useState("");
    const [logoUrl, setLogoUrl] = SP_REACT.useState("");
    const updateDraft = (partial) => setDraft((current) => ({ ...current, ...partial }));
    const move = (dx, dy) => updateDraft({
        logo_position_x: clamp(draft.logo_position_x + dx, 0, 100),
        logo_position_y: clamp(draft.logo_position_y + dy, 0, 100)
    });
    const resize = (delta) => updateDraft({ logo_scale: clamp(draft.logo_scale + delta, 50, 200) });
    const reset = () => updateDraft({ logo_position_x: 50, logo_position_y: 50, logo_scale: 100 });
    const saveAndClose = () => {
        onSave(draft);
        closeModal();
    };
    const buttonStyle = { minWidth: "5.5rem" };
    const backgroundOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const loadPreview = async () => {
            try {
                const [backdrop, logo] = await Promise.all([
                    getImagePreview({ source: backdropPath || "" }),
                    getImagePreview({ source: logoSource || "", fallback: fallbackLogoPath || "" })
                ]);
                if (cancelled) {
                    return;
                }
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
        return () => {
            cancelled = true;
        };
    }, [backdropPath, logoSource, fallbackLogoPath]);
    const handlePreviewKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp":
                event.preventDefault();
                move(0, -1);
                break;
            case "ArrowDown":
                event.preventDefault();
                move(0, 1);
                break;
            case "ArrowLeft":
                event.preventDefault();
                move(-1, 0);
                break;
            case "ArrowRight":
                event.preventDefault();
                move(1, 0);
                break;
            default:
                break;
        }
    };
    return SP_JSX.jsxs(DFL.ModalRoot, { closeModal: saveAndClose, children: [
        SP_JSX.jsx("div", { style: { fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.75rem" }, children: title || "Logo position" }),
        SP_JSX.jsx(DFL.Focusable, { focusable: true, noFocusRing: false, onKeyDown: handlePreviewKeyDown, style: {
                width: "100%",
                aspectRatio: "16 / 9",
                position: "relative",
                overflow: "hidden",
                borderRadius: "0.45rem",
                background: "#000",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: "0.75rem"
            }, children: [
                backdropUrl ? SP_JSX.jsx("img", { src: backdropUrl, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: draft.background_opacity / 100 } }) : null,
                logoUrl ? SP_JSX.jsx("img", { src: logoUrl, style: {
                        position: "absolute",
                        left: `${draft.logo_position_x}%`,
                        top: `${draft.logo_position_y}%`,
                        width: "42%",
                        maxHeight: "20%",
                        objectFit: "contain",
                        transform: `translate(-50%, -50%) scale(${draft.logo_scale / 100})`,
                        transformOrigin: "center center",
                        filter: "drop-shadow(0 0 0.65rem rgba(0,0,0,0.6))"
                    } }) : null
            ] }),
        SP_JSX.jsx("div", { style: { marginBottom: "0.75rem" }, children: SP_JSX.jsx(DFL.DropdownItem, { label: "Background opacity", rgOptions: backgroundOpacityOptions, selectedOption: draft.background_opacity, onChange: (option) => { if (typeof option.data === "number") updateDraft({ background_opacity: option.data }); } }) }),
        SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", noFocusRing: true, style: { display: "flex", flexDirection: "column", gap: "0.45rem", alignItems: "center", marginBottom: "0.75rem" }, children: [
            SP_JSX.jsx(DFL.Focusable, { "flow-children": "row", noFocusRing: true, style: { display: "flex", gap: "0.45rem", justifyContent: "center" }, children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, -1), style: buttonStyle, children: "Up" }) }),
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", noFocusRing: true, style: { display: "flex", gap: "0.45rem", justifyContent: "center" }, children: [
                    SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(-1, 0), style: buttonStyle, children: "Left" }),
                    SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: reset, style: buttonStyle, children: "Reset" }),
                    SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(1, 0), style: buttonStyle, children: "Right" })
                ] }),
            SP_JSX.jsx(DFL.Focusable, { "flow-children": "row", noFocusRing: true, style: { display: "flex", gap: "0.45rem", justifyContent: "center" }, children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, 1), style: buttonStyle, children: "Down" }) })
        ] }),
        SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", noFocusRing: true, style: { display: "flex", flexDirection: "column", gap: "0.55rem" }, children: [
            SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", noFocusRing: true, style: { display: "flex", gap: "0.5rem", justifyContent: "space-between" }, children: [
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(-10), style: { minWidth: "7rem" }, children: "Smaller" }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(10), style: { minWidth: "7rem" }, children: "Bigger" })
            ] }),
            SP_JSX.jsx(DFL.Focusable, { "flow-children": "row", noFocusRing: true, style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: saveAndClose, style: { minWidth: "7rem" }, children: "Cancel" }) })
        ] })
    ] });
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
    const [searchPlayStation, setSearchPlayStation] = SP_REACT.useState(true);
    const [searchIGDB, setSearchIGDB] = SP_REACT.useState(true);
    const [searchAlphaCoders, setSearchAlphaCoders] = SP_REACT.useState(true);
    const [backdropPreviewUrl, setBackdropPreviewUrl] = SP_REACT.useState("");
    const exitDelayOptions = Array.from({ length: 11 }, (_item, seconds) => ({ data: seconds, label: `${seconds} s` }));
    const backgroundOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    const gameTitle = appNameForId(appId);
    const defaultSearchQuery = /^App \d+$/i.test(gameTitle) ? "" : `${gameTitle}`;
    const searchInputRef = SP_REACT.useRef(null);
    const focusSearchInput = () => focusTextInputWithSteamKeyboard(searchInputRef.current);
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
    const selectedServices = [
        searchPlayStation ? "playstation" : "",
        searchIGDB ? "igdb" : "",
        searchAlphaCoders ? "alphacoders" : ""
    ].filter(Boolean);
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
                toaster.toast({ title: strings.toastAttention, body: validation.message || "Please choose a file, not a folder." });
                return;
            }
            toaster.toast({ title: strings.toastAttention, body: "Please choose a file, not a folder." });
        }
        catch (error) {
            console.warn("Launch Curtain backdrop picker failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not choose a launch image." });
        }
        finally {
            setBusy(false);
        }
    };
    const searchImages = async () => {
        const title = /^App \d+$/i.test(gameTitle) ? "" : gameTitle;
        const query = imageSearchQuery.trim();
        if (!title || !query) {
            setImageSearchMessage(!title ? "Could not read the game title from Steam." : "Enter a search query.");
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
            setImageSearchMessage(result.message || (result.ok ? "Images found." : "No images found."));
        }
        catch (error) {
            console.warn("Launch Curtain background image search failed", error);
            setImageResults([]);
            setImageSearchMessage("Could not search Google Images.");
        }
        finally {
            setImageSearchBusy(false);
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
                toaster.toast({ title: strings.toastTitle, body: next.message || "Launch image downloaded." });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: next.message || "Could not download image." });
            }
        }
        catch (error) {
            console.warn("Launch Curtain background image download failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not download image." });
        }
        finally {
            setBusy(false);
        }
    };
    const openLogoPlacement = () => {
        let modal;
        const closeModal = () => modal?.Close?.();
        modal = DFL.showModal(SP_JSX.jsx(LogoPlacementModal, { closeModal: closeModal, title: "Logo position", backdropPath: resolved.fullscreen_image_path || raw.fullscreen_image_path || "", logoSource: payload?.logo_source || payload?.default_logo_path || "", fallbackLogoPath: payload?.default_logo_path || "", initial: resolved, onSave: (next) => {
                void savePartial(next);
            } }), undefined, { strTitle: "Logo position" });
    };
    if (!appId) {
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: "No game selected." }) });
    }
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === (raw.exit_delay_seconds ?? resolved.exit_delay_seconds)) ? (raw.exit_delay_seconds ?? resolved.exit_delay_seconds) : (payload?.global_exit_delay_seconds ?? 3);
    return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsxs("div", { "flow-children": "column", className: "launch-curtain-main", style: pageStyle, children: [
        SP_JSX.jsx("h2", { children: "Launch Curtain" }),
        SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal", marginBottom: 16 }, children: gameTitle }),
        SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", children: [
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "Enable Launch Curtain for this game", checked: resolved.enabled !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ enabled: checked }); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "Show logo", checked: resolved.show_logo !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ show_logo: checked }); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !payload || resolved.show_logo === false, onClick: openLogoPlacement, children: "Customize logo position" }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "Enable logo zoom animation", checked: resolved.logo_zoom_enabled !== false, disabled: busy || !payload || resolved.show_logo === false, onChange: (checked) => { void savePartial({ logo_zoom_enabled: checked }); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: "Exit delay", rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !payload, onChange: (option) => { if (typeof option.data === "number") void savePartial({ exit_delay_seconds: option.data }); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: selectedBackdropPath ? `Launch image: ${selectedBackdropPath}` : "Launch image: none" }) }),
            backdropPreviewUrl ? SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { width: "100%", display: "flex", justifyContent: "center", padding: "0.35rem 0" }, children: SP_JSX.jsx("img", { src: backdropPreviewUrl, style: { maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "0.5rem", boxShadow: "0 0.35rem 1rem rgba(0,0,0,0.35)" } }) }) }) : null,
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !payload, onClick: () => { void chooseBackdrop(); }, children: "Choose fullscreen launch image" }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !payload || !raw.fullscreen_image_path, onClick: () => { void savePartial({ fullscreen_image_path: "" }); }, children: "Clear launch image" }) }),
        ] }),
        SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: "Background downloader", children: [
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(SearchQuerySteamField, { value: imageSearchQuery, disabled: busy || imageSearchBusy || !payload, placeholder: defaultSearchQuery || "Game wallpaper", inputRef: searchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusSearchInput }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || imageSearchBusy || !payload || /^App \d+$/i.test(gameTitle) || !imageSearchQuery.trim() || selectedServices.length === 0, onClick: () => { void searchImages(); }, children: imageSearchBusy ? "Searching..." : "Search" }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: "Search sources" }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "PlayStation Store", checked: searchPlayStation, disabled: busy || imageSearchBusy || !payload, onChange: (checked) => setSearchPlayStation(checked) }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "IGDB", checked: searchIGDB, disabled: busy || imageSearchBusy || !payload, onChange: (checked) => setSearchIGDB(checked) }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: "AlphaCoders", checked: searchAlphaCoders, disabled: busy || imageSearchBusy || !payload, onChange: (checked) => setSearchAlphaCoders(checked) }) }),
            imageSearchMessage ? SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: imageSearchMessage }) }) : null,
            imageResults.length > 0 ? SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: wallpaperResultsStyle, children: imageResults.map((result) => {
                    const resultId = result.id || result.image_url;
                    const isSelected = selectedImageId === resultId;
                    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", noFocusRing: true, onFocus: () => setSelectedImageId(resultId), style: {
                            ...wallpaperResultRowStyle,
                            border: isSelected ? "1px solid rgba(120, 180, 255, 0.85)" : wallpaperResultRowStyle.border
                        }, children: [
                            SP_JSX.jsx("div", { onClick: () => setSelectedImageId(resultId), style: { cursor: "pointer" }, children: SP_JSX.jsx("img", { src: result.thumbnail_url || result.preview_url || result.image_url, onError: (event) => fallbackWallpaperPreview(event, result), style: wallpaperPreviewStyle }) }),
                            SP_JSX.jsxs("div", { onClick: () => setSelectedImageId(resultId), style: { minWidth: 0, display: "flex", flexDirection: "column", gap: "0.28rem", cursor: "pointer" }, children: [
                                    SP_JSX.jsx("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.source || "Wallpaper result" }),
                                    SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: result.page_url || result.image_url }),
                                    SP_JSX.jsx("span", { style: { fontSize: "0.72rem", opacity: 0.9, whiteSpace: "nowrap" }, children: result.resolution || result.size || (result.width && result.height ? `${result.width}x${result.height}` : imageResolution) })
                                ] }),
                            SP_JSX.jsx(DFL.DialogButton, { focusable: true, onFocus: () => setSelectedImageId(resultId), disabled: busy || imageSearchBusy, onClick: () => { void downloadImage(result); }, style: { minWidth: "8rem", whiteSpace: "nowrap" }, children: "Download" })
                        ] }, resultId);
                }) }) }) : null
        ] })
    ] }) });
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
    const menuItem = window.SP_REACT.createElement(DFL.MenuItem, { key: LAUNCH_CURTAIN_MENU_KEY, onSelected: openLaunchCurtain }, "Launch Curtain settings...");
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

var index = definePlugin(() => {
    const menuPatch = installLaunchCurtainContextMenu();
    try {
        routerHook?.addRoute?.(LAUNCH_CURTAIN_ROUTE, () => window.SP_REACT.createElement(GameSettingsPage, null), { exact: true });
    }
    catch (error) {
        console.warn("Launch Curtain could not add per-game route", error);
    }
    playButtonHook.setup();
    runSilentStartupGameCacheRefresh();
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
        titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "Launch Curtain" }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaTheaterMasks, {}),
        alwaysRender: true,
        onDismount() {
            try { menuPatch?.unpatch?.(); } catch (error) { console.warn("Launch Curtain context menu unpatch failed", error); }
            try { routerHook?.removeRoute?.(LAUNCH_CURTAIN_ROUTE); } catch (error) { console.warn("Launch Curtain route remove failed", error); }
            playButtonHook.cleanup();
            console.log("Launch Curtain unloaded");
        }
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
