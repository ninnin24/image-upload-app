import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VscTag, VscRefresh, VscCheck, VscClose } from 'react-icons/vsc'; // เพิ่ม icon ถูก/ผิด
import '../styles/theme.css'; 
import '../styles/Dashboard.css';
import '../styles/ReportsAudit.css'; 

function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState(null); 
  
  // ⭐️ เปลี่ยน State ให้ตรงกับ Backend ใหม่
  const [description, setDescription] = useState('');
  const [storageQuota, setStorageQuota] = useState(10); // Default 10 GB
  const [price, setPrice] = useState(0); // เพิ่มราคา

  useEffect(() => {
    fetchPromotions();
    fetchRequests();
  }, []);

  const fetchPromotions = () => {
    setLoadingPromos(true);
    axios.get('/admin/promotions', { withCredentials: true })
      .then(res => setPromotions(res.data))
      .catch(err => {
        console.error("Error fetching promotions:", err);
        setError("ไม่สามารถดึงข้อมูลโปรโมชั่นได้");
      })
      .finally(() => setLoadingPromos(false));
  };

  const fetchRequests = () => {
    setLoadingRequests(true);
    axios.get('/admin/promotion-requests', { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(err => {
        console.error("Error fetching requests:", err);
        setError("ไม่สามารถดึงข้อมูลคำขอได้");
      })
      .finally(() => setLoadingRequests(false));
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    setError(null); 
    try {
      // ⭐️ ส่งข้อมูลแบบใหม่ (storage_quota_gb, price)
      const res = await axios.post('/admin/promotions', 
        { 
          description: description, 
          storage_quota_gb: parseFloat(storageQuota),
          price: parseFloat(price)
        },
        { withCredentials: true }
      );
      setPromotions(prevPromotions => [...prevPromotions, res.data]);
      // Reset Form
      setDescription('');
      setStorageQuota(10);
      setPrice(0);
      alert("สร้างโปรโมชั่นสำเร็จ!");
    } catch (err) {
      console.error("Error creating promotion:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างโปรโมชั่น");
    }
  };

  const handleUpdateRequest = (requestId, newStatus) => {
    // อัปเดต UI ทันทีเพื่อความลื่นไหล (Optimistic Update)
    const originalRequests = [...requests]; // สำรองข้อมูลไว้เผื่อพลาด
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    axios.post('/admin/promotion-requests/update', 
      {
        request_id: requestId,
        new_status: newStatus
      },
      { withCredentials: true }
    )
    .then(res => {
      console.log(res.data.message);
    })
    .catch(err => {
      console.error("Error updating request:", err);
      alert("อัปเดตสถานะไม่สำเร็จ! กรุณาลองใหม่");
      setRequests(originalRequests); // คืนค่าเดิมถ้า Error
    });
  };

  return (
    <div className="admin-page-container">
      {/* ส่วนหัว */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <VscTag size={22} className="icon" /> 
          <h3>จัดการแพ็คเกจโปรโมชั่น (Storage Packages)</h3>
        </div>
      </div>

      {/* ฟอร์มสร้างโปรโมชั่น */}
      <section className="admin-content-box">
        <h4>สร้างแพ็คเกจใหม่</h4>
        <form onSubmit={handleCreatePromotion} className="company-form">
          <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="promo-desc">ชื่อแพ็คเกจ / รายละเอียด</label>
              <input
                type="text"
                id="promo-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="เช่น Standard Plan 50GB"
                required
              />
            </div>
            
            {/* ⭐️ ช่องกรอกพื้นที่ (GB) */}
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="promo-quota">พื้นที่จัดเก็บ (GB)</label>
              <input
                type="number"
                id="promo-quota"
                value={storageQuota}
                onChange={(e) => setStorageQuota(e.target.value)}
                min="1"
                step="0.1"
                required
              />
            </div>

            {/* ⭐️ ช่องกรอกราคา */}
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="promo-price">ราคา (บาท)</label>
              <input
                type="number"
                id="promo-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
             + สร้างแพ็คเกจ
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </section>

      {/* ตารางโปรโมชั่นที่มีอยู่ */}
      <section className="admin-content-box">
        <h4>แพ็คเกจที่มีอยู่</h4>
        {loadingPromos ? <p>กำลังโหลด...</p> : (
          <table className="files-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>ID</th>
                <th>ชื่อแพ็คเกจ</th>
                <th style={{ width: '150px' }}>พื้นที่ (GB)</th>
                <th style={{ width: '150px' }}>ราคา (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>ยังไม่มีแพ็คเกจ</td>
                </tr>
              ) : (
                promotions.map(promo => (
                  <tr key={promo.id}>
                    <td>{promo.id}</td>
                    <td>{promo.description}</td>
                    {/* ⭐️ แสดงข้อมูลใหม่ */}
                    <td>{promo.storage_quota_gb} GB</td>
                    <td>{promo.price.toLocaleString()} ฿</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* ตารางคำขออนุมัติ */}
      <section className="admin-content-box">
        <div className="admin-box-header">
          <h4>รายการคำขอเพิ่มพื้นที่ (Request Queue)</h4>
          <button className="btn btn-secondary" onClick={fetchRequests} disabled={loadingRequests} title="รีเฟรชข้อมูล">
             <VscRefresh />
          </button>
        </div>
        
        {loadingRequests ? <p>กำลังโหลด...</p> : (
          <table className="files-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ผู้ขอ (Username)</th>
                <th>แพ็คเกจที่เลือก</th>
                <th>วันที่ขอ</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>ไม่มีรายการคำขอใหม่</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>
                       <strong>{req.username}</strong>
                    </td>
                    <td>{req.promo_description}</td>
                    <td>{new Date(req.request_date).toLocaleString('th-TH')}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {req.status === 'pending' ? (
                        <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            className="btn btn-success"
                            style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            onClick={() => handleUpdateRequest(req.id, 'approved')}
                          >
                            <VscCheck /> อนุมัติ
                          </button>
                          <button 
                            className="btn btn-danger"
                            style={{ backgroundColor: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            onClick={() => handleUpdateRequest(req.id, 'rejected')}
                          >
                            <VscClose /> ปฏิเสธ
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#888', fontSize: '0.9em' }}>ดำเนินการแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default PromotionManagement;