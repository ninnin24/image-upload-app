import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/Home.css';

function UserDashboard({ user, onLogout }) {
  const [files, setFiles] = useState([]);

  // 🔹 useEffect เรียกเสมอ แต่ทำงานเมื่อ user มีค่า
  useEffect(() => {
    if (!user) return;

    axios
      .get('/user/files', { withCredentials: true })
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, [user]);

  // 🔹 ถ้า user ไม่มีค่า → render Navigate
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="home-container">
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <section className="hero py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับ, {user.username}</h1>
        <p className="text-lg mb-6">จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {/* ไฟล์ของ user */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">ไฟล์ของฉัน</h2>
        {files.length === 0 ? (
          <p>คุณยังไม่มีไฟล์</p>
        ) : (
          <div className="grid gap-4">
            {files.map(file => (
              <div key={file.id} className="timeline-item p-4 border rounded shadow">
                <strong>{file.filename}</strong>
                <p>อัปโหลดวันที่: {new Date(file.uploaded_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
