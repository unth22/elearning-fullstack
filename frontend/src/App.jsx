import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CourseStudyPage from "./pages/CourseStudyPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import DashboardPage from "./pages/DashboardPage";
import SrsReviewPage from "./pages/SrsReviewPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/course/:id" element={<CourseStudyPage />} />
        <Route path="/course/:id/detail" element={<CourseDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/srs-review" element={<SrsReviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
