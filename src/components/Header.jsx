import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
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

    // เมนูหลักตามสถานะผู้ใช้
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
        <header className="main-header bg-white shadow-md p-4 flex flex-col md:flex-row md:justify-between md:items-center">
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer mb-2 md:mb-0"
                onClick={() => navigate(homePath)}
            >
                <img src={FileFlowz} alt="โลโก้แบรนด์" className="logo w-10 h-10" />
            </div>

            {/* เมนูนำทาง */}
            <nav className="flex flex-col md:flex-row md:gap-6 gap-2 text-gray-700 font-medium">
                {renderMenu()}
            </nav>

            {/* ปุ่มผู้ใช้ */}
            <div className="flex items-center gap-3 mt-2 md:mt-0">
                {user ? (
                    <>
                        <span className="text-gray-600 font-medium">👋 {user.username || 'ผู้ใช้'}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            ออกจากระบบ
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        เข้าสู่ระบบ
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
