// Dùng chung giữa wizard onboarding (CoursesPage) và trang cá nhân (ProfilePage)
// để học viên có thể sửa lại lựa chọn ban đầu sau khi đã đăng ký khóa học.
export const LEVELS = [
  { id: "new", icon: "🌱", label: "Hoàn toàn mới" },
  { id: "hsk12", icon: "📗", label: "Biết chút ít (HSK 1-2)" },
  { id: "hsk34", icon: "📘", label: "Trung cấp (HSK 3-4)" },
  { id: "hsk56", icon: "📕", label: "Cao cấp (HSK 5-6)" },
];

export const GOALS = [
  { id: "respect", icon: "🏆", label: "Làm việc hiệu quả hơn" },
  { id: "negotiate", icon: "🤝", label: "Tự đàm phán không qua phiên dịch" },
  { id: "business", icon: "🚀", label: "Chuẩn bị ra kinh doanh riêng" },
  { id: "hsk56", icon: "📜", label: "Thi lấy chứng chỉ" },
  { id: "career", icon: "💪", label: "Thăng tiến trong sự nghiệp" },
  { id: "abroad", icon: "🌏", label: "Du học / định cư" },
  { id: "hobby", icon: "❤️", label: "Sở thích cá nhân" },
  { id: "other", icon: "✨", label: "Khác", isCustom: true },
];
