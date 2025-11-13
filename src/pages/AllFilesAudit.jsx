import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const AllFilesAudit = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    company: '',
    startDate: '',
    endDate: ''
  });

  // ดึงไฟล์ทั้งหมด
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true });
        setFiles(res.data);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลไฟล์ทั้งหมดได้');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // ฟอร์แมตขนาดไฟล์
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(2) + ' ' + sizes[i];
  };

  // ตัวกรองไฟล์
  const filteredFiles = files.filter(file => {
    const matchCompany = filter.company ? file.company_name === filter.company : true;
    const matchStart = filter.startDate ? new Date(file.created_at) >= new Date(filter.startDate) : true;
    const matchEnd = filter.endDate ? new Date(file.created_at) <= new Date(filter.endDate) : true;
    return matchCompany && matchStart && matchEnd;
  });

  // รายชื่อบริษัทไม่ซ้ำ สำหรับ dropdown
  const companies = [...new Set(files.map(f => f.company_name))];

  if (loading) return <p>กำลังโหลดรายการไฟล์ทั้งหมด...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div className="admin-content-box">
      <h3>📁 ดูไฟล์ทั้งหมด ({filteredFiles.length})</h3>
      <div className="filter-controls">
        <select
          value={filter.company}
          onChange={e => setFilter({ ...filter, company: e.target.value })}
        >
          <option value="">ดูทุกบริษัท</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

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

        <button onClick={() => setFilter({ company:'', startDate:'', endDate:'' })}>
          รีเซ็ต
        </button>
      </div>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <p>ไม่พบไฟล์ที่ตรงกับเงื่อนไข</p>
      ) : (
        filteredFiles.map(f => (
          <div key={f.id} className="timeline">
            <div className="timeline-item">
              <strong>{f.file_name}</strong>
              <p>บริษัท: {f.company_name}</p>
              <p>อัปโหลด: {new Date(f.created_at).toLocaleString()}</p>
              <p>ขนาดไฟล์: {formatFileSize(f.filesize_bytes)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllFilesAudit;
