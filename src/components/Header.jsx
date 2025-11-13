// Header.jsx (ตำแหน่ง: src/components/)

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css'; // คุณอาจจะต้องเพิ่ม CSS ในไฟล์นี้สำหรับ filter drop-shadow
import FileFlowz from '../assets/fileflowz2.png';

const NO_HEADER_PATHS = ['/login', '/register', '/forgot-password'];

function Header({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    // ซ่อน Header บนหน้า Login/Register
    if (NO_HEADER_PATHS.includes(location.pathname)) {
        return null;
    }

    const isAdmin = user?.role === 'admin';
    const homePath = isAdmin ? '/admin/dashboard' : user ? '/user/dashboard' : '/';

    const renderMenu = () => {
        if (!user) {
            // Guest
            return (
                <>
                    <Link to={homePath} className="nav-item">หน้าหลัก</Link>
                    <a href="#products" className="nav-item">ผลิตภัณฑ์</a>
                    <a href="#pricing" className="nav-item">ราคา</a>
                    <Link to="/contact" className="nav-item">ติดต่อเรา</Link>
                    <Link to="/about" className="nav-item">เกี่ยวกับเรา</Link>
                </>
            );
        } else if (isAdmin) {
            // Admin
            return (
                <>
                    <Link to="/admin/dashboard" className="nav-item">แดชบอร์ด</Link>
                    <Link to="/admin/users" className="nav-item">จัดการผู้ใช้</Link>
                    <Link to="/admin/files" className="nav-item">จัดการไฟล์</Link>
                    <Link to="/contact" className="nav-item">ติดต่อเรา</Link>
                </>
            );
        } else {
            // User
            return (
                <>
                    <Link to="/user/dashboard" className="nav-item">หน้าหลัก</Link>
                    <Link to="/upload" className="nav-item">อัปโหลดไฟล์</Link>
                    <Link to="/my-list" className="nav-item">รายการของฉัน</Link>
                    <Link to="/contact" className="nav-item">ติดต่อเรา</Link>
                </>
            );
        }
    };

    return (
        // ✅ เปลี่ยนพื้นหลัง Header เป็นสีน้ำเงินเข้มและเพิ่มเงา
        <header className="main-header bg-blue-800 shadow-xl p-4 flex flex-col md:flex-row md:justify-between md:items-center sticky top-0 z-50 text-white">
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer mb-2 md:mb-0"
                onClick={() => navigate(homePath)}
            >
                {/* 🚀 ปรับปรุง: เพิ่มขนาด, เงา, และเอฟเฟกต์เมื่อ hover */}
                <img 
                    src={FileFlowz} 
                    alt="โลโก้แบรนด์" 
                    // ✅ ขนาดโลโก้ใหญ่ขึ้น, เพิ่ม shadow ที่ชัดเจน, border-radius, และ transition
                    className="logo w-14 h-14 object-contain shadow-lg rounded-md 
                               transform hover:scale-110 transition duration-300 ease-in-out" 
                    style={{ 
                        // หากโลโก้มีสีจางเกินไปบนพื้นหลังน้ำเงิน สามารถเพิ่ม filter: brightness(1.2) หรือ drop-shadow ที่นี่ได้
                        // filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))' 
                    }}
                />
            </div>

            {/* เมนูนำทาง - เปลี่ยนสีข้อความให้เป็นสีขาว/อ่อน */}
            <nav className="flex flex-col md:flex-row md:gap-6 gap-2 text-white font-medium">
                {renderMenu()}
            </nav>

            {/* ปุ่มผู้ใช้ */}
            <div className="flex items-center gap-3 mt-2 md:mt-0">
                {user ? (
                    <>
                        <span className="text-white font-medium">👋 {user.username || 'ผู้ใช้'}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            ออกจากระบบ
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        เข้าสู่ระบบ
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;