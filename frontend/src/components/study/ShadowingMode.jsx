import { useState, useRef, useEffect } from "react";
import { speak } from "./helpers";

const PUNCT = /[，。！？、,.!?\s]/;

// So khớp câu mẫu với transcript nhận dạng giọng nói bằng LCS (longest common
// subsequence) theo từng ký tự, để chấm điểm phát âm — chữ nào xuất hiện đúng
// thứ tự trong lời nói của học viên thì tô xanh, còn lại tô đỏ (có thể đã nói
// sai/thiếu/thừa chữ đó).
function scorePronunciation(target, transcript) {
  const chars = target.split("");
  const tStripped = [];
  const tMap = []; // tStripped index -> original chars index
  chars.forEach((c, i) => { if (!PUNCT.test(c)) { tStripped.push(c); tMap.push(i); } });
  const s = transcript.replace(new RegExp(PUNCT, "g"), "").split("");

  const m = tStripped.length, n = s.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = tStripped[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matchedStripped = new Array(m).fill(false);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (tStripped[i - 1] === s[j - 1]) { matchedStripped[i - 1] = true; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }

  const matchedFull = new Array(chars.length).fill(true); // dấu câu luôn coi là "đúng" (không tô đỏ)
  tMap.forEach((origIdx, strippedIdx) => { matchedFull[origIdx] = matchedStripped[strippedIdx]; });
  const missed = tMap.filter((origIdx, strippedIdx) => !matchedStripped[strippedIdx]).map((origIdx) => chars[origIdx]);
  const correctCount = matchedStripped.filter(Boolean).length;
  const percent = m > 0 ? Math.round((correctCount / m) * 100) : 0;
  return { chars, matchedFull, percent, missed: [...new Set(missed)] };
}

function scoreColor(percent) {
  return percent >= 85 ? "#4CAF8E" : percent >= 60 ? "#E8B84B" : "#E74C3C";
}

function scoreFeedback(percent) {
  if (percent >= 95) return "Xuất sắc! Phát âm gần như hoàn hảo.";
  if (percent >= 85) return "Rất tốt! Chỉ còn vài chỗ nhỏ cần chỉnh.";
  if (percent >= 60) return "Khá ổn — nghe chậm lại các từ chưa chuẩn rồi thử lại nhé.";
  return "Cần luyện thêm — hãy nghe kỹ câu mẫu (thử tốc độ chậm) trước khi ghi âm lại.";
}

// Vòng tròn điểm số kiểu ELSA Speak — trực quan hơn thanh ngang, dễ tạo cảm
// giác "muốn đạt điểm cao hơn" để thúc đẩy luyện lại.
function ScoreRing({ percent, size = 96 }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = scoreColor(percent);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(128,128,128,.25)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c - (percent / 100) * c} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fontSize={20} fontWeight={800}
        fill={color} style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}>
        {percent}%
      </text>
    </svg>
  );
}

const MAX_RECORD_SECONDS = 15;

