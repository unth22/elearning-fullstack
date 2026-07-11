import { useState } from "react";
import { speak } from "./helpers";

export default function VocabMode({ vocab, accentColor }) {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("Tất cả");
  const allTags = ["Tất cả", ...new Set(vocab.flatMap((v) => v.tags || []))];
  const filtered = vocab.filter(
    (v) =>
      (tag === "Tất cả" || (v.tags || []).includes(tag)) &&
      (v.zh.includes(search) || v.pinyin.toLowerCase().includes(search.toLowerCase()) || v.vi.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="px-2">
      <div className="flex gap-2.5 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          className="flex-1 min-w-[160px] px-3.5 py-2.5 bg-dem-nhat border border-vien-dem rounded-[10px] text-chu-ngoc outline-none text-sm"
        />
        <div className="flex gap-1.5 flex-wrap">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className="px-3.5 py-2 rounded-full text-xs"
              style={{
                border: `1px solid ${t === tag ? accentColor : "#2A4A7F"}`,
                background: t === tag ? accentColor + "22" : "transparent",
                color: t === tag ? accentColor : "#8BA3C0",
              }}
            >{t}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((v) => (
          <div key={v.zh} className="flex items-center gap-3.5 bg-dem-nhat border border-vien-dem rounded-xl px-4 py-3">
            <div className="text-[28px] font-serif text-chu-ngoc min-w-[56px]">{v.zh}</div>
            <div className="flex-1">
              <div className="text-chu-nhat font-mono text-xs">{v.pinyin}</div>
              <div className="text-chu-ngoc text-[15px] font-medium">{v.vi}</div>
              <div className="text-chu-mo text-xs">{v.en}</div>
            </div>
            <button onClick={() => speak(v.zh)} className="bg-transparent border-none text-lg" style={{ color: accentColor }}>🔊</button>
          </div>
        ))}
      </div>
    </div>
  );
}
