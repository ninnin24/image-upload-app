import React, { useState } from "react"; // ⭐️ 1. ลบ useEffect
// ⭐️ 2. ลบ axios

// 🎨 นำเข้าไอคอน
import { CgAlignBottom, CgBox } from "react-icons/cg";
import { VscAccount, VscOutput } from "react-icons/vsc";
// ⭐️ 3. ลบ IoIosLogOut (ปุ่ม Logout อยู่ใน Header หลัก)

import DashboardSummary from "./DashboardSummary.jsx";
import CompanyManagement from "./CompanyManagement.jsx";
import UserManagement from "./UserManagement.jsx";
import ReportsAudit from "./ReportsAudit.jsx";

import "../styles/Dashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("summary");

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <DashboardSummary />;
      case "companies":
        return <CompanyManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <ReportsAudit />;
      default:
        return <DashboardSummary />;
    }
  };

  return (
    <div className="dashboard-content">
      {/* Sidebar */}
      <div className="sidebar">
        <button
          className={`sidebar-btn ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          <CgAlignBottom size={22} className="icon" />
          แดชบอร์ด
        </button>

        <button
          className={`sidebar-btn ${activeTab === "companies" ? "active" : ""}`}
          onClick={() => setActiveTab("companies")}
        >
          <CgBox size={22} className="icon" />
          จัดการบริษัท
        </button>

        <button
          className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
           <VscAccount size={22} className="icon" />
          จัดการผู้ใช้
        </button>

        <button
          className={`sidebar-btn ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <VscOutput size={22} className="icon" />
          รายงานและตรวจสอบไฟล์
        </button>
      </div>
      <div className="main-content-wrapper">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;