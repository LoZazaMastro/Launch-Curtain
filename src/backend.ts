import { callable } from "./decky";

// Callable esposte dal backend Python (main.py). Ricostruito dal dist.
const getSettings = callable("get_settings");
const saveSettings = callable("save_settings");
const getStatus = callable("get_status");
const debugLog = callable("debug_log");
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

export { getSettings, saveSettings, getStatus, debugLog, hideCurtain, showBlackCover, hideBlackCover, launchRequested, resolveGameLogo, getGameSettings, saveGameSettings, resetGameSettings, validateLaunchImagePath, getImagePreview, searchPlayStationGames, getPlayStationBackgrounds, applyPlayStationAsset, removePlayStationAsset, searchGoogleImages, downloadGoogleImage, buildGameCache, cleanupUnusedLaunchImages, startAutoMode, stopAutoMode, FILE_SELECTION_FILE };
