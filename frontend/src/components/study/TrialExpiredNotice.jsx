export default function TrialExpiredNotice({ accentColor }) {
  return (
    <div className="max-w-xl mx-auto text-center py-10">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Đã hết hạn dùng thử 3 ngày</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        Bạn vẫn có thể xem danh sách module ở bên trái, nhưng cần nâng cấp tài khoản
        để tiếp tục xem nội dung bài giảng.
      </p>
      <button
        onClick={() => window.alert("Tính năng nâng cấp/thanh toán đang được phát triển. Vui lòng liên hệ để được hỗ trợ.")}
        style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 12,
          padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
      >
        Nâng cấp tài khoản
      </button>
    </div>
  );
}
