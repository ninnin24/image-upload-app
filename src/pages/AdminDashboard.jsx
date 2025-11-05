import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

// 🟧 ฟังก์ชันย่อย: แสดงสรุปภาพรวม
const DashboardSummary = ({ summaryData }) => (
    <div className="summary-cards-container">
        <div className="summary-card primary">
            <h4>รวมจำนวนบริษัท</h4>
            <p>{summaryData?.companies || '...'}</p>
            <span className="details-link">จัดการบริษัท ></span>
        </div>
        <div className="summary-card secondary">
            <h4>รวมจำนวนผู้ใช้ทั้งหมด</h4>
            <p>{summaryData?.users || '...'}</p>
            <span className="details-link">จัดการผู้ใช้ ></span>
        </div>
        <div className="summary-card tertiary">
            <h4>รวมจำนวนไฟล์ทั้งหมด</h4>
            <p>{summaryData?.files || '...'}</p>
            <span className="details-link">ดูไฟล์ทั้งหมด ></span>
        </div>
    </div>
);

// 🏢 จัดการบริษัท
const CompanyManagement = () => (
    <div className="admin-content-box">
        <h3>🏢 จัดการบริษัท</h3>
        <button className="action-button primary-orange-bg">+ เพิ่มบริษัทใหม่</button>
        <div className="placeholder-table">
            [ตาราง: ชื่อบริษัท, จำนวนผู้ใช้, จำนวนไฟล์, วันที่สร้าง, การดำเนินการ (แก้ไข/ลบ)]
        </div>
    </div>
);

// 👤 จัดการผู้ใช้
const UserManagement = () => (
    <div className="admin-content-box">
        <h3>👤 จัดการผู้ใช้</h3>
        <button className="action-button primary-orange-bg">+ เพิ่มผู้ใช้ใหม่</button>
        <div className="placeholder-table">
            [ตาราง: ชื่อผู้ใช้, อีเมล, บริษัทที่สังกัด, สิทธิ์ (Admin/User), การดำเนินการ (รีเซ็ตรหัสผ่าน/ลบ)]
        </div>
    </div>
);

// 📁 ดูไฟล์ทั้งหมด
const AllFilesAudit = () => {
    const [allFiles] = useState([]);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const [filterCompany, setFilterCompany] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) return <p>กำลังโหลดรายการไฟล์ทั้งหมด...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    const filteredFiles = allFiles;
    const uniqueCompanies = [];

    return (
        <div className="admin-content-box">
            <h3>📁 ดูไฟล์ทั้งหมด ({filteredFiles.length})</h3>
            <div className="filter-controls">
                <input
                    type="text"
                    placeholder="ค้นหาตามชื่อไฟล์..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
                <select
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="filter-select"
                >
                    <option value="">กรองตามบริษัททั้งหมด</option>
                    {uniqueCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                    ))}
                </select>
                <button className="action-button primary-orange-bg">
                    ⬇️ ดาวน์โหลดรายงาน (Excel)
                </button>
            </div>
            <p>ไม่พบไฟล์ที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
    );
};

// 📊 รายงานและตรวจสอบไฟล์
const Reporting = () => (
    <div className="admin-content-box">
        <h3>📊 รายงานและตรวจสอบไฟล์</h3>
        <button className="action-button primary-orange-bg">
            ⬇️ ดาวน์โหลดรายงาน (Excel)
        </button>
        <p>รายงานสรุปจำนวนไฟล์ในแต่ละบริษัท และกราฟการอัปโหลดรายเดือน</p>
        <div className="placeholder-report-chart">
            [กราฟข้อมูล Audit Trail]
        </div>
    </div>
);

// 🔶 Component หลัก: Admin Dashboard
function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('summary');
    const [summaryData] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'summary':
                return (
                    <>
                        <DashboardSummary summaryData={summaryData} />
                        <AllFilesAudit />
                    </>
                );
            case 'companies':
                return <CompanyManagement />;
            case 'users':
                return <UserManagement />;
            case 'files':
                return <AllFilesAudit />;
            case 'reports':
                return <Reporting />;
            default:
                return <DashboardSummary summaryData={summaryData} />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* 🔶 Header */}
            <header className="main-header">
                {/* 🔹 แก้โลโก้เป็นข้อความ Happy Soft */}
                <div
                    className="header-logo-container"
                    onClick={() => handleNavigation('/admin/dashboard')}
                    style={{ cursor: 'pointer', fontWeight: '700', fontSize: '1.6em', color: 'white' }}
                >
                    Happy Soft
                </div>

                <nav className="header-nav">
                    <span className="nav-item" onClick={() => handleNavigation('/home')}>หน้าหลัก</span>
                    <span className="nav-item dropdown">บริการ ▼</span>
                    <span className="nav-item" onClick={() => handleNavigation('/about')}>เกี่ยวกับเรา</span>
                </nav>
            </header>

            <div className="dashboard-content">
                {/* 🔸 Sidebar */}
                <div className="sidebar">
                    <button className={`sidebar-btn ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}>
                        🏠 ภาพรวมระบบ
                    </button>

                    <button className={`sidebar-btn ${activeTab === 'companies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('companies')}>
                        🏢 จัดการบริษัท
                    </button>

                    <button className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}>
                        👤 จัดการผู้ใช้
                    </button>

                    <button className={`sidebar-btn ${activeTab === 'files' ? 'active' : ''}`}
                        onClick={() => setActiveTab('files')}>
                        📁 ดูไฟล์ทั้งหมด
                    </button>

                    <button className={`sidebar-btn ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}>
                        📊 รายงานและตรวจสอบ
                    </button>

                    <div className="sidebar-footer">
                        <button className="sidebar-btn logout" onClick={handleLogout}>ออกจากระบบ</button>
                    </div>
                </div>

                <div className="main-content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
