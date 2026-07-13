import { speak } from "./helpers";

export default function GrammarMode({ grammar, sentences, accentColor }) {
  if (!grammar.length && !sentences.length) {
    return <p className="text-chu-nhat text-center">Chưa có nội dung ngữ pháp cho khóa học này.</p>;
  }

  // Câu ví dụ thực tiễn không có liên kết trực tiếp tới từng mẫu ngữ pháp cụ
  // thể, nên thay vì tách thành 1 khối riêng ở dưới cùng, chia đều chúng vào
  // từng khung mẫu câu — mỗi mẫu ngữ pháp có luôn cả giải thích lẫn ví dụ
  // (mẫu + thực tiễn) trong cùng 1 khung.
  const extrasByPattern = {};
  if (grammar.length > 0) {
    sentences.forEach((s, i) => {
      const gi = i % grammar.length;
      (extrasByPattern[gi] ||= []).push(s);
    });
  }

  return (
    <div className="px-2">
      {grammar.length > 0 ? (
        <div>
          <div className="text-vang-kim text-[13px] font-semibold mb-3">MẪU CÂU THƯỜNG GẶP</div>
          {grammar.map((g, gi) => (
            <div key={g.id} className="bg-dem-nhat rounded-2xl p-5 mb-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
              <div className="font-mono text-base font-bold mb-2.5" style={{ color: accentColor }}>{g.pattern}</div>
              {g.explanation && (
                <div className="text-chu-nhat text-sm leading-relaxed mb-3">{g.explanation}</div>
              )}
              <div className="text-chu-ngoc text-lg font-serif mb-1">{g.example_zh}</div>
              {g.pinyin && <div className="text-chu-nhat text-[13px] mb-1.5">{g.pinyin}</div>}
              <div className="text-chu-nhat text-sm">{g.example_vi}</div>
              <button
                onClick={() => speak(g.example_zh)}
                className="mt-2.5 bg-transparent rounded-full px-3.5 py-1 text-xs"
                style={{ border: `1px solid ${accentColor}44`, color: accentColor }}
              >🔊 Nghe</button>

              {(extrasByPattern[gi] || []).length > 0 && (
                <div className="mt-4 pt-4" style={{ borderTop: `1px dashed ${accentColor}33` }}>
                  <div className="text-chu-nhat text-[11px] font-semibold mb-2.5 opacity-70 tracking-wide">CÂU VÍ DỤ THỰC TIỄN</div>
                  <div className="flex flex-col gap-3">
                    {extrasByPattern[gi].map((s) => (
                      <div key={s.id}>
                        <div className="text-chu-ngoc text-base font-serif mb-1">{s.zh}</div>
                        <div className="text-chu-nhat text-xs mb-0.5">{s.pinyin}</div>
                        <div className="text-chu-mo text-xs mb-1">{s.vi}</div>
                        <button
                          onClick={() => speak(s.zh)}
                          className="bg-transparent rounded-full px-3 py-0.5 text-[11px]"
                          style={{ border: `1px solid ${accentColor}33`, color: accentColor }}
                        >🔊</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="text-vang-kim text-[13px] font-semibold mb-3">CÂU VÍ DỤ THỰC TIỄN</div>
          {sentences.map((s) => (
            <div key={s.id} className="bg-dem-nhat-2 border border-dem-nhat rounded-2xl p-5 mb-2.5">
              <div className="text-chu-ngoc text-lg font-serif mb-1.5">{s.zh}</div>
              <div className="text-chu-nhat text-[13px] mb-1">{s.pinyin}</div>
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
