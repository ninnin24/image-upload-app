import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Home.css'; // ใช้สไตล์เดียวกับ HomeDashboard
import axios from 'axios';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    axios.get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('ไม่สามารถดึงข้อมูลผู้ใช้:', err);
        setLoading(false);
      });
  }, []);

  // โหลดไฟล์ของผู้ใช้
  useEffect(() => {
    if (!loading && user) {
      axios.get('http://172.18.20.45:8080/api/user/myfiles', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(err => console.error('โหลดไฟล์ล้มเหลว:', err));
    }
  }, [loading, user]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login', { replace: true });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '1.6em', fontWeight: 'bold' }}>HappySoft</span>
        </div>

        <nav>
          <Link to="/home">หน้าหลัก</Link>
          <Link to="/about">เกี่ยวกับ</Link>
          <Link to="/user/dashboard" className="active">แดชบอร์ดของฉัน</Link>
        </nav>

        <div className="user-info">
          {user && <span>{user.role}</span>}
          <span style={{ marginLeft: '8px' }}>👤</span>
          <button className="sidebar-btn logout" style={{ marginLeft: '10px' }} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.name || 'ผู้ใช้'}</h1>
        <p>จัดการไฟล์กิจกรรมของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {/* Main Content */}
      <div className="container">
        <h2>ไฟล์ของฉัน</h2>

        {files.length === 0 ? (
          <div>
            <p>คุณยังไม่ได้อัปโหลดไฟล์ใด ๆ</p>
            <button className="action-button primary-orange-bg">🚀 อัปโหลดไฟล์ใหม่</button>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file) => (
              <div key={file.id} className="timeline">
                <div className="timeline-item">
                  <strong>{file.filename}</strong>
                  <p>อัปโหลด: {new Date(file.uploaded_at).toLocaleString()}</p>
                  <p>ขนาดไฟล์: {formatFileSize(file.filesize_bytes)}</p>
                  <p>บริษัท: {file.company_name || 'N/A'}</p>
                  <div style={{ marginTop: '5px' }}>
                    <button className="table-action-btn download">ดาวน์โหลด</button>
                    <button className="table-action-btn delete">ลบ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
