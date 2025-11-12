import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/UploadImage.css'; // ใช้ไฟล์ CSS ที่คุณมี
import { FaFileUpload } from 'react-icons/fa'; // ⭐️ อย่าลืม import ไอคอน

function UploadImage({ user }) {
  const [files, setFiles] = useState([]); // ⭐️ 1. เปลี่ยน State เป็น Array
  const [isDragging, setIsDragging] = useState(false); 
  const fileInputRef = useRef(null); 

  const handleUpload = async () => {
    if (files.length === 0) return alert('กรุณาเลือกไฟล์ก่อน!'); // ⭐️ 2. ตรวจสอบ Array
    
    const formData = new FormData();
    // ⭐️ 3. วนลูปเพื่อยัดไฟล์ทั้งหมดลง Form
    for (const file of files) {
      formData.append('file', file); // ใช้ key 'file' สำหรับทุกไฟล์
    }

    try {
      // ⭐️ 4. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
      const res = await axios.post('/upload', formData, { 
        withCredentials: true,
      });
      
      alert(res.data.message || 'อัปโหลดสำเร็จ!'); // ⭐️ 5. แสดงข้อความจาก Server
      setFiles([]); // ⭐️ 6. ล้าง Array หลังอัปโหลด
      fileInputRef.current.value = null; // เคลียร์ค่าใน input
    } catch (e) {
      alert('อัปโหลดล้มเหลว');
    }
  };

  // --- ส่วนจัดการ Drag-and-Drop ---
  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFiles([...droppedFiles]); // ⭐️ 7. แปลง FileList เป็น Array
    }
  };

  // --- ส่วนจัดการ Input ---
  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setFiles([...selectedFiles]); // ⭐️ 8. แปลง FileList เป็น Array
    }
  };

  const onDropZoneClick = () => {
    fileInputRef.current.value = null; // เคลียร์ค่าเก่า
    fileInputRef.current.click();
  };

  // --- ฟังก์ชันช่วยแสดงรายชื่อไฟล์ ---
  const renderFileNames = () => {
    if (files.length === 0) {
      // ⭐️ 9. UI เริ่มต้น (อันเก่าของคุณ)
      return (
        <>
          <FaFileUpload size={40} className="drop-zone-icon" />
          <p>ยังไม่ได้เลือกไฟล์</p>
        </>
      );
    }
    return (
      <ul className="file-list">
        {/* ⭐️ 10. UI ใหม่ (เมื่อมีไฟล์) */}
        {Array.from(files).map((file, index) => (
          <li key={index}>
            {file.name} ({ (file.size / 1024 / 1024).toFixed(2) } MB)
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="upload-container">
      <h2> อัปโหลดไฟล์</h2>
      <p>ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์</p>

      <div 
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onDropZoneClick}
      >
        <input 
          type="file" 
          onChange={handleFileSelect} 
          ref={fileInputRef}
          style={{ display: 'none' }} 
          multiple // ⭐️ 11. เพิ่ม 'multiple' attribute
        />
        
        <div className="drop-zone-content">
          {renderFileNames()} 
        </div>
      </div>

      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={files.length === 0} // ⭐️ 12. ตรวจสอบ Array
      >
        อัปโหลด ({files.length} ไฟล์)
      </button>
    </div>
  );
}

export default UploadImage;