import { useState, useEffect, useRef } from "react";
import { speak } from "./helpers";

export default function HanziMode({ vocab, accentColor, dark = false }) {
  // Nét chữ màu kem-trắng chỉ nổi trên nền tối; ở light theme (nền thẻ gần
  // trắng) phải đổi sang vàng đậm để không bị "biến mất" trên nền sáng.
  const strokeColor = dark ? "#F0EDE4" : "#D4A017";
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(!!window.HanziWriter);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.HanziWriter) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js";
      s.onload = () => setLoaded(true);
      document.head.appendChild(s);
    } else setLoaded(true);
  }, []);

  const card = vocab[idx];

  useEffect(() => {
    if (!loaded || !containerRef.current || !card) return;
    containerRef.current.innerHTML = "";
    const chars = card.zh.split("");
    chars.forEach((ch, i) => {
      const div = document.createElement("div");
      div.id = `hw-${i}`;
      div.style.display = "inline-block";
      containerRef.current.appendChild(div);
      try {
        window.HanziWriter.create(`hw-${i}`, ch, {
          width: 120, height: 120, padding: 10,
          strokeColor, radicalColor: accentColor,
          outlineColor: "#2A4A7F", drawingColor: "#4CAF8E",
          showOutline: true, showCharacter: true,
        });
      } catch (e) {}
    });
  }, [loaded, idx, card, accentColor, strokeColor]);

  if (!vocab.length) return <p className="text-chu-nhat text-center">Chưa có từ vựng cho khóa học này.</p>;

  const animate = () => {
    if (!loaded || !containerRef.current) return;
    const chars = card.zh.split("");
    containerRef.current.innerHTML = "";
    chars.forEach((ch, i) => {
      const div = document.createElement("div");
      div.id = `hw-anim-${i}`;
      div.style.display = "inline-block";
      containerRef.current.appendChild(div);
      try {
        const w = window.HanziWriter.create(`hw-anim-${i}`, ch, {
          width: 120, height: 120, padding: 10,
          strokeColor, radicalColor: accentColor,
          outlineColor: "#2A4A7F", drawingColor: "#4CAF8E",
          showOutline: true, showCharacter: false,
        });
        setTimeout(() => w.animateCharacter(), i * 600);
      } catch (e) {}
    });
  };

  return (
    <div className="text-center px-4">
      <div className="text-chu-nhat text-[13px] mb-4">Xem nét chữ Hán • {idx + 1}/{vocab.length}</div>
      <div className="bg-dem-nhat rounded-2xl px-4 py-6 mb-5 inline-block" style={{ border: `1px solid ${accentColor}33` }}>
        <div ref={containerRef} className="flex gap-2 justify-center min-h-[120px]">
          {!loaded && <div className="text-chu-mo leading-[120px]">Đang tải...</div>}
        </div>
      </div>
      <div className="text-chu-ngoc text-xl mb-1">{card.vi}</div>
      <div className="text-chu-nhat font-mono text-[15px] mb-5">{card.pinyin}</div>
      <div className="flex gap-2.5 justify-center flex-wrap">
        <button onClick={animate} className="px-6 py-2.5 border-none rounded-xl font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>▶ Xem nét vẽ</button>
        <button onClick={() => speak(card.zh)} className="px-5 py-2.5 bg-transparent rounded-xl" style={{ border: `1px solid ${accentColor}66`, color: accentColor }}>🔊 Nghe</button>
        <button onClick={() => setIdx((i) => (i === 0 ? vocab.length - 1 : i - 1))} className="px-4 py-2.5 bg-dem-nhat border border-vien-dem text-chu-ngoc rounded-xl">←</button>
        <button onClick={() => setIdx((i) => (i + 1) % vocab.length)} className="px-4 py-2.5 bg-dem-nhat border border-vien-dem text-chu-ngoc rounded-xl">→</button>
      </div>
    </div>
  );
}
