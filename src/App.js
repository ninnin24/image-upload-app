import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import UploadImage from './pages/UploadImage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import ActivityLog from './pages/ActivityLog'; 
import Header from './components/Header.jsx';
import PromotionPage from './pages/PromotionPage.jsx';

const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`/auth/validate`, {
                    withCredentials: true,
                });
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
            await axios.post(
                `/logout`, 
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.warn('Logout failed (ignored):', err.message);
        } finally {
            localStorage.removeItem('user_role');
            setUser(null);
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
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} /> 
                
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
                    path="/promotions"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <PromotionPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <AdminDashboard user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/activities"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <ActivityLog />
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
                <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App;