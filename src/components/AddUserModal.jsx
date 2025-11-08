import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    company_id: '',
    role: 'ผู้ใช้ทั่วไป'
  });
  const [companies, setCompanies] = useState([]);

  // ดึง list บริษัทสำหรับ select
  useEffect(() => {
    axios.get('http://172.18.20.45:8080/admin/companies', { withCredentials: true })
      .then(res => setCompanies(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://172.18.20.45:8080/admin/users', form, { withCredentials: true });
      alert('เพิ่มผู้ใช้สำเร็จ');
      onSuccess(); // refresh list ผู้ใช้
      onClose();   // ปิด modal
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเพิ่มผู้ใช้ได้');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>เพิ่มผู้ใช้ใหม่</h3>
        <form onSubmit={handleSubmit}>
          <label>ชื่อผู้ใช้</label>
          <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />

          <label>อีเมล</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

          <label>รหัสผ่าน</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

          <label>บริษัท</label>
          <select value={form.company_id} onChange={e => setForm({ ...form, company_id: e.target.value })} required>
            <option value="">-- เลือกบริษัท --</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label>สิทธิ์</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="ผู้ใช้ทั่วไป">ผู้ใช้ทั่วไป</option>
            <option value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="primary-orange-bg">บันทึก</button>
            <button type="button" onClick={onClose}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
