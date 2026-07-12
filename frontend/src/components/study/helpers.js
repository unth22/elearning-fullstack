// Ưu tiên giọng đọc tiếng Trung tự nhiên hơn (giọng cloud của trình duyệt,
// thường có tên Google/Microsoft) thay vì giọng robot mặc định của máy.
let voicesCache = [];
if (typeof window !== "undefined" && window.speechSynthesis) {
  voicesCache = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
}

function pickVoice(lang) {
  const candidates = voicesCache.filter((v) => v.lang === lang || v.lang?.startsWith(lang.split("-")[0]));
  if (!candidates.length) return null;
  return (
    candidates.find((v) => /Google|Microsoft|Yaoyao|Xiaoxiao|Tingting|Meijia/i.test(v.name)) ||
    candidates.find((v) => !v.localService) ||
    candidates[0]
  );
}

export function speak(text, lang = "zh-CN") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.92;
  u.pitch = 1.05;
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Màu highlight/ghi chú dùng chung giữa Highlightable, NotesPanel.
export const HIGHLIGHT_COLORS = [
  { id: "yellow", hex: "#FDE68A" },
  { id: "green", hex: "#BBF7D0" },
  { id: "blue", hex: "#BFDBFE" },
  { id: "pink", hex: "#FBCFE8" },
];
export const HIGHLIGHT_COLOR_HEX = Object.fromEntries(HIGHLIGHT_COLORS.map((c) => [c.id, c.hex]));
