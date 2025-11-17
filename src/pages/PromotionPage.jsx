import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css'; // (ใช้ CSS เดียวกับ UserDashboard ไปก่อน)

function PromotionPage() {
  const [promotions, setPromotions] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get('/user/promotions', { withCredentials: true })
      .then(res => {
        setPromotions(res.data.promotions || []);
        setUserStatuses(res.data.user_statuses || {});
      })
      .catch(err => {
        console.error("Failed to fetch promotions:", err);
        setError("ไม่สามารถดึงข้อมูลโปรโมชั่นได้");
      })
      .finally(() => setLoading(false));
  };

  const handleRequestPromotion = (promotionId) => {
    // (ทำให้ปุ่มกดไม่ได้ชั่วคราว)
    setUserStatuses(prev => ({ ...prev, [promotionId]: 'requesting' }));

    axios.post('/user/request-promotion', 
      { promotion_id: promotionId }, 
      { withCredentials: true }
    )
    .then(res => {
      alert(res.data.message);
      // (อัปเดตสถานะเป็น 'pending' หลังจากขอสำเร็จ)
      setUserStatuses(prev => ({ ...prev, [promotionId]: 'pending' }));
    })
    .catch(err => {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
      // (ถ้าพลาด ให้กลับไปสถานะเดิม)
      setUserStatuses(prev => ({ ...prev, [promotionId]: undefined }));
    });
  };

  const getButtonState = (promoId) => {
    const status = userStatuses[promoId];

    if (status === 'requesting') {
      return <button disabled>กำลังส่งคำขอ...</button>;
    }
    if (status === 'pending') {
      return <button disabled style={{ backgroundColor: '#f0ad4e' }}>รออนุมัติ</button>;
    }
    if (status === 'approved') {
      return <button disabled style={{ backgroundColor: '#5cb85c' }}>อนุมัติแล้ว</button>;
    }
    if (status === 'rejected') {
      return <button disabled style={{ backgroundColor: '#d9534f' }}>ถูกปฏิเสธ</button>;
    }
    
    // (สถานะเริ่มต้น: กดได้)
    return (
      <button 
        onClick={() => handleRequestPromotion(promoId)}
        style={{ backgroundColor: '#0275d8' }}
      >
        ส่งคำขอ
      </button>
    );
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลด...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="home-container">
      <section className="hero">
        <h1>โปรโมชั่น</h1>
        <p>เลือกโปรโมชั่นที่คุณต้องการและส่งคำขอ</p>
      </section>

      <div className="container">
        {promotions.length === 0 ? (
          <p>ยังไม่มีโปรโมชั่นในขณะนี้</p>
        ) : (
          promotions.map(promo => (
            <div key={promo.id} className="timeline-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{promo.description}</strong>
                <p>จำกัด: {promo.user_limit > 0 ? `${promo.user_limit} สิทธิ์` : 'ไม่จำกัดสิทธิ์'}</p>
              </div>
              {getButtonState(promo.id)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PromotionPage;