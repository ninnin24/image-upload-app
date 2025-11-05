import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function HomeDashboard() {
  const [files, setFiles] = useState([]);
  const userRole = 'ผู้ดูแลระบบ';

  useEffect(() => {
    // โหลดไฟล์จาก backend
    axios.get('http://172.18.20.45:8080/admin/files', {
      withCredentials: true, // ✅ ส่ง cookie JWT
    })
    .then(res => setFiles(res.data))
    .catch(err => {
      console.error(err);
      alert('โหลดไฟล์ล้มเหลว! ตรวจสอบ backend และ cookie JWT');
    });
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo">
          <span style={{ fontSize: '1.6em', fontWeight: 'bold' }}>HappySoft</span>
        </div>

        <nav>
          <Link to="/home" className="active">หน้าหลัก</Link>
          <Link to="/uploadimage">อัปโหลดไฟล์</Link>
          <Link to="/my-list">รายการของฉัน</Link>
          <Link to="/about">เกี่ยวกับ</Link>
        </nav>

        <div className="user-info">
          <span>{userRole}</span>
          <span style={{ marginLeft: '8px' }}>👤</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>ยินดีต้อนรับสู่ HappySoft</h1>
        <p>จัดการไฟล์กิจกรรมของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {/* Main Content */}
      <div className="container">
        <h2>ไฟล์ล่าสุด</h2>

        {files.length === 0 ? (
          <p className="no-files">ยังไม่มีไฟล์อัปโหลด</p>
        ) : (
          <div className="file-list">
            {files.map((file, idx) => (
              <div key={idx} className="timeline">
                <div className="timeline-item">
                  <strong>{file.filename}</strong>
                  <p>อัปโหลด: {new Date(file.uploaded_at).toLocaleString()}</p>
                  {/* แสดง preview สำหรับไฟล์ภาพเท่านั้น */}
                  {file.filename.match(/\.(jpeg|jpg|png)$/i) && (
                    <img
                      src={`http://172.18.20.45:8080/${file.storage_path}`}
                      alt={file.filename}
                      style={{ maxWidth: '150px', marginTop: '8px' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeDashboard;
