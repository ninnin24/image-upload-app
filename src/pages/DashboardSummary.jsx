import React, { useEffect, useState } from 'react';
import axios from 'axios';
// ⭐️ 1. ลบ imports ที่ไม่ได้ใช้ออก (BarChart, Link)
import { useNavigate } from 'react-router-dom';

// ⭐️ 2. API_URL (ถูกต้องแล้ว)
const API_URL = 'http://172.18.20.45:8080';

const DashboardSummary = () => {
  const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
  const [recentFiles, setRecentFiles] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [summaryRes, filesRes] = await Promise.all([
          axios.get(`${API_URL}/admin/summary`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/files`, { withCredentials: true })
        ]);

        setSummary(summaryRes.data);
        setRecentFiles(filesRes.data.slice(0, 5)); // ⭐️ ใช้ recentFiles

      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);

        if (err.response && err.response.status === 401) {
          alert('เซสชันของคุณหมดอายุ หรือไม่มีสิทธิ์เข้าถึง กรุณาล็อกอินใหม่');
          navigate('/login');
        } else if (err.response && err.response.status === 404) {
          setError('ไม่พบ API Endpoint (404)');
        } else {
          setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]); 

  // --- (ฟังก์ชัน format) ---
  const formatDate = date => new Date(date).toLocaleString();
  const formatFileSize = bytes => {
    if (!bytes) return '0 Bytes';
    const k = 1024, s = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
  };

  // --- (ส่วนแสดงผล Loading/Error) ---
  if (isLoading) {
    return <div className="admin-content-box">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="admin-content-box" style={{ color: 'red' }}>{error}</div>;
  }

  // --- ⭐️ 3. นี่คือ return ที่ถูกต้อง (มีแค่ 1 อัน) ---
  return (
    <>
      <div className="summary-cards-container">
        <div className="summary-card primary">
          <h4>รวมจำนวนบริษัท</h4>
          <p>{summary.companies}</p>
        </div>
        <div className="summary-card secondary">
          <h4>รวมจำนวนผู้ใช้ทั้งหมด</h4>
          <p>{summary.users}</p>
        </div>
        <div className="summary-card tertiary">
          <h4>รวมจำนวนไฟล์ทั้งหมด</h4>
          <p>{summary.files}</p>
        </div>
      </div>

      <div className="admin-content-box">
        <h3>📄 ไฟล์ล่าสุด</h3>
        {recentFiles.length === 0 ? <p>ยังไม่มีไฟล์อัปโหลด</p> :
          recentFiles.map(f => (
            <div key={f.id} className="timeline">
              <div className="timeline-item">
                <strong>{f.filename}</strong>
                <p>บริษัท: {f.company_name}</p>
                <p>อัปโหลด: {formatDate(f.uploaded_at)}</p>
                <p>ขนาดไฟล์: {formatFileSize(f.filesize_bytes)}</p>
              </div>
            </div>
          ))
        }
      </div>
    </>  
  ); 
}; 

export default DashboardSummary;