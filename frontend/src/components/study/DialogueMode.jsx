import { speak } from "./helpers";

export default function DialogueMode({ lines, accentColor }) {
  if (!lines || !lines.length) {
    return (
      <p className="text-gray-400 text-center">
        💬 Nội dung câu hội thoại theo bài giảng đang được cập nhật.
      </p>
    );
  }

  const groups = {};
  for (const l of lines) {
    (groups[l.dialogue_group] = groups[l.dialogue_group] || []).push(l);
  }

  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="text-[13px] font-semibold mb-3" style={{ color: accentColor }}>CÂU HỘI THOẠI</div>
      {Object.entries(groups).map(([groupId, groupLines]) => (
        <div key={groupId} className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
          {groupLines.map((l) => (
            <div key={l.id} className="flex gap-3 mb-4 last:mb-0">
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: accentColor }}
              >{(l.speaker || "?").slice(0, 1)}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-0.5">{l.speaker}</div>
                <div className="flex items-start gap-2">
                  <div className="text-lg font-serif text-gray-900 leading-snug">{l.zh}</div>
                  <button
                    onClick={() => speak(l.zh)}
                    className="shrink-0 bg-transparent rounded-full px-2 py-0.5 text-xs"
                    style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
                  >🔊</button>
                </div>
                <div className="font-mono text-xs text-gray-400 mt-0.5">{l.pinyin}</div>
                <div className="text-sm text-gray-600 mt-0.5">{l.vi}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
