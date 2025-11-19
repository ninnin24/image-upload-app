import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Box, ThemeProvider, createTheme, CssBaseline, Typography } from '@mui/material';

// Pages
import HomeDashboard from './pages/HomeDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import UploadImage from './pages/UploadImage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MyPricingPage from './pages/MyPricingPage.jsx';
import ActivityLog from './pages/ActivityLog.jsx';
// ⭐️ เพิ่มการนำเข้าคอมโพเนนต์ใหม่
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'; 

// Components
import HeaderMUI from './components/HeaderMUI.jsx';

const theme = createTheme({ /* ...เหมือนเดิม... */ });

// Protected Route
const ProtectedRoute = ({ user, children, allowedRoles = ['admin','user'] }) => {
    if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/auth/validate', { withCredentials: true });
                if (res.data?.username) { setUser(res.data); localStorage.setItem('user_role', res.data.role); }
                else { setUser(null); localStorage.removeItem('user_role'); }
            } catch { setUser(null); localStorage.removeItem('user_role'); }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try { await axios.post('/logout', {}, { withCredentials: true }); }
        finally { setUser(null); localStorage.removeItem('user_role'); }
    };

    if (user === undefined) return <Box sx={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>กำลังโหลดข้อมูลผู้ใช้...</Box>;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{ minHeight:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                    {/* Header ถูกซ่อนเมื่อเข้าหน้า Login/Register/Forgot-Password เพื่อการแสดงผลเต็มหน้าจอที่ดูดีกว่า */}
                    {user === null && (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register') || window.location.pathname.startsWith('/forgot-password')) ? null : <HeaderMUI user={user} onLogout={handleLogout} />}
                    
                    <Box component="main" sx={{ flex:1, overflow:'auto', p: (user === null && (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register') || window.location.pathname.startsWith('/forgot-password'))) ? 0 : { xs:2, md:3 } }}>
                        <Routes>
                            <Route path="/" element={<HomeDashboard user={user} />} />
                            <Route path="/home" element={<HomeDashboard user={user} />} />
                            
                            {/* Public Routes for Authentication */}
                            <Route path="/login" element={<LoginPage setUser={setUser} />} />
                            <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} />
                            {/* ⭐️ Route ใหม่สำหรับ Forgot Password */}
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 

                            {/* Public Routes for Information */}
                            <Route path="/about" element={<AboutPage user={user} />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/pricing" element={<MyPricingPage />} />

                            {/* User/Mixed Protected Routes */}
                            <Route path="/upload" element={<ProtectedRoute user={user} allowedRoles={['user']}><UploadImage user={user} /></ProtectedRoute>} />
                            <Route path="/my-list" element={<ProtectedRoute user={user}><MyListPage user={user} /></ProtectedRoute>} />
                            <Route path="/user/dashboard" element={<ProtectedRoute user={user} allowedRoles={['user']}><UserDashboard user={user} /></ProtectedRoute>} />
                            <Route path="/activity" element={<ProtectedRoute user={user} allowedRoles={['user']}><ActivityLog /></ProtectedRoute>} />

                            {/* Admin Protected Routes */}
                            <Route path="/admin/dashboard" element={<ProtectedRoute user={user} allowedRoles={['admin']}><AdminDashboard user={user} /></ProtectedRoute>} />

                            {/* 404 */}
                            <Route path="*" element={<Box sx={{ textAlign:'center', mt:8 }}><Typography variant="h4">404: ไม่พบหน้าที่ต้องการ</Typography></Box>} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;