import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { VscCloudUpload } from 'react-icons/vsc';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import '../styles/UserChart.css'; 

function UserDashboard({ user }) {
    const [files, setFiles] = useState([]);
    const [currentWord, setCurrentWord] = useState(0);
    const words = ['สวัสดี คุณ,', 'ยินดีต้อนรับ,'];

    useEffect(() => {
        if (user) {
            axios
                .get('/user/files', { withCredentials: true })
                .then((res) => setFiles(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    const uploadsThisMonth = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return files.filter(file => {
            const uploadDate = new Date(file.uploaded_at);
            return uploadDate.getMonth() === currentMonth &&
                    uploadDate.getFullYear() === currentYear;
        }).length;
    }, [files]); 

    const totalSizeUsedMB = useMemo(() => {
        const totalBytes = files.reduce((sum, file) => {
            return sum + (file.file_size_bytes || 0); 
        }, 0);
        return (totalBytes / 1024 / 1024); 
    }, [files]);

    const RECENT_FILES_LIMIT = 5; 

    const recentFiles = useMemo(() => {
        const sortedFiles = [...files].sort((a, b) => {
            return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        });
        return sortedFiles.slice(0, RECENT_FILES_LIMIT);
    }, [files]); 

    
    const userQuotaMB = user?.storage_quota_mb || 1024; 
    const freeSpaceMB = userQuotaMB - totalSizeUsedMB;

    const chartData = [
        { name: 'พื้นที่ใช้งาน (MB)', value: parseFloat(totalSizeUsedMB.toFixed(2)) },
        { name: 'พื้นที่คงเหลือ (MB)', value: parseFloat(Math.max(0, freeSpaceMB).toFixed(2)) },
    ];
    const COLORS = ['#FF8042', '#00C49F']; 

    return (
        <div className="home-container">
            <section className="hero">
                <h1 className="greeting">
                    <span className="fade-text">{words[currentWord]}</span>{' '}
                    <span className="username">{user?.username || 'User'}</span>
                </h1>
                <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
            </section>

            <div className="dashboard-grid">
                <section className="dashboard-chart-column">
                    <h2>สรุปพื้นที่ใช้งาน</h2>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60} 
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} MB`} />
                                <Legend />
                                <text 
                                    x="50%" 
                                    y="45%"
                                    textAnchor="middle" 
                                    dominantBaseline="middle" 
                                    className="chart-center-text-primary"
                                >
                                    {`${totalSizeUsedMB.toFixed(2)} MB`}
                                </text>
                                <text 
                                    x="50%" 
                                    y="55%"
                                    textAnchor="middle" 
                                    dominantBaseline="middle" 
                                    className="chart-center-text-secondary"
                                >
                                    {`จาก ${userQuotaMB} MB`}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <div className="dashboard-stats-column">
                    <section className="dashboard-stats">
                        <div className="stat-card">
                            <div className="stat-icon upload">
                                <VscCloudUpload size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{uploadsThisMonth}</span> 
                                <span className="stat-label">ไฟล์ที่อัปโหลดในเดือนนี้</span>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-files-list">
                        <h2>ไฟล์ของฉัน (ล่าสุด {RECENT_FILES_LIMIT} รายการ)</h2>
                        {files.length === 0 ? (
                            <p>คุณยังไม่มีไฟล์</p>
                        ) : (
                            recentFiles.map((file) => (
                                <div key={file.id} className="timeline-item">
                                    <strong>{file.filename || file.file_name}</strong> 
                                    <p>
                                        อัปโหลดวันที่:{' '}
                                        {new Date(file.uploaded_at).toLocaleString('th-TH')}
                                    </p>
                                </div>
                            ))
                        )}
                    </section>
                </div>
                
            </div>
        </div>
    );
}

export default UserDashboard;