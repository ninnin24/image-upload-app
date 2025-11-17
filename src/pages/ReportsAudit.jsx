import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select'; // ⭐ 1. Import react-select
import '../styles/theme.css';
import '../styles/ReportsAudit.css'; 
import { VscOutput } from "react-icons/vsc";
import { IoReturnUpBack } from "react-icons/io5";
import { AiOutlineReload, AiOutlineClear } from "react-icons/ai";
import { FaSortUp, FaSortDown } from "react-icons/fa";

// ⭐ 2. ย้าย Options สำหรับ "การกระทำ" ออกมา
const actionOptions = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'UPLOAD', label: 'UPLOAD' },
  { value: 'DOWNLOAD', label: 'DOWNLOAD' },
  { value: 'DELETE', label: 'DELETE' }
];

function ReportsAudit() {
  const [reportData, setReportData] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [searchReport, setSearchReport] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [filterAction, setFilterAction] = useState('');
  const [filterFileName, setFilterFileName] = useState(''); // now extension filter

  // Sorting 
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, filterFileName, selectedGroup]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, logsRes] = await Promise.all([
        axios.get('/admin/report-summary', { withCredentials: true }),
        axios.get('/admin/user-logs', { withCredentials: true })
      ]);
      setReportData(reportsRes.data || []);
      setUserLogs(logsRes.data || []);
    } catch (err) {
      console.error('โหลดข้อมูลล้มเหลว:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ (ฟังก์ชันนี้ถูกต้องแล้ว)
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const exportToExcel = useCallback(() => {
    window.location.href = '/admin/export/excel';
  }, []);

  const exportToPDF = useCallback(() => {
    alert('ฟังก์ชัน Export to PDF ยังซับซ้อนและยังไม่พร้อมใช้งานครับ');
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterAction('');
    setFilterFileName('');
    setCurrentPage(1);
  }, []);

  const filteredReports = useMemo(() =>
    reportData.filter(item =>
      item.group_name.toLowerCase().includes(searchReport.toLowerCase())
    ),
    [reportData, searchReport]
  );

  const uniqueExtensions = useMemo(() => {
    if (!selectedGroup) return [];
    const extensions = new Set();
    userLogs.forEach(log => {
      let isInGroup = false;
      if (selectedGroup.type === "Company") {
        isInGroup = log.company_name === selectedGroup.name;
      } else if (selectedGroup.type === "User") {
        isInGroup = log.username === selectedGroup.name && log.company_name === "N/A";
      }
      if (isInGroup) {
        const file = log.file_name || "";
        const dotIndex = file.lastIndexOf(".");
        if (dotIndex !== -1) {
          const ext = file.substring(dotIndex + 1).toLowerCase();
          extensions.add(ext);
        }
      }
    });
    return Array.from(extensions).sort();
  }, [userLogs, selectedGroup]);

  const extensionOptions = useMemo(() => {
    const options = uniqueExtensions.map(ext => ({
      value: ext,
      label: `.${ext}`
    }));
    return [{ value: '', label: 'ทั้งหมด' }, ...options];
  }, [uniqueExtensions]);


  const requestSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending'
        ? 'descending'
        : 'ascending'
    }));
  }, []);

  const getSortArrow = useCallback((key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp style={{ marginLeft: '5px', color: '#4CAF50' }} />;
    }
    return <FaSortDown style={{ marginLeft: '5px', color: '#2196F3' }} />;
  }, [sortConfig]);

  const filteredAndSortedLogs = useMemo(() => {
    return userLogs
      .filter(log => {
        if (!selectedGroup) return false;
        if (selectedGroup.type === 'Company') {
          return log.company_name === selectedGroup.name;
        }
        if (selectedGroup.type === 'User') {
          return log.username === selectedGroup.name && log.company_name === 'N/A';
        }
        return false;
      })
      .filter(log => {
        if (filterAction && log.action_type !== filterAction) {
          return false;
        }
        if (filterFileName) {
          const file = log.file_name || "";
          const ext = file.substring(file.lastIndexOf(".") + 1).toLowerCase();
          if (ext !== filterFileName) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'file_size_bytes') {
          return sortConfig.direction === 'ascending'
            ? a.file_size_bytes - b.file_size_bytes
            : b.file_size_bytes - a.file_size_bytes;
        }
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
  }, [userLogs, selectedGroup, filterAction, filterFileName, sortConfig]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLogs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedLogs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedLogs.length / itemsPerPage);

  // ==========================================================
  // ⭐️ 1. (แก้ไข) แก้ไข logStats
  // ==========================================================
  const logStats = useMemo(() => {
    const totalSize = filteredAndSortedLogs.reduce((sum, log) => sum + log.file_size_bytes, 0);
    return {
      total: filteredAndSortedLogs.length,
      totalSize: totalSize, // ⬅️ แก้ไข: ส่งค่ารวม (bytes) ไปตรงๆ
      uploads: filteredAndSortedLogs.filter(log => log.action_type === 'UPLOAD').length,
      downloads: filteredAndSortedLogs.filter(log => log.action_type === 'DOWNLOAD').length,
      deletes: filteredAndSortedLogs.filter(log => log.action_type === 'DELETE').length
    };
  }, [filteredAndSortedLogs]);

  const getActionClass = (action) => {
    switch (action) {
      case 'UPLOAD': return 'action-upload';
      case 'DOWNLOAD': return 'action-download';
      case 'DELETE': return 'action-delete';
      default: return '';
    }
  };

  const handleGroupClick = useCallback((groupName, groupType) => {
    setSelectedGroup({ name: groupName, type: groupType });
    clearAllFilters();
  }, [clearAllFilters]);

  return (
    <div className="main-content-wrapper">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <VscOutput size={22} className="icon" /> 
          <h3>รายงานและการตรวจสอบไฟล์</h3>
        </div>
        <div className="export-buttons">
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
            <AiOutlineReload size={16} style={{ marginRight: '5px' }} />
            รีเฟรช
          </button>
          <button className="btn btn-secondary" onClick={exportToExcel}>
            ดาวน์โหลด Excel
          </button>
          <button className="btn btn-accent" onClick={exportToPDF}>
            ดาวน์โหลด PDF
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '15px', backgroundColor: '#fee', color: '#c33',
          borderRadius: '5px', marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Summary Table */}
      <section className="report-section">
        <h3>
          {selectedGroup 
            ? `กำลังดู: ${selectedGroup.name}`
            : 'รายงานสรุป (คลิกกลุ่มเพื่อดูรายละเอียด)'
          }
        </h3>

        {selectedGroup ? (
          <button className="btn btn-secondary" onClick={() => setSelectedGroup(null)}>
            <IoReturnUpBack size={16} style={{ marginRight: '5px' }} />
            กลับไปดูสรุป
          </button>
        ) : (
          <div className="search-bar" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="🔍 ค้นหากลุ่มหรือผู้ใช้..."
              value={searchReport}
              onChange={e => setSearchReport(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {!selectedGroup && (
          <table className="files-table">
            <thead>
              <tr>
                <th>กลุ่ม / ผู้ใช้</th>
                <th>จำนวนไฟล์ทั้งหมดของการใช้งาน</th>
                <th>อัปโหลดล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>กำลังโหลด...</td></tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map(item => (
                  <tr key={`${item.group_type}-${item.group_name}`}
                      className="clickable-row"
                      onClick={() => handleGroupClick(item.group_name, item.group_type)}>
                    <td>{item.group_name}</td>
                    <td>{item.total_files}</td>
                    <td>
                      {item.total_files > 0 
                        ? new Date(item.last_upload).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* Logs Details */}
      {selectedGroup && (
        <section className="report-section">

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3>ประวัติการใช้งานไฟล์: {selectedGroup.name}</h3>

            {(filterAction || filterFileName) && (
              <button className="btn btn-secondary" onClick={clearAllFilters}>
                <AiOutlineClear size={16} style={{ marginRight: '5px' }} />
                ล้างตัวกรอง
              </button>
            )}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px', marginBottom: '20px', padding: '15px',
            backgroundColor: '#f5f5f5', borderRadius: '5px'
          }}>
            <div><strong>รายการทั้งหมด:</strong> {logStats.total}</div>
            
            {/* ⭐️ 2. (แก้ไข) แก้ไข JSX ที่แสดงผล */}
            <div><strong>ขนาดรวม:</strong> {formatFileSize(logStats.totalSize)}</div>
            
            <div className="action-upload"><strong>อัปโหลด:</strong> {logStats.uploads}</div>
            <div className="action-download"><strong>ดาวน์โหลด:</strong> {logStats.downloads}</div>
            <div className="action-delete"><strong>ลบ:</strong> {logStats.deletes}</div>
          </div>
          <div className="filter-grid" style={{ maxWidth: '650px', display: 'flex',  gap: '20px' , marginBottom: '15px' ,top: '10px' }}>
            
            <div className="filter-item">
              <label>การกระทำ</label>
              <Select
                options={actionOptions}
                value={actionOptions.find(opt => opt.value === filterAction)}
                onChange={selectedOption => setFilterAction(selectedOption.value)}
                instanceId="action-select" // ID เฉพาะสำหรับ React
                placeholder="เลือกการกระทำ..."
              />
            </div>

            <div className="filter-item">
              <label>นามสกุลไฟล์</label>
              <Select
                options={extensionOptions}
                value={extensionOptions.find(opt => opt.value === filterFileName)}
                onChange={selectedOption => setFilterFileName(selectedOption.value)}
                instanceId="extension-select"
                placeholder="เลือกนามสกุล..."
                isSearchable={true} // เปิดให้ค้นหาได้
              />
            </div>

          </div>
          <table className="files-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('username')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    ชื่อผู้ใช้ {getSortArrow('username')}
                  </div>
                </th>
                <th>การกระทำ</th>
                <th onClick={() => requestSort('file_name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    ชื่อไฟล์ {getSortArrow('file_name')}
                  </div>
                </th>
                <th onClick={() => requestSort('file_size_bytes')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    ขนาด {getSortArrow('file_size_bytes')}
                  </div>
                </th>
                <th onClick={() => requestSort('created_at')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    วันที่ {getSortArrow('created_at')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => (
                  <tr key={`${log.id}-${idx}`}>
                    <td>{log.username}</td>
                    <td className={getActionClass(log.action_type)}>
                      {log.action_type}
                    </td>
                    <td title={log.file_name}
                        style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.file_name}
                    </td>
                    
                    <td>{formatFileSize(log.file_size_bytes)}</td>

                    <td>
                      {new Date(log.created_at).toLocaleString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    ไม่พบข้อมูลที่ตรงกับการกรอง
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ← ก่อนหน้า
              </button>

              <span>หน้า {currentPage} จาก {totalPages} ({filteredAndSortedLogs.length} รายการ)</span>

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                ถัดไป →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ReportsAudit;