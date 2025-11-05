import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function HomeDashboard() {
    const userRole = 'ผู้ดูแลระบบ';

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
        setFiles(storedFiles);
    }, []);

    const handleDelete = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        localStorage.setItem('uploaded_files', JSON.stringify(newFiles));
        setFiles(newFiles);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-logo">Happy Soft</div>
                <nav className="home-nav">
                    <Link to="/home" className="active">หน้าหลัก</Link>
                    <Link to="/uploadimage">อัปโหลดไฟล์</Link>
                    <Link to="/my-list">รายการของฉัน</Link>
                    <Link to="/about">เกี่ยวกับ</Link>
                </nav>
                <div className="user-info">
                    <span className="user-role-tag">ADMIN</span>
                    <span className="user-icon">👤</span>
                </div>
            </header>

            <main className="home-main">
                <h2>กิจกรรมและไฟล์ล่าสุด</h2>

                <div className="file-list">
                    {files.length === 0 ? (
                        <p className="no-files">ยังไม่มีไฟล์อัปโหลด</p>
                    ) : (
                        files.map((file, index) => (
                            <div key={index} className="file-item">
                                {file.name} - <small>{file.uploadedAt}</small>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(index)}
                                >
                                    🗑️ ลบ
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default HomeDashboard;