export default function ShadowingMode({ sentences, accentColor, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | listening | shadowing | countdown | recording | recorded | evaluated
  const [countdown, setCountdown] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [bestScores, setBestScores] = useState({}); // { [sentenceIdx]: bestPercent } — trong phiên học này
  const evaluated = useRef(new Set());
  const completedRef = useRef(false);
  const countdownTimer = useRef(null);
  const recognitionRef = useRef(null);
  const recordTimer = useRef(null);

  // Dọn dẹp mic/timer khi rời khỏi chế độ Shadowing giữa chừng (chuyển bước
  // khác trong toolbar) để tránh ghi âm chạy ngầm sau khi đã rời trang.
  useEffect(() => {
    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
      if (recordTimer.current) clearInterval(recordTimer.current);
      if (recognitionRef.current) { recognitionRef.current.onend = null; recognitionRef.current.abort(); }
    };
  }, []);

  if (!sentences.length) return <p className="text-chu-nhat text-center">Chưa có câu ví dụ cho khóa học này.</p>;

  const sentence = sentences[idx];

  const startShadow = () => {
    speak(sentence.zh);
    setPhase("listening");
    setTimeout(() => setPhase("shadowing"), 3500);
  };

  // Đếm ngược 3-2-1 trước khi mic thực sự bắt đầu nghe, để học viên có thời
  // gian chuẩn bị hơi/tư thế miệng thay vì bị ghi âm ngay lập tức khi vừa bấm.
  const beginCountdown = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ nhận giọng nói. Hãy dùng Chrome.");
      return;
    }
    setPhase("countdown");
    let c = 3;
    setCountdown(c);
    countdownTimer.current = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(countdownTimer.current);
        setCountdown(null);
        actuallyRecord();
      } else {
        setCountdown(c);
      }
    }, 700);
  };

  const clearRecordTimer = () => {
    if (recordTimer.current) { clearInterval(recordTimer.current); recordTimer.current = null; }
  };

  // Dừng ghi âm chủ động (do học viên bấm nút, hết giờ tối đa, hoặc chuyển
  // câu/thử lại) — không set phase ở đây, việc chuyển sang "recorded" chỉ xảy
  // ra trong onend, tức là khi mic THỰC SỰ đã dừng ghi, không phải chỉ vừa có
  // 1 kết quả tạm thời.
  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  // continuous + interimResults để mic không tự cắt ngay sau vài chữ đầu tiên
  // (như trước đây), mà chờ học viên nói xong cả câu hoặc tự bấm dừng. Có giới
  // hạn thời gian tối đa để tránh treo ghi âm nếu quên bấm dừng.
  const actuallyRecord = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "zh-CN"; r.continuous = true; r.interimResults = true;
    let finalText = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setTranscript((finalText + interim).trim());
    };
    r.onerror = () => stopRecording();
    r.onend = () => {
      if (recognitionRef.current !== r) return; // callback trễ từ 1 phiên ghi âm cũ, bỏ qua
      recognitionRef.current = null;
      clearRecordTimer();
      setPhase("recorded");
    };
    recognitionRef.current = r;
    r.start();
    setPhase("recording");
    setRecordingSeconds(0);
    recordTimer.current = setInterval(() => {
      setRecordingSeconds((s) => {
        if (s + 1 >= MAX_RECORD_SECONDS) stopRecording();
        return s + 1;
      });
    }, 1000);
  };

  const retry = () => {
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    clearRecordTimer();
    if (recognitionRef.current) { recognitionRef.current.onend = null; recognitionRef.current.abort(); recognitionRef.current = null; }
    setPhase("ready"); setTranscript(""); setCountdown(null); setRecordingSeconds(0);
  };
  const next = () => {
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    clearRecordTimer();
    if (recognitionRef.current) { recognitionRef.current.onend = null; recognitionRef.current.abort(); recognitionRef.current = null; }
    setIdx((i) => (i + 1) % sentences.length); setPhase("ready"); setTranscript(""); setAttempts(0); setCountdown(null); setRecordingSeconds(0);
  };

  const phaseColors = { ready: "#2A4A7F", listening: "#E8B84B", shadowing: "#4CAF8E", countdown: "#E8B84B", recording: "#E74C3C", recorded: accentColor, evaluated: accentColor };
  const scored = phase === "evaluated" && transcript ? scorePronunciation(sentence.zh, transcript) : null;
  const bestScore = bestScores[idx];

  const evaluate = () => {
    const result = scorePronunciation(sentence.zh, transcript);
    setAttempts((a) => a + 1);
    setBestScores((prev) => ({ ...prev, [idx]: Math.max(prev[idx] || 0, result.percent) }));
    setPhase("evaluated");
    // Chỉ báo hoàn thành khi đã đánh giá ghi âm cho hết mọi câu trong bài,
    // không phải chỉ mở trang lên.
    evaluated.current.add(idx);
    if (!completedRef.current && evaluated.current.size >= sentences.length) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  return (
    <div className="max-w-[520px] mx-auto px-4 text-center">
      <div className="text-chu-nhat text-[13px] mb-5">Shadowing: Nghe → Nhại lại theo • {idx + 1}/{sentences.length}
        {bestScore !== undefined && <span style={{ color: scoreColor(bestScore) }}> · Điểm cao nhất {bestScore}%</span>}
      </div>
      <div className="bg-dem-nhat rounded-2xl p-7 mb-5" style={{ border: `2px solid ${phaseColors[phase]}44` }}>
        {phase === "ready" && <div className="text-chu-mo text-sm mb-3">Nhấn để bắt đầu nghe câu mẫu</div>}
        {phase === "listening" && <div className="text-[#E8B84B] text-sm mb-3">🎧 Đang phát âm... hãy nghe thật kỹ</div>}
        {phase === "shadowing" && <div className="text-xanh-luc text-sm mb-3">🎤 Sẵn sàng nhại lại thì bấm "Ghi âm"</div>}
        {phase === "countdown" && (
          <div className="mb-3">
            <div className="text-4xl font-bold" style={{ color: "#E8B84B" }}>{countdown}</div>
            <div className="text-[#E8B84B] text-sm mt-1">Chuẩn bị... sắp ghi âm</div>
          </div>
        )}
        {phase === "recording" && (
          <div className="text-[#E74C3C] text-sm mb-3 animate-pulse">
            🔴 Đang ghi âm — nói cả câu rồi bấm "Dừng ghi âm" ({recordingSeconds}s/{MAX_RECORD_SECONDS}s)
          </div>
        )}
        {phase === "recorded" && <div className="text-sm mb-3" style={{ color: accentColor }}>🎙 Đã ghi âm xong — bấm "Đánh giá ghi âm" để chấm điểm</div>}

        {phase === "evaluated" && scored && (
          <div className="flex flex-col items-center mb-4">
            <ScoreRing percent={scored.percent} />
            <div className="text-sm mt-2 font-semibold" style={{ color: scoreColor(scored.percent) }}>{scoreFeedback(scored.percent)}</div>
          </div>
        )}

        {scored ? (
          <div className="text-2xl font-serif leading-relaxed text-chu-ngoc">
            {scored.chars.map((c, i) => (
              <span key={i} style={{ color: PUNCT.test(c) ? "inherit" : (scored.matchedFull[i] ? "#4CAF8E" : "#E74C3C") }}>
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div className={`text-2xl font-serif leading-relaxed ${phase === "ready" ? "text-chu-mo" : "text-chu-ngoc"}`}>
            {phase === "ready" ? "？？？" : sentence.zh}
          </div>
        )}
        {phase !== "ready" && <div className="text-chu-nhat text-[13px] mt-2">{sentence.pinyin}</div>}
        {phase !== "ready" && <div className="text-chu-nhat text-sm mt-1.5">{sentence.vi}</div>}
      </div>

      {(phase === "recording" || phase === "recorded") && transcript && (
        <div className="bg-dem-nhat-2 border border-vien-dem rounded-xl p-4 mb-4">
          <div className="text-chu-nhat text-xs mb-1.5">{phase === "recording" ? "Đang nghe được:" : "Bạn đã nói:"}</div>
          <div className="text-chu-ngoc text-lg font-serif">{transcript}</div>
        </div>
      )}

      {scored && (
        <div className="bg-dem-nhat-2 border border-vien-dem rounded-xl p-4 mb-4">
          <div className="text-chu-nhat text-xs mb-1.5">Bạn đã nói:</div>
          <div className="text-chu-ngoc text-lg font-serif mb-2">{transcript}</div>
          {scored.missed.length > 0 ? (
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-chu-nhat text-[11px]">Cần luyện thêm:</span>
              {scored.missed.map((c) => (
                <span key={c} className="text-[13px] font-serif font-bold rounded-md px-1.5"
                  style={{ color: "#E74C3C", background: "#E74C3C22" }}>{c}</span>
              ))}
            </div>
          ) : (
            <div className="text-[11px]" style={{ color: "#4CAF8E" }}>Tất cả các chữ đều phát âm đúng thứ tự 🎉</div>
          )}
        </div>
      )}

      <div className="flex gap-2.5 justify-center flex-wrap">
        {phase === "ready" && (
          <>
            <button onClick={startShadow} className="px-8 py-3.5 border-none rounded-2xl text-base font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>▶ Bắt đầu</button>
            <button onClick={() => speak(sentence.zh, "zh-CN", 0.55)} className="px-5 py-3.5 bg-dem-nhat rounded-2xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>🐢 Nghe chậm</button>
          </>
        )}
        {phase === "shadowing" && (
          <button onClick={beginCountdown} className="px-8 py-3.5 bg-[#E74C3C] border-none text-white rounded-2xl text-base font-bold animate-pulse">🎤 Ghi âm</button>
        )}
        {phase === "countdown" && (
          <button onClick={retry} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>✕ Hủy</button>
        )}
        {phase === "recording" && (
          <button onClick={stopRecording} className="px-8 py-3.5 bg-[#E74C3C] border-none text-white rounded-2xl text-base font-bold">⏹ Dừng ghi âm</button>
        )}
        {phase === "recorded" && (
          <>
            <button onClick={retry} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>↩ Thử lại</button>
            <button onClick={() => speak(sentence.zh, "zh-CN", 0.55)} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>🐢 Nghe chậm</button>
            <button onClick={() => speak(sentence.zh)} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>🔊 Nghe lại</button>
            <button onClick={evaluate} className="px-6 py-3 border-none rounded-xl font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>📊 Đánh giá ghi âm</button>
          </>
        )}
        {phase === "evaluated" && (
          <>
            <button onClick={retry} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>↩ Thử lại</button>
            <button onClick={() => speak(sentence.zh, "zh-CN", 0.55)} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>🐢 Nghe chậm</button>
            <button onClick={() => speak(sentence.zh)} className="px-5 py-3 bg-dem-nhat rounded-xl" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>🔊 Nghe lại</button>
            <button onClick={next} className="px-6 py-3 border-none rounded-xl font-bold" style={{ background: accentColor, color: "#0F1A2E" }}>Câu tiếp →</button>
          </>
        )}
      </div>
    </div>
  );
}
