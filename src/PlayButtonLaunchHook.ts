import { PLAY_LABELS, BLOCKED_PLAY_LABEL_HINTS, PROBATION_COVER_MS, LAUNCH_BRIDGE_COVER_MS, CONFIRMED_LAUNCH_COVER_MS, POST_PLAY_CONFIRM_COVER_MS, POST_PLAY_ARM_MS, POST_PLAY_CONFIRM_PATTERN, POST_PLAY_CANCEL_PATTERN } from "./constants";
import { debugLog, getImagePreview, getSoundbitePreview, getStatus, hideBlackCover, hideCurtain, launchRequested, resolveGameLogo, setNativePromptVisible, showBlackCover, soundbiteRuntimeFinished, soundbiteRuntimeStarted } from "./backend";

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

export { PlayButtonLaunchHook, playButtonHook };
