import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from '../components/AddUserModal';
import { VscAccount } from "react-icons/vsc";
import '../styles/Dashboard.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  // ⭐️ 1. ลบ API_URL ทิ้ง

  const fetchUsers = async () => {
    try {
      // ⭐️ 2. ใช้ Relative Path
      const res = await axios.get(`/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, username) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${username}"?`)) {
      try {
        // ⭐️ 3. ใช้ Relative Path
        await axios.delete(`/admin/users/${userId}`, { withCredentials: true });
        alert(`ลบผู้ใช้ ${username} สำเร็จ`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      }
    }
  };

  const handleResetPassword = async (userId, username) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตรหัสผ่านของ "${username}"?`)) {
      try {
        // ⭐️ 4. ใช้ Relative Path
        const res = await axios.post(`/admin/users/${userId}/reset-password`, {}, { withCredentials: true });
        const newPassword = res.data.new_password;
        alert(`รีเซ็ตรหัสผ่านของ ${username} สำเร็จ!\nรหัสผ่านใหม่คือ: ${newPassword}`);
      } catch (err) {
        console.error("Error resetting password:", err);
        alert('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      }
    }
  };

  return (
    <div className="main-content-wrapper"> 
      <div className="admin-page-header">
        <div className="admin-page-title">
          <VscAccount size={22} className="icon" />
          <h3>จัดการผู้ใช้</h3>
        </div>
        <button className="btn btn-accent" onClick={() => setShowAddModal(true)}>
          + เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {users.length === 0 ? (
        <p>ไม่พบผู้ใช้</p>
      ) : (
        <table className="files-table">
          <thead>
            <tr>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>บริษัท</th>
              <th>สิทธิ์</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email ?? '-'}</td>
                <td>{u.company_name ?? '-'}</td>
                <td>{u.role}</td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="table-action-btn reset"
                    onClick={() => handleResetPassword(u.id, u.username)}
                  >
                    รีเซ็ต
                  </button>
                  <span className="action-divider">|</span>
                  <button
                    type="button"
                    className="table-action-btn delete"
                    onClick={() => handleDelete(u.id, u.username)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;