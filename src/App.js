import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import UploadImage from './pages/UploadImage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';

// Components
import Header from './components/Header.jsx';

// Protected Route
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Backend URL
const API_URL = 'http://172.18.20.45:8080';

function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/validate`, {
                    withCredentials: true,
                });

                if (res.data && res.data.user) {
                    setUser(res.data.user);
                    localStorage.setItem('user_role', res.data.user.role);
                } else {
                    const savedRole = localStorage.getItem('user_role');
                    setUser(savedRole ? { role: savedRole } : null);
                }
            } catch (err) {
                console.warn('Auth validate failed:', err.message);
                const savedRole = localStorage.getItem('user_role');
                setUser(savedRole ? { role: savedRole } : null);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            console.log('Logout success');
        } catch (err) {
            console.warn('Logout failed (ignored):', err.message);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            setUser(null);
            // รีเฟรชเพื่อเคลียร์สถานะ
            window.location.href = '/login';
        }
    };

    if (user === undefined) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                กำลังโหลดข้อมูลผู้ใช้...
            </div>
        );
    }

    return (
        <Router>
            <Header user={user} onLogout={handleLogout} />

            <Routes>
                {/* Login / Register */}
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        user ? (
                            user.role === 'admin' ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Navigate to="/user/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* For backward compatibility */}
                <Route
                    path="/home"
                    element={
                        user ? (
                            user.role === 'admin' ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Navigate to="/user/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* User Routes */}
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
                <Route path="/about" element={<AboutPage />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <AdminDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                {/* User Dashboard */}
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <UserDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App;
