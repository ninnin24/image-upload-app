import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCompanyModal from '../components/AddCompanyModal';
import '../styles/Dashboard.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ ดึงข้อมูลบริษัททั้งหมด
  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://172.18.20.45:8080/admin/companies', { withCredentials: true });
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="admin-content-box">
      <h3>🏢 จัดการบริษัท</h3>
      <button
        className="action-button primary-orange-bg"
        onClick={() => setShowAddModal(true)}
      >
        + เพิ่มบริษัทใหม่
      </button>

      {/* ✅ Modal สำหรับเพิ่มบริษัท */}
      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCompanies}
        />
      )}

      {/* ✅ ตารางข้อมูลบริษัท */}
      {companies.length === 0 ? (
        <p>ไม่พบบริษัท</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ชื่อบริษัท</th>
              <th>จำนวนผู้ใช้</th>
              <th>จำนวนไฟล์</th>
              <th>วันที่สร้าง</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.user_count}</td>
                <td>{c.file_count}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="action-button small">แก้ไข</button>
                  <button className="action-button danger small">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyManagement;
