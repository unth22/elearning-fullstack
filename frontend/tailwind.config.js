/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "do-han": "#C0392B",   // Đỏ Hán — màu chủ đạo, nút CTA
        "muc-dem": "#1A1A2E",  // Mực Đêm — nền tối, navbar
        "vang-kim": "#F0A500", // Vàng Kim — điểm nhấn, badge HOT

        // Bảng màu trang học (flashcard/quiz/hanzi/...)
        "dem-sau": "#0F1A2E",   // nền chính trang học
        "dem-nhat": "#1E3A5F",  // nền thẻ/card
        "dem-nhat-2": "#0F2840", // nền thẻ (gradient/alt)
        "dem-toi": "#091525",   // nền sidebar/topbar
        "vien-dem": "#2A4A7F",  // viền card/input
        "chu-ngoc": "#F0EDE4",  // chữ chính (trên nền tối)
        "chu-nhat": "#8BA3C0",  // chữ phụ (trên nền tối)
        "chu-mo": "#4A6A8A",    // chữ mờ/placeholder (trên nền tối)
        "xanh-luc": "#4CAF8E",  // xanh lá — trạng thái đúng/thành công
      },
      fontFamily: {
        sans: ["Inter", "Sora", "sans-serif"],
        serif: ["Noto Serif SC", "serif"],
      },
    },
  },
  plugins: [],
};
