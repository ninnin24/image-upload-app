import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function HomeDashboard() {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    company: '',
    uploader: '',
    startDate: '',
    endDate: ''
  });

  const navigate = useNavigate();

  // ✅ ตรวจสอบ cookie เพื่อดึงข้อมูลผู้ใช้
  useEffect(() => {
    axios
      .get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => {
        setUser(res.data); // { username, role, ... }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ โหลดไฟล์ตามสิทธิ์ของผู้ใช้
  const fetchFiles = async () => {
    try {
      let url = '';

      if (user?.role === 'ผู้ดูแลระบบ') {
        url = 'http://172.18.20.45:8080/admin/files';
      } else if (user?.role === 'ผู้ใช้งานทั่วไป') {
        url = 'http://172.18.20.45:8080/user/files';
      } else {
        url = 'http://172.18.20.45:8080/files/public';
      }

      const res = await axios.get(url, { withCredentials: true });
      setFiles(res.data);
    } catch (err) {
      console.error('โหลดไฟล์ล้มเหลว:', err);
      setFiles([]);
    }
  };

  // ✅ โหลดไฟล์หลังจากรู้ข้อมูล user แล้ว
  useEffect(() => {
    if (user !== null) fetchFiles();
  }, [user]);

  // ✅ ตัวกรองไฟล์
  const filteredFiles = files.filter(file => {
    const matchCompany = filter.company ? file.company_name?.includes(filter.company) : true;
    const matchUploader = filter.uploader ? file.uploader_name?.includes(filter.uploader) : true;
    const matchDateStart = filter.startDate ? new Date(file.uploaded_at) >= new Date(filter.startDate) : true;
    const matchDateEnd = filter.endDate ? new Date(file.uploaded_at) <= new Date(filter.endDate) : true;
    return matchCompany && matchUploader && matchDateStart && matchDateEnd;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="home-container">
      {/* ✅ Header */}
      <header className="home-header">
        <div
          className="home-logo"
          onClick={() => navigate('/home')}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.6em', fontWeight: 'bold' }}>HappySoft</span>
        </div>

        <nav>
          <Link to="/home" className="active">หน้าหลัก</Link>
          <Link to="/uploadimage">อัปโหลดไฟล์</Link>
          <Link to="/my-list">รายการของฉัน</Link>
          <Link to="/about">เกี่ยวกับ</Link>
        </nav>

        <div className="user-info">
          <span>{user ? user.role : 'ผู้เยี่ยมชม'}</span>
          <span style={{ marginLeft: '8px' }}>👤</span>
        </div>
      </header>

      {/* ✅ ปุ่มกลับแดชบอร์ด (เฉพาะแอดมิน) */}
      {user?.role === 'ผู้ดูแลระบบ' && (
        <div style={{ margin: '15px 0', textAlign: 'right' }}>
          <button
            className="sidebar-btn primary-orange-bg"
            onClick={() => navigate('/admin/dashboard')}
          >
            ← กลับแดชบอร์ดผู้ดูแล
          </button>
        </div>
      )}

      {/* ✅ Hero Section */}
      <section className="hero">
        <h1>ยินดีต้อนรับสู่ HappySoft</h1>
        <p>จัดการไฟล์กิจกรรมของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {/* ✅ ตัวกรองไฟล์ (เฉพาะแอดมิน) */}
      {user?.role === 'ผู้ดูแลระบบ' && (
        <div className="filter-section">
          <h3>🔍 ตัวกรองไฟล์</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="ค้นหาบริษัท..."
              value={filter.company}
              onChange={e => setFilter({ ...filter, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="ค้นหาผู้เพิ่มไฟล์..."
              value={filter.uploader}
              onChange={e => setFilter({ ...filter, uploader: e.target.value })}
            />
            <input
              type="date"
              value={filter.startDate}
              onChange={e => setFilter({ ...filter, startDate: e.target.value })}
            />
            <input
              type="date"
              value={filter.endDate}
              onChange={e => setFilter({ ...filter, endDate: e.target.value })}
            />
            <button onClick={fetchFiles}>รีเซ็ต</button>
          </div>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="container">
        <h2>ไฟล์ล่าสุด</h2>

        {filteredFiles.length === 0 ? (
          <p className="no-files">ยังไม่มีไฟล์อัปโหลด</p>
        ) : (
          <div className="file-list">
            {filteredFiles.map((file, idx) => (
              <div key={idx} className="timeline">
                <div className="timeline-item">
                  <strong>{file.filename}</strong>
                  <p>บริษัท: {file.company_name || 'ไม่ระบุ'}</p>
                  <p>อัปโหลดโดย: {file.uploader_name || 'ไม่ระบุ'}</p>
                  <p>วันที่: {new Date(file.uploaded_at).toLocaleString()}</p>

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
