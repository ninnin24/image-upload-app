import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCompanyModal from "../components/AddCompanyModal";
import { CgBox } from "react-icons/cg";
import "../styles/theme.css"; 

// ⭐️ 1. เปลี่ยนฟังก์ชันเป็น bytesToMB
const bytesToMB = (bytes) => {
  if (bytes === 0) return 0;
  // ⭐️ 2. เปลี่ยนตัวหารเป็น (1024 * 1024)
  return (bytes / (1024 * 1024)); 
};

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/admin/companies", { withCredentials: true });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (companyId, companyName) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${companyName}"? (ต้องไม่มี User หรือ File ใดๆ ผูกอยู่)`)) {
      try {
        await axios.delete(`/admin/companies/${companyId}`, { withCredentials: true });
        alert("ลบบริษัทสำเร็จ");
        fetchCompanies(); 
      } catch (err) {
        console.error('Error deleting company:', err);
        alert(err.response?.data?.message || "ลบบริษัทล้มเหลว");
      }
    }
  };

  return (
    <div className="main-content-wrapper">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <CgBox size={22} className="icon" />
          <h3>จัดการบริษัท</h3>
        </div>
        <button
          className="btn btn-accent"
          onClick={() => setShowAddModal(true)}
        >
          + เพิ่มบริษัทใหม่
        </button>
      </div>

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCompanies}
        />
      )}

      {companies.length === 0 ? (
        <p>ไม่พบบริษัท</p>
      ) : (
        <table className="files-table">
          <thead>
            <tr>
              <th>ชื่อบริษัท</th>
              <th>ผู้ใช้</th>
              <th>ไฟล์</th>
              {/* ⭐️ 3. เปลี่ยนหัวตารางเป็น (MB) */}
              <th>พื้นที่ใช้ไป (MB)</th>
              <th>พื้นที่คงเหลือ (MB)</th>
              <th>วันที่สร้าง</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => {
              
              // ⭐️ 4. คำนวณเป็น MB ทั้งหมด
              const quotaGB = c.storage_quota_gb.Valid ? c.storage_quota_gb.Float64 : 0;
              const quotaMB = quotaGB * 1024; // ⭐️ แปลงโควต้า GB เป็น MB
              const usedBytes = c.storage_used_bytes || 0;
              
              const usedMB = bytesToMB(usedBytes); // ⭐️ แปลง Bytes ที่ใช้ไป
              
              const remainingMB = quotaMB > 0 ? (quotaMB - usedMB) : 'N/A';
              const usedMB_Display = usedMB.toFixed(2); // ⭐️ ตอนนี้จะเป็น (เช่น) 0.95 MB
              const remainingMB_Display = (typeof remainingMB === 'number') ? remainingMB.toFixed(2) : remainingMB;

              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.user_count}</td>
                  <td>{c.file_count}</td>
                  
                  {/* ⭐️ 5. แสดงผล MB */}
                  <td>{usedMB_Display}</td>
                  <td>{remainingMB_Display}</td>
                  
                  <td>{new Date(c.created_at).toLocaleDateString('th-TH')}</td>
                  <td className="action-cell">
                    <button className="table-action-btn edit">
                      แก้ไข
                    </button>
                    <span className="action-divider">|</span>
                    <button 
                      className="table-action-btn delete"
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyManagement;