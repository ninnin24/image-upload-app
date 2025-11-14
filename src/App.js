import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Pages
import HomeDashboard from './pages/HomeDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import UploadImage from './pages/UploadImage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ContactPage from './pages/ContactPage.jsx';
// ⭐️ IMPORT: นำเข้าหน้า Pricing Plan ที่เพิ่งสร้าง
import MyPricingPage from './pages/MyPricingPage.jsx'; 

// ✅ Components
import HeaderMUI from './components/HeaderMUI.jsx'; 

// ✅ Protected Route (โค้ดคงเดิม)
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/validate', { withCredentials: true });
        if (res.data && res.data.username) {
          setUser(res.data);
          localStorage.setItem('user_role', res.data.role);
        } else {
          setUser(null);
          localStorage.removeItem('user_role');
        }
      } catch (err) {
        console.warn('Auth validate failed:', err.message);
        setUser(null);
        localStorage.removeItem('user_role');
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout failed (ignored):', err.message);
    } finally {
      localStorage.removeItem('user_role');
      setUser(null);
    }
  };

  if (user === undefined) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  return (
    <Router>
      {/* ✅ เปลี่ยนมาเรียกใช้ HeaderMUI */}
      <HeaderMUI user={user} onLogout={handleLogout} /> 

      <Routes>
        {/* ✅ หน้าเปิดเว็บไซต์ */}
        <Route path="/" element={<HomeDashboard user={user} />} />
        <Route path="/home" element={<HomeDashboard user={user} />} />

        {/* ✅ Auth */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} />
        <Route path="/forgot-password" element={<div style={{ padding: '50px' }}>หน้านี้อยู่ระหว่างพัฒนา 🔧</div>} />

        {/* ✅ Public */}
        <Route path="/about" element={<AboutPage user={user} onLogout={handleLogout} />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* ⭐️ NEW ROUTE: หน้า Pricing Plan */}
        <Route path="/pricing" element={<MyPricingPage />} />


        {/* ✅ สำหรับ User ปกติ */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute user={user} allowedRoles={['user']}>
              <UploadImage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-list"
          element={
            <ProtectedRoute user={user}>
              <MyListPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={['user']}>
              <UserDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* ✅ สำหรับ Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <div style={{ padding: '50px' }}>หน้าจัดการผู้ใช้ (Admin เท่านั้น)</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/files"
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <div style={{ padding: '50px' }}>หน้าจัดการไฟล์ (Admin เท่านั้น)</div>
            </ProtectedRoute>
          }
        />

        {/* ✅ 404 */}
        <Route path="*" element={<h1 style={{ padding: '50px' }}>404: ไม่พบหน้านี้ 😢</h1>} />
      </Routes>
    </Router>
  );
}

export default App;