import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Import Components
import DashboardSummary from './DashboardSummary';
import CompanyManagement from './CompanyManagement';
import UserManagement from './UserManagement';
import AllFilesAudit from './AllFilesAudit';

import '../styles/Dashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('summary');
  const navigate = useNavigate();

  const handleLogout = () => {
    // ล้างข้อมูลผู้ใช้ใน localStorage หรือ cookie ถ้ามี
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    navigate('/login', { replace: true });
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'summary':
        return <DashboardSummary />;
      case 'companies':
        return <CompanyManagement />;
      case 'users':
        return <UserManagement />;
      case 'files':
        return <AllFilesAudit />;
      default:
        return <DashboardSummary />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="main-header">
        <div
          style={{ cursor: 'pointer', fontWeight: '700', fontSize: '1.6em', color: 'white' }}
          onClick={() => setActiveTab('summary')}
        >
          Happy Soft
        </div>
        <nav className="header-nav">
          <span className="nav-item" onClick={() => navigate('/home')}>หน้าหลัก</span>
          <span className="nav-item" onClick={() => navigate('/about')}>เกี่ยวกับเรา</span>
        </nav>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            🏠 Dashboard
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            🏢 จัดการบริษัท
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👤 จัดการผู้ใช้
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            📁 ดูไฟล์ทั้งหมด
          </button>

          {/* Logout */}
          <div className="sidebar-footer">
            <button className="sidebar-btn logout" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
