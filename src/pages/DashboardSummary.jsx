import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardSummary = () => {
  const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    axios.get('http://172.18.20.45:8080/admin/summary', { withCredentials: true })
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true })
      .then(res => setRecentFiles(res.data.slice(0,5)))
      .catch(err => console.error(err));
  }, []);

  const formatDate = date => new Date(date).toLocaleString();
  const formatFileSize = bytes => {
    if (!bytes) return '0 Bytes';
    const k=1024,s=['Bytes','KB','MB','GB'],i=Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(2)+' '+s[i];
  };

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
