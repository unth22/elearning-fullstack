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

export function speak(text, lang = "zh-CN", rate = 0.92) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  u.pitch = 1.05;
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

// Giọng đọc tiếng Trung (kể cả giọng cloud) đọc chữ La-tinh trần (vd. "m",
// "ia") theo kiểu đánh vần tiếng Anh chứ không phát âm như tiếng Trung, vì
// đó không phải chữ Hán thật. Nên khi cần đọc 1 âm tiết/thanh mẫu/vận mẫu
// đứng riêng lẻ (không có ví dụ từ vựng đi kèm), thay bằng 1 chữ Hán tiêu
// biểu có đúng cách đọc đó rồi phát âm chữ đó — ép engine đọc đúng ngữ âm
// tiếng Trung thay vì đánh vần La-tinh.
const PINYIN_DEMO_CHARS = {
  b: "波", p: "坡", m: "摸", f: "佛", d: "得", t: "特", n: "呢", l: "了",
  g: "哥", k: "科", h: "河", j: "鸡", q: "七", x: "西",
  zh: "知", ch: "吃", sh: "诗", r: "日", z: "资", c: "词", s: "思",
  a: "啊", ia: "呀", ua: "蛙",
  o: "哦", uo: "窝",
  e: "鹅",
  ie: "耶", "üe": "约",
  er: "儿",
  ai: "爱", uai: "歪",
  ei: "诶", ui: "位", uei: "位",
  ao: "熬", iao: "要",
  ou: "欧", iu: "有", iou: "有",
  an: "安", ian: "烟", uan: "弯", "üan": "冤",
  en: "恩", in: "因", un: "温", uen: "温", "ün": "云",
  ang: "昂", iang: "羊", uang: "汪",
  ing: "英", ueng: "翁",
  iong: "用",
};

export function speakPinyin(syllable, rate = 0.92) {
  const key = syllable.replace(/\s*\(.*\)\s*$/, "").trim();
  const demo = PINYIN_DEMO_CHARS[key];
  speak(demo || syllable, "zh-CN", rate);
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
