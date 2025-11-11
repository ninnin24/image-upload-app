import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';

function UserDashboard({ user }) {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (user) {
      axios.get('/user/files', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="home-container">
      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.username || 'User'}</h1>
        <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {/* ไฟล์ของ user */}
      <div className="container">
        <h2>ไฟล์ของฉัน</h2>
        {files.length === 0 ? (
          <p>คุณยังไม่มีไฟล์</p>
        ) : (
          files.map(file => (
            <div key={file.id} className="timeline-item">
              <strong>{file.filename}</strong>
              <p>อัปโหลดวันที่: {new Date(file.uploaded_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDashboard;