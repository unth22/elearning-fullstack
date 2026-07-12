import { speak } from "./helpers";

export default function PhrasesMode({ phrases, accentColor }) {
  if (!phrases || !phrases.length) {
    return (
      <p className="text-gray-400 text-center">
        🔤 Nội dung cụm từ theo bài giảng đang được cập nhật.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="text-[13px] font-semibold mb-3" style={{ color: accentColor }}>CỤM TỪ TRONG BÀI</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {phrases.map((p) => (
          <div key={p.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xl font-serif text-gray-900">{p.zh}</div>
              <button
                onClick={() => speak(p.zh)}
                className="shrink-0 bg-transparent rounded-full px-2.5 py-1 text-xs"
                style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
              >🔊</button>
            </div>
            <div className="font-mono text-xs text-gray-400 mt-1">{p.pinyin}</div>
            <div className="text-sm text-gray-600 mt-1.5">{p.vi}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
