// src/components/ExpiryModal.jsx
import React from 'react';
import '../styles/ExpiryModal.css'; // เราจะสร้างไฟล์ CSS นี้ในขั้นตอนถัดไป

const ExpiryModal = ({ show, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <span className="modal-icon">⚠️</span>
          <h2 className="modal-title">แจ้งเตือน: แพ็คเกจหมดอายุ</h2>
        </div>
        <div className="modal-body">
          <p>แพ็คเกจการใช้งานปัจจุบันของคุณได้หมดอายุลงแล้ว</p>
          <p style={{ fontSize: '0.95em', color: '#666' }}>กรุณาทำการต่ออายุแพ็คเกจเพื่อดำเนินการใช้งานต่อ</p>
        </div>
        <div className="modal-footer">
          <button onClick={onConfirm} className="modal-confirm-button">
            ไปยังหน้าต่ออายุแพ็คเกจ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiryModal;