import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

function UserDashboard({ user }) {
  const [files, setFiles] = useState([]);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);

      Promise.all([
        axios.get('/user/files', { withCredentials: true }),
        axios.get('/user/quota', { withCredentials: true })
      ])
        .then(([filesRes, quotaRes]) => {
          setFiles(filesRes.data);
          setQuota(quotaRes.data);
        })
        .catch(err => {
          console.error("Failed to fetch dashboard data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getQuotaData = () => {
    if (!quota || quota.is_unlimited) return null;

    const quotaBytes = quota.storage_quota_gb.Float64 * 1024 * 1024 * 1024;
    const usedBytes = quota.storage_used_bytes;
    const freeBytes = Math.max(0, quotaBytes - usedBytes);

    return [
      { name: 'พื้นที่ใช้งาน', value: usedBytes },
      { name: 'พื้นที่ว่าง', value: freeBytes },
    ];
  };

  const chartData = getQuotaData();
  const COLORS = ['#FF8042', '#00C49F'];

  if (loading)
    return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลด...</div>;

  return (
    <div className="home-container">
      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.username || 'User'}</h1>
        <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      {quota && !quota.is_unlimited && chartData && (
        <div className="container quota-container">
          <h2>ภาพรวมพื้นที่จัดเก็บ</h2>

          {/* ⭐️ 1. div แม่ (ถูกต้องแล้ว) */}
          <div style={{ width: '100%', height: 300, display: 'flex' }}>
 
            {/* ⭐️ 2. แก้ไข Container ของ Chart */}
            <ResponsiveContainer width="40%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatFileSize(value)} />
              </PieChart>
            </ResponsiveContainer>

            {/* ⭐️ 3. แก้ไข Container ของ Legend */}
            <div className="quota-legend" style={{ width: '60%' }}>
              <h3>{`โควต้าทั้งหมด: ${quota.storage_quota_gb.Float64} GB`}</h3>
              <ul>
                <li style={{ color: COLORS[0] }}>
                  <strong>พื้นที่ใช้งาน:</strong> {formatFileSize(quota.storage_used_bytes)}
                </li>
                <li style={{ color: COLORS[1] }}>
                  <strong>พื้นที่ว่าง:</strong> {formatFileSize(chartData[1].value)}
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {quota && quota.is_unlimited && (
        <div className="container quota-container">
          <h2>ภาพรวมพื้นที่จัดเก็บ</h2>
          <p>คุณได้รับสิทธิ์การใช้งานพื้นที่แบบไม่จำกัด</p>
        </div>
      )}

      <div className="container">
        <h2>ไฟล์ล่าสุด (5 รายการ)</h2>
        {files.length === 0 ? (
          <p>คุณยังไม่มีไฟล์</p>
        ) : (
          files.slice(0, 5).map(file => (
            <div key={file.id} className="timeline-item">
              <strong>{file.filename}</strong>
              <p>ขนาด: {formatFileSize(file.file_size_bytes)}</p>
              <p>อัปโหลดวันที่: {new Date(file.uploaded_at).toLocaleString('th-TH')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDashboard;