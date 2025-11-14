// HomeDashboard.jsx (ตำแหน่ง: src/pages/)

import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import HomeLandingContent from "../components/HomeLandingContent.jsx"; 

const HomeDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // ✅ ฟังก์ชันที่สั่งนำทางไปหน้า /login
  const handleLoginClick = () => {
    navigate("/login"); 
  };

  // 🔹 Logic การจัดการผู้ใช้: Redirect ถ้าล็อกอินแล้ว
  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // 🔹 Landing Page สำหรับผู้ที่ยังไม่ล็อกอิน
  // ✅ ส่งฟังก์ชันนำทาง handleLoginClick เป็น Prop onLoginClick
  return (
    <HomeLandingContent onLoginClick={handleLoginClick} />
  );
};

export default HomeDashboard;