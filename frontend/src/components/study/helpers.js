export function speak(text, lang = "zh-CN") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
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
