import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, ThemeProvider, createTheme, CssBaseline, Typography, Toolbar } from '@mui/material';

// ⭐️ Pages
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
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import FileFlowzDocument from './pages/FileFlowzDocument.jsx'; 
import RecycleBinPage from './pages/RecycleBinPage.jsx'; 

// Components
import HeaderMUI from './components/HeaderMUI.jsx';

// ⭐️ Theme
const theme = createTheme({
    typography: { 
        fontFamily: 'Sarabun, sans-serif',
    },
    palette: {
        primary: { main: '#00AEEF' },
        secondary: { main: '#FF7F50' },
        background: { default: '#E0F7FA' },
    }
});

// ⭐️ Protected Route
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    if (!user || !allowedRoles.includes(user.role)) 
        return <Navigate to="/login" replace />;
    return children;
};

// ⭐️ Component Wrapper สำหรับดันเนื้อหาลงมาให้พ้น Header (ใช้กับหน้าที่ไม่ใช่ Hero)
const ContentWrapper = ({ children }) => (
    <>
        <Toolbar sx={{ height: { xs: 64, sm: 72 } }} /> {/* ดันเนื้อหาลงตามความสูง Header */}
        <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            {children}
        </Box>
    </>
);

// ⭐️ Main Wrapper
function MainAppWrapper({ user, setUser }) {
    const location = useLocation();
    const navigate = useNavigate();

    // ⭐️ Logout → กลับหน้า Home ทุกกรณี
    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
        } finally {
            setUser(null);
            localStorage.removeItem('user_role');
            navigate('/', { replace: true });   // ⭐ ไปหน้า Home
        }
    };

    // ⭐️ ซ่อน Header ในหน้า Auth (แก้ไขแล้ว)
    const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];
    const hideHeader = AUTH_ROUTES.includes(location.pathname);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {!hideHeader && <HeaderMUI user={user} onLogout={handleLogout} />}

            <Box 
                component="main" 
                // ⬇️ [แก้ไข] ลบ Padding/Margin ที่เป็นสาเหตุของช่องว่างสีขาว
                sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    p: 0, // ตั้ง Padding เป็น 0 ทั้งหมด
                    mt: hideHeader ? 0 : '-72px', // ⭐️ [FIX] ดึงเนื้อหาขึ้นไปทับ Header (สำหรับ Desktop)
                    '&:after': { // ⭐️ เพิ่ม padding ด้านบนให้กับ content เพื่อป้องกัน Header บัง
                        content: '""',
                        display: 'block',
                        height: hideHeader ? '0px' : '72px',
                        '@media (max-width:600px)': {
                            height: hideHeader ? '0px' : '64px',
                        }
                    }
                }}
            >
                {/* ⭐️ สำหรับหน้า Home Dashboard เราปล่อยให้มันแสดงผลต่อจาก Header โดยตรง 
                      ส่วนหน้าอื่น ๆ จะถูกห่อด้วย ContentWrapper เพื่อจัดการ Padding/Toolbar */}
                <Routes>

                    {/* Public Home (ไม่ต้องใช้ ContentWrapper/Toolbar) */}
                    <Route path="/" element={<HomeDashboard user={user} />} />
                    <Route path="/home" element={<HomeDashboard user={user} />} />

                    {/* Authentication (ไม่ต้องใช้ Header) */}
                    <Route path="/login" element={<LoginPage setUser={setUser} />} />
                    <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Public Information */}
                    <Route path="/about" element={<ContentWrapper><AboutPage user={user} /></ContentWrapper>} />
                    <Route path="/contact" element={<ContentWrapper><ContactPage /></ContentWrapper>} />
                    <Route path="/pricing" element={<ContentWrapper><MyPricingPage /></ContentWrapper>} />
                    <Route path="/docs" element={<ContentWrapper><FileFlowzDocument /></ContentWrapper>} /> 

                    {/* User Protected */}
                    <Route path="/upload" element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <ContentWrapper><UploadImage user={user} /></ContentWrapper>
                        </ProtectedRoute>
                    } />

                    <Route path="/my-list" element={
                        <ProtectedRoute user={user}>
                            <ContentWrapper><MyListPage user={user} /></ContentWrapper>
                        </ProtectedRoute>
                    } />

                    <Route path="/user/dashboard" element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <ContentWrapper><UserDashboard user={user} /></ContentWrapper>
                        </ProtectedRoute>
                    } />

                    <Route path="/activity" element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <ContentWrapper><ActivityLog /></ContentWrapper>
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/recycle-bin" element={
                        <ProtectedRoute user={user}> 
                            <ContentWrapper><RecycleBinPage user={user} /></ContentWrapper>
                        </ProtectedRoute>
                    } />


                    {/* Admin Protected */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <ContentWrapper><AdminDashboard user={user} /></ContentWrapper>
                        </ProtectedRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={
                        <Box sx={{ textAlign: 'center', mt: 8 }}>
                            <Typography variant="h4">404: ไม่พบหน้าที่ต้องการ</Typography>
                        </Box>
                    } />

                </Routes>
            </Box>
        </Box>
    );
}

// ⭐️ Root App
function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/auth/validate', { withCredentials: true });
                if (res.data?.username) {
                    setUser(res.data);
                    localStorage.setItem('user_role', res.data.role);
                } else {
                    setUser(null);
                    localStorage.removeItem('user_role');
                }
            } catch {
                setUser(null);
                localStorage.removeItem('user_role');
            }
        };
        checkAuth();
    }, []);

    if (user === undefined) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                กำลังโหลดข้อมูลผู้ใช้...
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <MainAppWrapper user={user} setUser={setUser} />
            </Router>
        </ThemeProvider>
    );
}

export default App;