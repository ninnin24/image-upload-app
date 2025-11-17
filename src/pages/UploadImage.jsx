import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/UploadImage.css'; 
// ⭐️ 1. Import ไอคอนเพิ่มสำหรับ Loading และ Status
import { 
  FaFileUpload, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationCircle 
} from 'react-icons/fa'; 

function UploadImage({ user }) {
  const [files, setFiles] = useState([]); 
  const [isDragging, setIsDragging] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); // ⭐️ 2. State สำหรับ Loading
  const [uploadStatus, setUploadStatus] = useState({ type: 'idle', message: '' }); // ⭐️ 3. State สำหรับผลลัพธ์
  const fileInputRef = useRef(null); 

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsLoading(true); // ⭐️ 4. เริ่มหมุน
    setUploadStatus({ type: 'idle', message: '' }); // ⭐️ 5. ล้างสถานะเก่า

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    try {
      const res = await axios.post('/upload', formData, { 
        withCredentials: true,
      });
      
      // ⭐️ 6. ตั้งค่าสถานะ "สำเร็จ"
      setUploadStatus({ 
        type: 'success', 
        message: res.data.message || `อัปโหลด ${files.length} ไฟล์สำเร็จ!` 
      });
      setFiles([]); 
      fileInputRef.current.value = null; 
    } catch (e) {
      // ⭐️ 7. ตั้งค่าสถานะ "ล้มเหลว"
      setUploadStatus({ type: 'error', message: 'อัปโหลดล้มเหลว กรุณาลองใหม่' });
    } finally {
      // ⭐️ 8. หยุดหมุน (ไม่ว่าจะสำเร็จหรือล้มเหลว)
      setIsLoading(false); 
    }
  };

  // ⭐️ 9. ฟังก์ชันสำหรับปุ่ม "ยกเลิก"
  const handleClearFiles = () => {
    setFiles([]);
    setUploadStatus({ type: 'idle', message: '' }); // ล้างสถานะด้วย
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // --- ส่วนจัดการ Drag-and-Drop ---
  // ⭐️ 10. ปิดการใช้งานขณะกำลังโหลด
  const handleDragOver = (e) => !isLoading && e.preventDefault();
  const handleDragEnter = (e) => !isLoading && (e.preventDefault(), setIsDragging(true));
  const handleDragLeave = (e) => !isLoading && (e.preventDefault(), setIsDragging(false));
  const handleDrop = (e) => {
    if (isLoading) return; // ถ้าโหลดอยู่ ไม่ต้องทำ
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFiles([...droppedFiles]);
      setUploadStatus({ type: 'idle', message: '' }); // ล้างสถานะเก่า
    }
  };

  // --- ส่วนจัดการ Input ---
  const handleFileSelect = (e) => {
    if (isLoading) return;
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setFiles([...selectedFiles]);
      setUploadStatus({ type: 'idle', message: '' }); // ล้างสถานะเก่า
    }
  };

  const onDropZoneClick = () => {
    if (isLoading) return; // ถ้าโหลดอยู่ ห้ามคลิก
    fileInputRef.current.value = null; 
    fileInputRef.current.click();
  };

  // --- ฟังก์ชันช่วยแสดงรายชื่อไฟล์ ---
  const renderFileNames = () => {
    // ⭐️ 11. UI ขณะกำลังโหลด
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <FaSpinner className="icon-spin" size={40} />
          <p>กำลังอัปโหลด {files.length} ไฟล์...</p>
        </div>
      );
    }
    
    if (files.length === 0) {
      return (
        <>
          <FaFileUpload size={40} className="drop-zone-icon" />
          <p>ยังไม่ได้เลือกไฟล์</p>
        </>
      );
    }

    return (
      <>
        {/* ⭐️ 12. แสดงจำนวนไฟล์ที่เลือก (ตามคำขอ) */}
        <p className="file-count">ไฟล์ที่เลือก: {files.length} ไฟล์</p>
        <ul className="file-list">
          {Array.from(files).map((file, index) => (
            <li key={index}>
              {file.name} ({ (file.size / 1024 / 1024).toFixed(2) } MB)
            </li>
          ))}
        </ul>
      </>
    );
  };

  // ⭐️ 13. ฟังก์ชันแสดงผลลัพธ์ (สำเร็จ/ล้มเหลว)
  const renderStatusMessage = () => {
    if (uploadStatus.type === 'success') {
      return (
        <div className="status-message success">
          <FaCheckCircle /> {uploadStatus.message}
        </div>
      );
    }
    if (uploadStatus.type === 'error') {
      return (
        <div className="status-message error">
          <FaExclamationCircle /> {uploadStatus.message}
        </div>
      );
    }
    return null; // 'idle' หรืออื่นๆ จะไม่แสดงอะไร
  };

  return (
    <div className="upload-container">
      <h2> อัปโหลดไฟล์</h2>
      <p>ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์</p>

      {/* ⭐️ 14. แสดงผลลัพธ์ที่นี่ */}
      {renderStatusMessage()} 

      <div 
        // ⭐️ 15. เพิ่ม class 'loading' เพื่อให้ CSS จับได้
        className={`drop-zone ${isDragging ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
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
          multiple 
          disabled={isLoading} // ⭐️ 16. ปิด input ขณะโหลด
        />
        
        <div className="drop-zone-content">
          {renderFileNames()} 
        </div>
      </div>

      {/* ⭐️ 17. กลุ่มปุ่ม (เพิ่มปุ่มยกเลิก) */}
      <div className="button-group">
        {files.length > 0 && !isLoading && (
          <button
            onClick={handleClearFiles}
            className="cancel-button"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={files.length === 0 || isLoading} // ⭐️ 18. ปิดปุ่มขณะโหลด
        >
          {isLoading ? 'กำลังอัปโหลด...' : `อัปโหลด (${files.length} ไฟล์)`}
        </button>
      </div>
    </div>
  );
}

export default UploadImage;