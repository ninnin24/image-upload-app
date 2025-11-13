import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx"; // เพิ่ม Header
import "../styles/Home.css";

const HomeDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // 🔹 ถ้าล็อกอินแล้ว → redirect ไปหน้า dashboard ตาม role
  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // 🔹 Landing Page สำหรับผู้ที่ยังไม่ล็อกอิน
  return (
    <div className="font-sans">
      {/* Header สำหรับ Guest */}
      <Header user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-center py-32 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          แพลตฟอร์มภาพ & วิดีโอ สำหรับองค์กรที่มั่นใจ
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          จัดเก็บ แปลง ปรับ และส่งมอบสื่อของคุณอย่างรวดเร็ว ด้วย API, SDK และระบบอัตโนมัติ
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            สมัครใช้งาน
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12">ความสามารถหลัก</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <img src="/icon-imageapi.svg" alt="API ภาพ" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">API ภาพ</h3>
            <p>เพิ่มภาพบนเว็บไซต์หรือแอปในไม่กี่นาที</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <img src="/icon-videoapi.svg" alt="API วิดีโอ" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">API วิดีโอ</h3>
            <p>เพิ่มวิดีโอพร้อมระบบแปลงและส่งแบบเรียลไทม์</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <img src="/icon-dam.svg" alt="DAM" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">จัดการสื่อ (DAM)</h3>
            <p>ไลบรารีสื่อเต็มรูปแบบ พร้อมการแท็กอัตโนมัติและควบคุมสิทธิ์</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <img src="/icon-ai.svg" alt="AI วิเคราะห์สื่อ" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI & วิเคราะห์สื่อ</h3>
            <p>ค้นหา ใช้วัตถุ และครอปอัตโนมัติด้วย AI</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-6">
          พร้อมเริ่มสร้างประสบการณ์สื่อที่น่าทึ่งแล้วหรือยัง?
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition"
        >
          เริ่มใช้งานฟรี
        </button>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12">เสียงจากลูกค้า</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="italic">
            “ระบบของเราเร็วขึ้นอย่างมีนัยสำคัญ ใช้งานง่ายกว่าเดิมมาก”
            <p className="font-semibold mt-2">– David Lien, VP of Engineering, Minted</p>
          </div>
          <div className="flex justify-center flex-wrap gap-8 mt-8">
            <img src="/client1.png" alt="Client 1" className="h-12 opacity-70 hover:opacity-100 transition" />
            <img src="/client2.png" alt="Client 2" className="h-12 opacity-70 hover:opacity-100 transition" />
            <img src="/client3.png" alt="Client 3" className="h-12 opacity-70 hover:opacity-100 transition" />
            <img src="/client4.png" alt="Client 4" className="h-12 opacity-70 hover:opacity-100 transition" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeDashboard;
