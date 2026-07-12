/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "do-han": "#C0392B",   // Đỏ Hán — màu chủ đạo, nút CTA
        "muc-dem": "#1A1A2E",  // Mực Đêm — nền tối, navbar
        "vang-kim": "#F0A500", // Vàng Kim — điểm nhấn, badge HOT

        // Bảng màu trang học (flashcard/quiz/hanzi/...) — trỏ tới biến CSS
        // (định nghĩa ở index.css, dạng "R G B") để nút sáng/tối đổi được cả
        // bộ cùng lúc. Dùng rgb(var(...) / <alpha-value>) để Tailwind giữ
        // nguyên tham chiếu biến thay vì tính cứng màu lúc build.
        "dem-sau": "rgb(var(--dem-sau) / <alpha-value>)",
        "dem-nhat": "rgb(var(--dem-nhat) / <alpha-value>)",
        "dem-nhat-2": "rgb(var(--dem-nhat-2) / <alpha-value>)",
        "dem-toi": "rgb(var(--dem-toi) / <alpha-value>)",
        "vien-dem": "rgb(var(--vien-dem) / <alpha-value>)",
        "chu-ngoc": "rgb(var(--chu-ngoc) / <alpha-value>)",
        "chu-nhat": "rgb(var(--chu-nhat) / <alpha-value>)",
        "chu-mo": "rgb(var(--chu-mo) / <alpha-value>)",
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
