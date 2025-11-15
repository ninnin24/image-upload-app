import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

// --- 1. Import Libs ที่เพิ่มเข้ามา ---
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // CSS ของปฏิทิน

import '../styles/Dashboard.css'; 
import '../styles/Pagination.css'; 

const AllFilesAudit = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState({
    company: '',
    startDate: null,
    endDate: null    
  });
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // ดึงไฟล์ทั้งหมด
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('/admin/files', { withCredentials: true });
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(2) + ' ' + sizes[i];
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

  // ลบไฟล์ที่เลือก (Admin)
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (window.confirm(`[Admin] คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedFiles.size} ไฟล์ที่เลือก?`)) {
      try {
        const res = await axios.post('/admin/files/delete', 
          { ids: [...selectedFiles] }, 
          { withCredentials: true }
        );
        alert(res.data.message);
        setFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        setSelectedFiles(new Set()); 
      } catch (err) {
        console.error("Admin Delete failed:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์ (Admin)");
      }
    }
  };

  // ตัวกรองไฟล์ (Client-side)
  const filteredFiles = useMemo(() => {
    // 3. 👈 แก้ไข Logic กรองวันที่ (ลบ new Date())
    return files.filter(file => {
      const matchCompany = filter.company ? file.company_name === filter.company : true;
      const matchStart = filter.startDate ? new Date(file.created_at) >= filter.startDate : true;
      const matchEnd = filter.endDate ? new Date(file.created_at) <= filter.endDate : true;
      return matchCompany && matchStart && matchEnd;
    });
  }, [files, filter]);


  // 4. 👈 สร้าง Options สำหรับ react-select (บริษัท)
  const companyOptions = useMemo(() => {
    const companies = [...new Set(files.map(f => f.company_name))];
    const options = companies.map(c => ({
      value: c,
      label: c
    }));
    // เพิ่ม "ดูทุกบริษัท" เข้าไป
    return [{ value: '', label: 'ดูทุกบริษัท' }, ...options];
  }, [files]);


  // Logic การแบ่งหน้า
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentFiles = filteredFiles.slice(firstIndex, lastIndex); 

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedFiles(new Set()); 
  };
  
  // ฟังก์ชันสำหรับสร้างปุ่มตัวเลข
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p>กำลังโหลดรายการไฟล์ทั้งหมด...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div className="admin-content-box">
      <h3>📁 ดูไฟล์ทั้งหมด ({filteredFiles.length})</h3>

      {/* --- 5. 👈 แก้ไข Filter Controls ทั้งหมด --- */}
      <div className="filter-controls" style={{ display: 'flex', gap: '15px' }}>
        
        <div style={{ minWidth: '200px' }}>
          <Select
            options={companyOptions}
            value={companyOptions.find(opt => opt.value === filter.company)}
            onChange={selectedOption => 
              setFilter({ ...filter, company: selectedOption.value })
            }
            instanceId="company-select"
            placeholder="เลือกบริษัท..."
          />
        </div>

        <DatePicker
          selected={filter.startDate}
          onChange={date => setFilter({ ...filter, startDate: date })}
          selectsStart
          startDate={filter.startDate}
          endDate={filter.endDate}
          placeholderText="วว/ดด/ปปปป (เริ่ม)"
          isClearable
          dateFormat="dd/MM/yyyy"
          className="date-picker-input"
          // --- ⭐️ เพิ่ม 3 บรรทัดนี้ ---
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // --- ⭐️ สิ้นสุด ---
        />
        <DatePicker
          selected={filter.endDate}
          onChange={date => setFilter({ ...filter, endDate: date })}
          selectsEnd
          startDate={filter.startDate}
          endDate={filter.endDate}
          minDate={filter.startDate} 
          placeholderText="วว/ดด/ปปปป (สิ้นสุด)"
          isClearable
          dateFormat="dd/MM/yyyy"
          className="date-picker-input"
          // --- ⭐️ เพิ่ม 3 บรรทัดนี้ ---
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          // --- ⭐️ สิ้นสุด ---
        />

        {/* 6. 👈 แก้ไขปุ่ม Reset */}
        <button onClick={() => setFilter({ company:'', startDate: null, endDate: null })}>
          รีเซ็ต
        </button>
        
        <button 
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={selectedFiles.size === 0}
          style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: 'auto' }} 
        >
          [Admin] ลบไฟล์ที่เลือก ({selectedFiles.size})
        </button>
      </div>
      {/* --- จบส่วน Filter Controls --- */}


      {/* File List (ตาราง) */}
      <table className="files-table">
        <thead>
          <tr>
            <th>เลือก</th>
            <th>ชื่อไฟล์</th>
            <th>ผู้ใช้</th>
            <th>บริษัท</th>
            <th>ขนาดไฟล์</th>
            <th>วันที่อัปโหลด</th>
            <th>ดาวน์โหลด</th>
          </tr>
        </thead>
        <tbody>
          
          {currentFiles.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>ไม่พบไฟล์ที่ตรงกับเงื่อนไข</td>
            </tr>
          ) : (
            // 7. 👈 แก้ไข key prop
            currentFiles.map((f, index) => (
              <tr key={`${f.id}-${index}`}> 
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(f.id)}
                    onChange={() => handleSelectFile(f.id)}
                  />
                </td>
                <td>{f.file_name}</td>
                <td>{f.username}</td>
                <td>{f.company_name}</td>
                <td>{formatFileSize(f.file_size_bytes)}</td>
                <td>{new Date(f.created_at).toLocaleString('th-TH')}</td>
                <td>
                  {/* 8. 👈 แก้ไข URL (href) */}
                  <a 
                    href={`/files/download?id=${f.id}`} 
                    className="file-action-btn view-btn"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    ดาวน์โหลด
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ส่วนควบคุมการแบ่งหน้า */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; ก่อนหน้า
          </button>
          
          {renderPageNumbers()}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป &raquo;
          </button>
        </div>
      )}

    </div>
  );
};

export default AllFilesAudit;