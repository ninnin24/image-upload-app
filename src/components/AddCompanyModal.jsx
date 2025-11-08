import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

function AddCompanyModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://172.18.20.45:8080/admin/companies',
        { name, description },
        { withCredentials: true }
      );
      alert('เพิ่มบริษัทสำเร็จ');
      onSuccess(); // 🔄 รีเฟรชข้อมูล
      onClose();
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเพิ่มบริษัทได้');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>เพิ่มบริษัทใหม่</h3>
        <form onSubmit={handleSubmit}>
          <label>ชื่อบริษัท</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>รายละเอียดเพิ่มเติม</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="modal-actions">
            <button type="submit" className="primary-orange-bg">บันทึก</button>
            <button type="button" onClick={onClose}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCompanyModal;
