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
