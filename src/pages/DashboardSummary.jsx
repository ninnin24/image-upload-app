import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// (เรายังคงใช้ Relative Path/Proxy ตามที่ตั้งค่าใน package.json)

const DashboardSummary = () => {
  // ⭐️ 1. แก้ไข State เริ่มต้นให้ตรงกับที่ Go ส่งมา (แก้ว่าง่ายกว่า)
  const [summary, setSummary] = useState({ total_companies: 0, total_users: 0, total_files: 0 });
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
          axios.get(`/admin/summary`, { withCredentials: true }),
          axios.get(`/admin/files`, { withCredentials: true }) // (Endpoint นี้ส่ง ActivityLogEntry)
        ]);

        setSummary(summaryRes.data);
        setRecentFiles(filesRes.data.slice(0, 5)); 

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

  // --- (ฟังก์ชัน format ไม่ได้แก้ไข) ---
  const formatDate = date => {
    // ⭐️ 2. (เพิ่ม) ป้องกัน "Invalid Date" ถ้าข้อมูลเป็น null
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }
    return d.toLocaleString();
  }
  const formatFileSize = bytes => {
    if (!bytes) return '0 Bytes';
    const k = 1024, s = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
  };

  // --- (ส่วนแสดงผล Loading/Error ไม่ได้แก้ไข) ---
  if (isLoading) {
    return <div className="admin-content-box">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="admin-content-box" style={{ color: 'red' }}>{error}</div>;
  }

  // --- ⭐️ 3. (แก้ไข) Return JSX ---
  return (
    <>
      <div className="summary-cards-container">
        <div className="summary-card primary">
          <h4>รวมจำนวนบริษัท</h4>
          {/* ⭐️ แก้ไข: .companies -> .total_companies */}
          <p>{summary.total_companies}</p>
        </div>
        <div className="summary-card secondary">
          <h4>รวมจำนวนผู้ใช้ทั้งหมด</h4>
          {/* ⭐️ แก้ไข: .users -> .total_users */}
          <p>{summary.total_users}</p>
        </div>
        <div className="summary-card tertiary">
          <h4>รวมจำนวนไฟล์ทั้งหมด</h4>
          {/* ⭐️ แก้ไข: .files -> .total_files */}
          <p>{summary.total_files}</p>
        </div>
      </div>

      <div className="admin-content-box">
        <h3> ไฟล์ล่าสุด</h3>
        {recentFiles.length === 0 ? <p>ยังไม่มีไฟล์อัปโหลด</p> :
          recentFiles.map(f => (
            <div key={f.id} className="timeline">
              <div className="timeline-item">
                
                {/* ⭐️ แก้ไข: .filename -> .file_name */}
                <strong>{f.file_name}</strong>
                
                <p>บริษัท: {f.company_name}</p>
                
                {/* ⭐️ แก้ไข: .uploaded_at -> .created_at */}
                <p>อัปโหลด: {formatDate(f.created_at)}</p>
                
                {/* ⭐️ (หมายเหตุ) โค้ดนี้ถูกต้องแล้ว */}
                <p>ขนาดไฟล์: {formatFileSize(f.file_size_bytes)}</p>
              </div>
            </div>
          ))
        }
      </div>
    </>  
  ); 
}; 

export default DashboardSummary;