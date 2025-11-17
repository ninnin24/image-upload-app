import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VscTag, VscRefresh } from 'react-icons/vsc'; // ⭐️ เพิ่ม VscRefresh
import '../styles/theme.css'; 
import '../styles/Dashboard.css';
import '../styles/ReportsAudit.css'; // (ยืมสไตล์ตาราง)

function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [requests, setRequests] = useState([]); // ⭐️ (เพิ่ม) State สำหรับคำขอ
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState(null); 
  
  const [description, setDescription] = useState('');
  const [userLimit, setUserLimit] = useState(0);

  // ⭐️ (แก้ไข) แยกการดึงข้อมูล
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
      const res = await axios.post('/admin/promotions', 
        { 
          description: description, 
          user_limit: parseInt(userLimit, 10)
        },
        { withCredentials: true }
      );
      setPromotions(prevPromotions => [...prevPromotions, res.data]);
      setDescription('');
      setUserLimit(0);
    } catch (err) {
      console.error("Error creating promotion:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างโปรโมชั่น");
    }
  };

  // ⭐️ (เพิ่ม) Handler สำหรับปุ่มอนุมัติ/ปฏิเสธ
  const handleUpdateRequest = (requestId, newStatus) => {
    // ⭐️ (เพิ่มประสิทธิภาพ) อัปเดต UI ทันที
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
      // (สำเร็จ) ไม่ต้องทำอะไร เพราะเราอัปเดต UI ไปแล้ว
      console.log(res.data.message);
    })
    .catch(err => {
      // (ถ้าพลาด) คืนค่า UI กลับเหมือนเดิม
      console.error("Error updating request:", err);
      alert("อัปเดตสถานะไม่สำเร็จ!");
      fetchRequests(); // ⭐️ ดึงข้อมูลใหม่
    });
  };

  return (
    <div className="admin-page-container">
      {/* (ส่วนหัว) */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <VscTag size={22} className="icon" /> 
          <h3>จัดการโปรโมชั่น</h3>
        </div>
      </div>

      {/* (ฟอร์มสร้าง) */}
      <section className="admin-content-box">
        <h4>สร้างโปรโมชั่นใหม่</h4>
        <form onSubmit={handleCreatePromotion} className="company-form">
          <div className="form-group">
            <label htmlFor="promo-desc">รายละเอียด (Description)</label>
            <input
              type="text"
              id="promo-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น โปรโมชั่นปีใหม่ 2026"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="promo-limit">จำกัดจำนวนสิทธิ์ (User Limit)</label>
            <input
              type="number"
              id="promo-limit"
              value={userLimit}
              onChange={(e) => setUserLimit(e.target.value)}
              min="0"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">สร้างโปรโมชั่น</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </section>

      {/* (ตารางโปรโมชั่นที่มีอยู่) */}
      <section className="admin-content-box">
        <h4>รายการโปรโมชั่น (ที่สร้างไว้)</h4>
        {loadingPromos ? <p>กำลังโหลด...</p> : (
          <table className="files-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>รายละเอียด (Description)</th>
                <th>จำกัดสิทธิ์ (User Limit)</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>ยังไม่มีโปรโมชั่น</td>
                </tr>
              ) : (
                promotions.map(promo => (
                  <tr key={promo.id}>
                    <td>{promo.id}</td>
                    <td>{promo.description}</td>
                    <td>{promo.user_limit > 0 ? promo.user_limit : 'ไม่จำกัด'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* ⭐️⭐️ (เพิ่มใหม่) ตารางอนุมัติ ⭐️⭐️ */}
      <section className="admin-content-box">
        <div className="admin-box-header"> {/* (ใช้คลาสจาก ReportsAudit.css) */}
          <h4>รายการคำขอโปรโมชั่น (ที่ User ขอมา)</h4>
          <button className="btn btn-secondary" onClick={fetchRequests} disabled={loadingRequests}>
             <VscRefresh />
          </button>
        </div>
        
        {loadingRequests ? <p>กำลังโหลด...</p> : (
          <table className="files-table">
            <thead>
              <tr>
                <th>ID คำขอ</th>
                <th>ผู้ใช้ (Username)</th>
                <th>โปรโมชั่นที่ขอ</th>
                <th>วันที่ขอ</th>
                <th>สถานะ (Status)</th>
                <th>ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>ยังไม่มีคำขอ</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.username}</td>
                    <td>{req.promo_description}</td>
                    <td>{new Date(req.request_date).toLocaleString('th-TH')}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {/* ⭐️ ปุ่มกด (ถ้ายัง 'pending' อยู่) */}
                      {req.status === 'pending' && (
                        <div className="action-buttons">
                          <button 
                            className="btn btn-approve"
                            onClick={() => handleUpdateRequest(req.id, 'approved')}
                          >
                            อนุมัติ
                          </button>
                          <button 
                            className="btn btn-reject"
                            onClick={() => handleUpdateRequest(req.id, 'rejected')}
                          >
                            ปฏิเสธ
                          </button>
                        </div>
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