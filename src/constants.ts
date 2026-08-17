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

export { PLAY_LABELS, BLOCKED_PLAY_LABEL_HINTS, PROBATION_COVER_MS, LAUNCH_BRIDGE_COVER_MS, CONFIRMED_LAUNCH_COVER_MS, POST_PLAY_CONFIRM_COVER_MS, POST_PLAY_ARM_MS, POST_PLAY_CONFIRM_PATTERN, POST_PLAY_CANCEL_PATTERN };
