// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
} from '@mui/material';

// ✅ Pages
import HomeDashboard from './pages/HomeDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import UploadImage from './pages/UploadImage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MyPricingPage from './pages/MyPricingPage.jsx';

// ✅ Components
import HeaderMUI from './components/HeaderMUI.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E88E5', light: '#42A5F5', dark: '#1565C0', contrastText: '#FFFFFF' },
    secondary: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00', contrastText: '#FFFFFF' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    text: { primary: '#2D3748', secondary: '#718096' },
    success: { main: '#4CAF50' },
  },
  typography: {
    fontFamily: '"Prompt", "Roboto", sans-serif',
    h4: {
      fontWeight: 800,
      fontSize: '2rem',
      background: 'linear-gradient(90deg, #1E88E5, #1565C0)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#F5F7FA' } } },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 12px 40px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 20px', fontWeight: 700 },
        containedSecondary: { backgroundColor: '#FF9800', '&:hover': { backgroundColor: '#F57C00' } },
      },
    },
  },
});

// ==================== Protected Route ====================
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==================== App Component ====================
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
      console.warn('Logout failed:', err.message);
    } finally {
      localStorage.removeItem('user_role');
      setUser(null);
    }
  };

  if (user === undefined) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7FA',
          fontFamily: 'Prompt',
          fontWeight: 600,
          color: '#2D3748',
          fontSize: '1.2rem',
        }}
      >
        กำลังโหลดข้อมูลผู้ใช้...
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'background.default',
          }}
        >
          <HeaderMUI user={user} onLogout={handleLogout} />

          <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
            <Routes>
              <Route path="/" element={<HomeDashboard user={user} />} />
              <Route path="/home" element={<HomeDashboard user={user} />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} />
              <Route path="/forgot-password" element={<div style={{ padding: '50px' }}>หน้านี้อยู่ระหว่างพัฒนา</div>} />
              <Route path="/about" element={<AboutPage user={user} onLogout={handleLogout} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<MyPricingPage />} />

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
              <Route
                path="*"
                element={
                  <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" fontFamily="Prompt" color="text.secondary">
                      404: ไม่พบหน้านี้
                    </Typography>
                  </Box>
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;