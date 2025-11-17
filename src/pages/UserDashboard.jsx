import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Home.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ตรวจสอบว่า user ยังล็อกอินอยู่หรือไม่
  useEffect(() => {
    axios.get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ดึงไฟล์ของ user
  useEffect(() => {
    if (user) {
      axios.get('http://172.18.20.45:8080/user/myfiles', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('http://172.18.20.45:8080/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout failed:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลด...</div>;

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/user/dashboard')}>FileFlowz</div>
        <nav>
          <Link to="/user/dashboard">หน้าหลัก</Link>
          <Link to="/upload">อัปโหลดไฟล์</Link>
          <Link to="/my-list">รายการของฉัน</Link>
          <Link to="/about">เกี่ยวกับ</Link>
        </nav>
        <button onClick={handleLogout} className="sidebar-btn logout">ออกจากระบบ</button>
      </header>

      {/* Hero Section */}
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