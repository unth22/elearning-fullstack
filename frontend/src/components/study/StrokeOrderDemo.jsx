import { useState, useEffect, useRef } from "react";

// Hình động thứ tự nét viết chữ Hán — dùng chính thư viện HanziWriter đã có
// sẵn trong app (ở "Nét chữ") thay vì nhúng GIF ngoài, vừa chính xác thứ tự
// nét thật vừa không cần tải thêm file ảnh nặng.
export default function StrokeOrderDemo({ chars, accentColor, dark = false }) {
  const [loaded, setLoaded] = useState(!!window.HanziWriter);
  const writersRef = useRef({});
  const uid = useRef(Math.random().toString(36).slice(2)).current;

  useEffect(() => {
    if (!window.HanziWriter) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js";
      s.onload = () => setLoaded(true);
      document.head.appendChild(s);
    } else setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const strokeColor = dark ? "#F0EDE4" : "#D4A017";
    chars.forEach((ch, i) => {
      const id = `stroke-demo-${uid}-${i}`;
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = "";
      try {
        const w = window.HanziWriter.create(id, ch, {
          width: 88, height: 88, padding: 6,
          strokeColor, radicalColor: accentColor,
          outlineColor: dark ? "#2A2C3D" : "#E5E7EB",
          showCharacter: false, showOutline: true,
          delayBetweenStrokes: 300,
        });
        writersRef.current[i] = w;
        setTimeout(() => w.animateCharacter(), i * 700 + 300);
      } catch (e) {}
    });
  }, [loaded, chars, accentColor, dark, uid]);

  function replay(i) {
    writersRef.current[i]?.animateCharacter();
  }

  return (
    <div className="flex gap-3 flex-wrap justify-center py-1">
      {chars.map((ch, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div id={`stroke-demo-${uid}-${i}`} className="rounded-xl border overflow-hidden"
            style={{ borderColor: dark ? "#2A2C3D" : "#E5E7EB", width: 88, height: 88 }} />
          <button onClick={() => replay(i)} className="text-[11px] font-semibold bg-transparent border-none cursor-pointer" style={{ color: accentColor }}>
            🔁 Xem lại
          </button>
        </div>
      ))}
      {!loaded && <div className="text-xs w-full text-center" style={{ color: dark ? "#6E6E85" : "#9CA3AF" }}>Đang tải hình động...</div>}
    </div>
  );
}
