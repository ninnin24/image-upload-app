import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VscServer, VscCheck, VscWatch } from "react-icons/vsc"; 
import '../styles/Home.css'; 

function PromotionPage() {
  const [promotions, setPromotions] = useState([]);
  const [activePromoId, setActivePromoId] = useState(0);
  const [pendingPromoId, setPendingPromoId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ⭐️ State สำหรับเลือก รายเดือน vs รายปี (default: monthly)
  const [billingCycle, setBillingCycle] = useState('monthly'); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get('/user/promotions', { withCredentials: true })
      .then(res => {
        setPromotions(res.data.promotions || []);
        setActivePromoId(res.data.active_promotion_id || 0);
        setPendingPromoId(res.data.pending_promotion_id || 0);
      })
      .catch(err => {
        console.error("Failed to fetch promotions:", err);
        setError("ไม่สามารถดึงข้อมูลโปรโมชั่นได้");
      })
      .finally(() => setLoading(false));
  };

  const formatQuotaDisplay = (gb) => {
    if (gb >= 1000) {
      const tb = gb / 1024; 
      return `${parseFloat(tb.toFixed(2))} TB`;
    }
    return `${gb} GB`;
  };

  const handleRequestPromotion = (promotionId) => {
    if (pendingPromoId !== 0) {
        alert("คุณมีรายการที่รออนุมัติอยู่แล้ว กรุณารอเจ้าหน้าที่ดำเนินการก่อนทำรายการใหม่");
        return;
    }
    if (activePromoId !== 0) {
        if (!window.confirm("⚠️ ยืนยันการเปลี่ยนแพ็คเกจ? (แพ็คเกจเดิมจะถูกยกเลิก)")) return;
    } else {
        if (!window.confirm("ยืนยันการขอแพ็คเกจนี้?")) return;
    }

    axios.post('/user/request-promotion', 
      { promotion_id: promotionId }, 
      { withCredentials: true }
    ).then(res => {
      alert(res.data.message);
      setPendingPromoId(promotionId); 
    }).catch(err => {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    });
  };

  const getButtonState = (promoId) => {
    const btnStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem', transition: 'all 0.2s ease' };

    if (promoId === activePromoId) return <button disabled style={{ ...btnStyle, backgroundColor: '#28a745', color: '#fff', cursor: 'default' }}><VscCheck size={20} /> แพ็คเกจปัจจุบัน</button>;
    if (promoId === pendingPromoId) return <button disabled style={{ ...btnStyle, backgroundColor: '#ffc107', color: '#fff', cursor: 'default' }}><VscWatch size={20} /> รอการอนุมัติ...</button>;
    if (pendingPromoId !== 0) return <button disabled style={{ ...btnStyle, backgroundColor: '#e0e0e0', color: '#999' }}>ไม่สามารถเลือกได้</button>;

    const btnText = activePromoId !== 0 ? "🔄 เปลี่ยนมาใช้แพ็คเกจนี้" : "เลือกแพ็คเกจนี้";
    return <button onClick={() => handleRequestPromotion(promoId)} style={{ ...btnStyle, backgroundColor: '#007bff', color: 'white' }} className="btn-hover-effect">{btnText}</button>;
  };

  // ⭐️ Logic การกรองข้อมูลตาม Toggle
  const displayedPromotions = promotions.filter(p => {
    // 1. ต้อง Active และไม่ใช่ตัวที่ใช้อยู่
    if (!p.is_active || p.id === activePromoId) return false;

    // 2. กรองตาม Billing Cycle
    if (billingCycle === 'monthly') {
        // รายเดือน = duration <= 31 วัน
        return p.duration_days <= 31;
    } else {
        // รายปี = duration > 31 วัน
        return p.duration_days > 31;
    }
  });

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>กำลังโหลด...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="home-container">
      <section className="hero" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>เลือกแผนการใช้งานที่ใช่สำหรับคุณ</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>อัปเกรดพื้นที่จัดเก็บเพื่อรองรับไฟล์ที่มากขึ้น</p>
      </section>

      {/* ⭐️ Toggle Switch UI */}
      <div className="billing-toggle-container">
        <span 
            className={`billing-label ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
        >
            รายเดือน
        </span>

        <div 
            className={`toggle-switch ${billingCycle === 'yearly' ? 'yearly' : ''}`}
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
        >
            <div className="toggle-knob"></div>
        </div>

        <span 
            className={`billing-label ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
        >
            รายปี 
            <span className="discount-badge">Save more!</span>
        </span>
      </div>

      <div className="promotion-grid-container">
        {displayedPromotions.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#999', backgroundColor:'#f9f9f9', borderRadius:'10px' }}>
            <p style={{ fontSize: '1.5em' }}>🚫 ไม่พบแพ็คเกจ{billingCycle === 'monthly' ? 'รายเดือน' : 'รายปี'}ที่เปิดให้บริการ</p>
          </div>
        ) : (
          displayedPromotions.map(promo => (
            <div key={promo.id} className="promotion-card">
                <div className="promo-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom:'20px', marginBottom:'20px' }}>
                  <h3 style={{ color: '#333', fontSize: '1.4rem', marginBottom: '10px' }}>{promo.description}</h3>
                  <div className="promo-price">
                    <span className="price-number" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#007bff' }}>
                      {promo.price === 0 ? 'ฟรี' : promo.price.toLocaleString()}
                    </span>
                    {promo.price > 0 && (
                        <span className="price-unit" style={{ color: '#888' }}> 
                           {/* ⭐️ แสดงหน่วยตาม Cycle */}
                           บาท / {promo.duration_days > 31 ? 'ปี' : 'เดือน'}
                        </span>
                    )}
                  </div>
                </div>

                <div className="promo-body" style={{ flexGrow: 1 }}>
                  <div className="quota-display" style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', marginBottom:'15px' }}>
                    <VscServer size={32} color="#007bff" />
                    <span className="quota-text" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
                      {formatQuotaDisplay(promo.storage_quota_gb)}
                    </span>
                  </div>
                  <p className="detail-text" style={{ color: '#666', lineHeight: '1.6' }}>
                    ✓ พื้นที่จัดเก็บข้อมูลความเร็วสูง<br/>
                    ✓ อายุการใช้งาน {promo.duration_days} วัน<br/>
                    ✓ ระบบสำรองข้อมูลอัตโนมัติ
                  </p>
                </div>

                <div className="promo-footer">
                  {getButtonState(promo.id)}
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PromotionPage;