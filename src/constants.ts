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
const POST_PLAY_CONFIRM_PATTERN = /(play|launch|start|run|continue|accept|agree|ok|yes|gioca|avvia|continua|accetta|conferma|esegui|exe|configuration|configurazione|config|controller|keyboard|tastiera|terms|license|licenza|eula)/i;

export { PLAY_LABELS, BLOCKED_PLAY_LABEL_HINTS, PROBATION_COVER_MS, LAUNCH_BRIDGE_COVER_MS, CONFIRMED_LAUNCH_COVER_MS, POST_PLAY_CONFIRM_COVER_MS, POST_PLAY_ARM_MS, POST_PLAY_CONFIRM_PATTERN };
