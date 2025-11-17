import React, { useEffect, useState, useMemo, useRef } from 'react'; // ⭐️ 1. เพิ่ม useMemo, useRef
import axios from 'axios';
import '../styles/MyListPage.css';

function MyListPage({ user }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  
  // ⭐️ 2. State สำหรับการเรียงลำดับ (Default: เรียงตามวันที่อัปโหลด, ใหม่สุดมาก่อน)
  const [sortConfig, setSortConfig] = useState({ 
    key: 'uploaded_at', 
    order: 'desc' 
  });
  
  // ⭐️ 3. Ref สำหรับ Checkbox "เลือกทั้งหมด" (เพื่อตั้งค่า indeterminate)
  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios.get('/user/files', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(() => setFiles([]))
        .finally(() => setLoading(false));
    }
  }, [user]); 

  // ⭐️ 4. (สำคัญ) ใช้ useMemo เพื่อคำนวณการเรียงลำดับ
  // โค้ดส่วนนี้จะทำงานใหม่ *เฉพาะ* เมื่อ 'files' หรือ 'sortConfig' เปลี่ยน
  const sortedFiles = useMemo(() => {
    const sortableFiles = [...files]; // คัดลอก Array ก่อน
    
    if (sortConfig.key) {
      sortableFiles.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // จัดการ String (ชื่อไฟล์) ให้เป็น case-insensitive
        if (sortConfig.key === 'filename') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // ตรรกะการเรียง
        if (aValue < bValue) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFiles;
  }, [files, sortConfig]); // <-- ทำงานใหม่เมื่อ 2 ค่านี้เปลี่ยน

  // ⭐️ 5. ฟังก์ชันสำหรับเปลี่ยนการเรียงลำดับ
  const requestSort = (key) => {
    let order = 'asc';
    
    // ถ้าคลิกคอลัมน์เดิม ให้สลับ 'asc' <-> 'desc'
    if (sortConfig.key === key) {
      order = sortConfig.order === 'asc' ? 'desc' : 'asc';
    } else {
      // ถ้าคลิกคอลัมน์ใหม่, ตั้งค่า default
      if (key === 'uploaded_at') order = 'desc'; // วันที่ (ใหม่ -> เก่า)
      else if (key === 'filename') order = 'asc'; // ชื่อ (A -> Z)
      else if (key === 'file_size_bytes') order = 'desc'; // ขนาด (ใหญ่ -> เล็ก)
    }
    
    setSortConfig({ key, order });
  };

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId);
      } else {
        newSelected.add(fileId);
      }
      return newSelected;
    });
  };

  // ⭐️ 6. คำนวณสถานะ "เลือกทั้งหมด"
  const allFileIds = sortedFiles.map(f => f.id);
  const isAllSelected = sortedFiles.length > 0 && selectedFiles.size === sortedFiles.length;
  // สถานะ "เลือกบางส่วน" (indeterminate)
  const isIndeterminate = selectedFiles.size > 0 && !isAllSelected;

  // ⭐️ 7. ฟังก์ชันสำหรับ Checkbox "เลือกทั้งหมด"
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedFiles(new Set()); // ถ้าเลือกทั้งหมดอยู่ -> ให้ยกเลิกทั้งหมด
    } else {
      setSelectedFiles(new Set(allFileIds)); // ถ้ายัง -> ให้เลือกทั้งหมด
    }
  };

  // ⭐️ 8. (สำคัญ) Effect สำหรับตั้งค่า 'indeterminate' ของ Checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedFiles.size} ไฟล์ที่เลือก?`)) {
      try {
        const res = await axios.post('/files/delete-multiple', 
          { ids: [...selectedFiles] }, 
          { withCredentials: true }
        );
        alert(res.data.message);
        setFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        setSelectedFiles(new Set());
      } catch (err) {
        console.error("Delete failed:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์");
      }
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลดไฟล์...</div>;

  return (
    <div className="mylist-container">
      <div className="mylist-header">
        <h2>📁 ไฟล์ของฉัน</h2>
        <button 
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={selectedFiles.size === 0} 
        >
          ลบไฟล์ที่เลือก ({selectedFiles.size})
        </button>
      </div>

      {/* ⭐️ 9. ส่วนควบคุม (เลือกทั้งหมด และ เรียงลำดับ) */}
      <div className="mylist-controls">
        <div className="select-all-container">
          <input
            type="checkbox"
            id="selectAllCheckbox"
            ref={selectAllCheckboxRef} // ⭐️ 10. ผูก Ref
            checked={isAllSelected} // ⭐️ 11. ผูก State
            onChange={handleSelectAll} // ⭐️ 12. ผูก Function
            disabled={sortedFiles.length === 0}
          />
          <label htmlFor="selectAllCheckbox">
            เลือกทั้งหมด ({selectedFiles.size} / {sortedFiles.length})
          </label>
        </div>
        
        <div className="sort-buttons">
          <span>เรียงตาม:</span>
          {/* ⭐️ 13. ปุ่มเรียงลำดับ */}
          <button 
            onClick={() => requestSort('filename')}
            className={sortConfig.key === 'filename' ? 'active' : ''}
          >
            ชื่อ {sortConfig.key === 'filename' ? (sortConfig.order === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button 
            onClick={() => requestSort('uploaded_at')}
            className={sortConfig.key === 'uploaded_at' ? 'active' : ''}
          >
            วันที่ {sortConfig.key === 'uploaded_at' ? (sortConfig.order === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button 
            onClick={() => requestSort('file_size_bytes')}
            className={sortConfig.key === 'file_size_bytes' ? 'active' : ''}
          >
            ขนาด {sortConfig.key === 'file_size_bytes' ? (sortConfig.order === 'asc' ? '▲' : '▼') : ''}
          </button>
        </div>
      </div>

      {/* ⭐️ 14. เปลี่ยนไปใช้ 'sortedFiles' */}
      {sortedFiles.length === 0 ? (
        <p>ยังไม่มีไฟล์</p>
      ) : (
        <ul className="file-list-ul">
          {/* ⭐️ 15. เปลี่ยนไปใช้ 'sortedFiles' */}
          {sortedFiles.map(file => (
            <li key={file.id} className="file-list-item">
              <input
                type="checkbox"
                className="file-checkbox"
                checked={selectedFiles.has(file.id)}
                onChange={() => handleSelectFile(file.id)}
              />
              <span className="file-name">{file.filename}</span>
              <span className="file-date">
                {new Date(file.uploaded_at).toLocaleString('th-TH')}
              </span>
              <span className="file-size">
                { (file.file_size_bytes / 1024 / 1024).toFixed(2) } MB
              </span>
              <a 
                href={`/files/download?id=${file.id}`} 
                className="file-action-btn view-btn"
                target="_blank" 
                rel="noopener noreferrer"
              >
                ดูไฟล์
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyListPage;