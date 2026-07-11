import { speak } from "./helpers";

export default function GrammarMode({ grammar, sentences, accentColor }) {
  if (!grammar.length && !sentences.length) {
    return <p className="text-chu-nhat text-center">Chưa có nội dung ngữ pháp cho khóa học này.</p>;
  }

  return (
    <div className="px-2">
      {grammar.length > 0 && (
        <div className="mb-6">
          <div className="text-vang-kim text-[13px] font-semibold mb-3">MẪU CÂU THƯỜNG GẶP</div>
          {grammar.map((g) => (
            <div key={g.id} className="bg-dem-nhat rounded-2xl p-5 mb-3" style={{ borderLeft: `4px solid ${accentColor}` }}>
              <div className="font-mono text-base font-bold mb-2.5" style={{ color: accentColor }}>{g.pattern}</div>
              <div className="text-chu-ngoc text-lg font-serif mb-1.5">{g.example_zh}</div>
              <div className="text-chu-nhat text-sm">{g.example_vi}</div>
              <button
                onClick={() => speak(g.example_zh)}
                className="mt-2.5 bg-transparent rounded-full px-3.5 py-1 text-xs"
                style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
              >🔊 Nghe</button>
            </div>
          ))}
        </div>
      )}
      {sentences.length > 0 && (
        <div>
          <div className="text-vang-kim text-[13px] font-semibold mb-3">CÂU VÍ DỤ THỰC TIỄN</div>
          {sentences.map((s) => (
            <div key={s.id} className="bg-dem-nhat-2 border border-dem-nhat rounded-2xl p-5 mb-2.5">
              <div className="text-chu-ngoc text-lg font-serif mb-1.5">{s.zh}</div>
              <div className="text-chu-nhat font-mono text-[13px] mb-1">{s.pinyin}</div>
              <div className="text-chu-mo text-sm">{s.vi}</div>
              <button
                onClick={() => speak(s.zh)}
                className="mt-2 bg-transparent rounded-full px-3.5 py-1 text-xs"
                style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
              >🔊</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
