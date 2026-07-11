import { useState } from "react";
import { speak } from "./helpers";

export default function ShadowingMode({ sentences, accentColor }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | listening | shadowing | done
  const [transcript, setTranscript] = useState("");

  if (!sentences.length) return <p className="text-chu-nhat text-center">Chưa có câu ví dụ cho khóa học này.</p>;

  const sentence = sentences[idx];

  const startShadow = () => {
    speak(sentence.zh);
    setPhase("listening");
    setTimeout(() => setPhase("shadowing"), 3500);
  };

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ nhận giọng nói. Hãy dùng Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "zh-CN"; r.continuous = false; r.interimResults = false;
    r.onresult = (e) => { setTranscript(e.results[0][0].transcript); setPhase("done"); };
    r.onerror = () => setPhase("done");
    r.start();
    setPhase("shadowing");
  };

  const next = () => { setIdx((i) => (i + 1) % sentences.length); setPhase("ready"); setTranscript(""); };

  const phaseColors = { ready: "#2A4A7F", listening: "#E8B84B", shadowing: "#4CAF8E", done: accentColor };

  return (
    <div className="max-w-[520px] mx-auto px-4 text-center">
      <div className="text-chu-nhat text-[13px] mb-5">Shadowing: Nghe → Nhại lại theo • {idx + 1}/{sentences.length}</div>
      <div className="bg-dem-nhat rounded-2xl p-7 mb-5" style={{ border: `2px solid ${phaseColors[phase]}44` }}>
        {phase === "ready" && <div className="text-chu-mo text-sm mb-3">Nhấn để bắt đầu nghe câu mẫu</div>}
        {phase === "listening" && <div className="text-[#E8B84B] text-sm mb-3">🎧 Đang phát âm... hãy nghe thật kỹ</div>}
        {phase === "shadowing" && <div className="text-xanh-luc text-sm mb-3">🎤 Hãy nhại lại ngay bây giờ!</div>}
        {phase === "done" && <div className="text-sm mb-3" style={{ color: accentColor }}>✅ Đã hoàn thành</div>}

        <div className={`text-2xl font-serif leading-relaxed ${phase === "ready" ? "text-chu-mo" : "text-chu-ngoc"}`}>
          {phase === "ready" ? "？？？" : sentence.zh}
        </div>
        {phase !== "ready" && <div className="text-chu-nhat font-mono text-[13px] mt-2">{sentence.pinyin}</div>}
        {phase !== "ready" && <div className="text-chu-nhat text-sm mt-1.5">{sentence.vi}</div>}
      </div>

      {phase === "done" && transcript && (
        <div className="bg-dem-nhat-2 border border-vien-dem rounded-xl p-4 mb-4">
          <div className="text-chu-nhat text-xs mb-1.5">Bạn đã nói:</div>
          <div className="text-chu-ngoc text-lg font-serif">{transcript}</div>
          <div className={`text-[13px] mt-2 ${transcript === sentence.zh ? "text-xanh-luc" : "text-[#E8B84B]"}`}>
            {transcript === sentence.zh ? "✓ Hoàn toàn khớp!" : "~ Gần đúng — thử lại để hoàn thiện"}
          </div>
        </div>
      )}

      <div className="flex gap-2.5 justify-center">
        {phase === "ready" && (
          <button onClick={startShadow} className="px-8 py-3.5 border-none rounded-2xl text-base font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>▶ Bắt đầu</button>
        )}
        {phase === "shadowing" && (
          <button onClick={startRecording} className="px-8 py-3.5 bg-[#E74C3C] border-none text-white rounded-2xl text-base font-bold animate-pulse">🎤 Ghi âm</button>
        )}
        {phase === "done" && (
          <>
            <button onClick={() => { setPhase("ready"); setTranscript(""); }} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>↩ Thử lại</button>
            <button onClick={next} className="px-6 py-3 border-none rounded-xl font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>Câu tiếp →</button>
          </>
        )}
      </div>
    </div>
  );
}
