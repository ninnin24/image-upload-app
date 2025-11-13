import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VscFile } from "react-icons/vsc";
import '../styles/DashboardSummary.css'; // ← เผื่อจัดสไตล์เพิ่ม

const DashboardSummary = () => {
  const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    axios.get('http://172.18.20.45:8080/admin/summary', { withCredentials: true })
      .then(res => {
      const data = res.data;
      setSummary({
        companies: data.total_companies,
        users: data.total_users,
        files: data.total_files,
      });
    })
    .catch(err => console.error(err));

    axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true })
      .then(res => setRecentFiles(res.data.slice(0,5)))
      .catch(err => console.error(err));
  }, []);

  const formatDate = date => new Date(date).toLocaleString();
  const formatFileSize = bytes => {
    if (!bytes) return '0 Bytes';
    const k = 1024, s = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
  };

  const chartData = [
    { name: 'บริษัท', value: summary.companies },
    { name: 'ผู้ใช้', value: summary.users },
    { name: 'ไฟล์', value: summary.files },
  ];

  return (
    <div className="dashboard-summary-container">
      <div className="summary-graph-box">
        <h3>ภาพรวมระบบ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#007bff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-content-box">
        <h3><VscFile size={20} style={{ marginRight: '8px' }} />ไฟล์ล่าสุด</h3>
        {recentFiles.length === 0 ? (
          <p>ยังไม่มีไฟล์อัปโหลด</p>
        ) : (
          recentFiles.map(f => (
            <div key={f.id} className="timeline-item">
              
              {/* ⭐️ 1. แก้ไข: จาก f.filename เป็น f.file_name */}
              <strong>{f.file_name}</strong>
              
              <p>บริษัท: {f.company_name}</p> 
              
              {/* ⭐️ 2. แก้ไข: จาก f.uploaded_at เป็น f.created_at */}
              <p>อัปโหลด: {formatDate(f.created_at)}</p>
              
              <p>ขนาดไฟล์: {formatFileSize(f.file_size_bytes)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
