
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import HomeDashboard from './pages/HomeDashboard.jsx';
import UploadImage from './pages/UploadImage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// 404 Page
function NotFoundPage() {
    return <h1>404: Page Not Found</h1>;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* หน้าแรกแมปไป HomeDashboard */}
                <Route path="/" element={<HomeDashboard />} />
                <Route path="/home" element={<HomeDashboard />} />
                <Route path="/uploadimage" element={<UploadImage />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
