import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function UploadImage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // เลือกไฟล์
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // กรองเฉพาะไฟล์ภาพ
    const imageFiles = files.filter(file =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );

    if (imageFiles.length !== files.length) {
      alert("สามารถอัปโหลดได้เฉพาะไฟล์ภาพ JPEG, JPG, PNG เท่านั้น");
    }

    setSelectedFiles(imageFiles);
  };

  // อัปโหลดไฟล์
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      return alert("กรุณาเลือกไฟล์ภาพก่อนอัปโหลด");
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('file', file)); // ✅ field name ต้องเป็น "file"

    try {
      await axios.post(
        'http://172.18.20.45:8080/upload', // URL backend
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true // ✅ ส่ง cookie JWT
        }
      );

      alert(`${selectedFiles.length} ไฟล์ภาพถูกอัปโหลดเรียบร้อย!`);
      setSelectedFiles([]);
      navigate('/home'); // กลับหน้า HomeDashboard
    } catch (err) {
      console.error(err.response || err);
      alert(
        'อัปโหลดล้มเหลว! ตรวจสอบ backend, CORS และ field name ของไฟล์ (ต้องเป็น "file")'
      );
    }
  };

  return (
    <div className="upload-container">
      <h2>อัปโหลดไฟล์ภาพกิจกรรม (JPEG, JPG, PNG)</h2>
      <input
        type="file"
        multiple
        accept=".jpeg,.jpg,.png"
        onChange={handleFileSelect}
      />

      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <p>ไฟล์ภาพที่เลือก:</p>
          <ul>
            {selectedFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload}>🚀 อัปโหลดไฟล์</button>
    </div>
  );
}

export default UploadImage;
