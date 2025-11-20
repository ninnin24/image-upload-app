import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ฟังก์ชันแปลงขนาดไฟล์ให้สวยงาม
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
  const [userActivities, setUserActivities] = useState([]);

  // ดึงข้อมูลเมื่อมี user เข้ามา
  useEffect(() => {
    if (user) {
      setLoading(true);

      Promise.all([
        axios.get('/user/files', { withCredentials: true }),
        axios.get('/user/quota', { withCredentials: true }),
        axios.get('/user/activities', { withCredentials: true })
      ])
        .then(([filesRes, quotaRes, activitiesRes]) => {
          setFiles(filesRes.data);
          setQuota(quotaRes.data);
          setUserActivities(activitiesRes.data);
        })
        .catch(err => {
          console.error("Failed to fetch dashboard data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // เตรียมข้อมูลสำหรับกราฟวงกลม
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
  const getActionColor = (action) => {
    switch (action) {
      case 'UPLOAD':
        return '#28a745'; // สีเขียว
      case 'DELETE':
        return '#dc3545'; // สีแดง
      case 'DOWNLOAD':
        return '#ffc107'; // สีเหลือง (โทน Amber ให้อ่านออก)
      default:
        return '#333';    // สีดำปกติ
    }
  };

  if (loading)
    return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลด...</div>;

  return (
    <div className="home-container">
      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.username || 'User'}</h1>
        <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>
      <div className="dashboard-content-wrapper">
        <div className="quota-section">
          <h2>ภาพรวมพื้นที่จัดเก็บ</h2>
          {quota && !quota.is_unlimited && chartData && chartData.length >= 2 ? (
            <div className="chart-content-wrapper" style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', minWidth: '300px' }}>
              <div style={{ flex: '0 0 45%', minWidth: '200px', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
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
              </div>
              <div className="quota-legend" style={{ flex: 1, paddingLeft: '15px' }}>
                <h3>{`รวม: ${quota?.storage_quota_gb?.Float64 || 0} GB`}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 12, height: 12, backgroundColor: COLORS[0], display: 'inline-block', marginRight: 8, borderRadius: 2 }}></span>
                    <strong style={{ marginRight: 5, minWidth: '80px' }}>ใช้ไป:</strong> 
                    {formatFileSize(quota?.storage_used_bytes || 0)}
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 12, height: 12, backgroundColor: COLORS[1], display: 'inline-block', marginRight: 8, borderRadius: 2 }}></span>
                    <strong style={{ marginRight: 5, minWidth: '80px' }}>ว่าง:</strong> 
                    {formatFileSize(chartData[1]?.value || 0)}
                  </li>
                </ul>
              </div>
            </div>
          ) : quota && quota.is_unlimited ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#00C49F' }}>
                พื้นที่จัดเก็บไม่จำกัด (Unlimited)
              </p>
              <p>คุณสามารถใช้งานได้อย่างเต็มที่</p>
            </div>
          ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#ccc' }}>
                ไม่มีข้อมูลการใช้งาน
              </div>
          )}
        </div>
        <div className="files-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>ไฟล์ล่าสุด</h2>
            <span style={{ fontSize: '0.9em', color: '#666', background: '#eee', padding: '2px 8px', borderRadius: '10px' }}>
              5 รายการ
            </span>
          </div>
          {files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>คุณยังไม่มีไฟล์</p>
            </div>
          ) : (
            <div className="file-list-wrapper">
              {files.slice(0, 4).map(file => (
                <div key={file.id} className="timeline-item">
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                    {file.filename}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', color: '#666' }}>
                    <span>พื้นที่ของไฟล์: {formatFileSize(file.file_size_bytes)}</span>
                    <span>วันที่อัปโหลด: {new Date(file.uploaded_at).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> 
      <div className="dashboard-content-wrapper"> 
        <div className="activities-section"> 
          <h2>กิจกรรมล่าสุด</h2>
          {userActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>ยังไม่มีกิจกรรมล่าสุด</p>
            </div>
          ) : (
            <div className="activity-list-wrapper">
              {userActivities.slice(0, 2).map(activity => (
                <div key={activity.id} className="activity-item">
                  <div style={{ fontWeight: 'bold', color: getActionColor(activity.action) }}>
                    {activity.action}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                    ชื่อไฟล์: {activity.description}
                  </div>
                  <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px', textAlign: 'right' }}>
                    วันที่: {new Date(activity.timestamp).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;