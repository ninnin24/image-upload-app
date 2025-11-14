import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Container, Card,  useTheme, Grid, Button } from '@mui/material'; 
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// ฟังก์ชันจำลองการคำนวณพื้นที่ (MB) (คงเดิม)
const calculateStorage = (files) => {
    // ... (logic) ...
    const usedBytes = files.reduce((sum, file) => sum + file.size, 0);
    const usedMB = usedBytes / (1024 * 1024);
    const totalMB = 1024; // สมมติว่ามีพื้นที่ทั้งหมด 1 GB
    const remainingMB = totalMB - usedMB;

    return {
        used: usedMB,
        total: totalMB,
        remaining: Math.max(0, remainingMB),
        percentage: (usedMB / totalMB) * 100,
    };
};

function UserDashboard({ user, onLogout }) {
    const theme = useTheme(); 
    const [files, setFiles] = useState([]);
    const [storage, setStorage] = useState({ used: 0, total: 1024, remaining: 1024, percentage: 0 });

    const COLORS = [theme.palette.secondary.main, theme.palette.primary.light];

    // Logic: Fetch Files และคำนวณพื้นที่ (คงเดิม)
    useEffect(() => {
        if (!user) return;

        axios
            .get('/user/files', { withCredentials: true })
            .then(res => {
                const mockFiles = res.data.map(f => ({
                    ...f,
                    size: f.size || Math.floor(Math.random() * 50000000) 
                }));
                setFiles(mockFiles);
                setStorage(calculateStorage(mockFiles));
            })
            .catch(err => console.error("Error fetching files:", err));
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const data = [
        { name: 'พื้นที่ใช้งาน', value: storage.used },
        { name: 'พื้นที่คงเหลือ', value: storage.remaining },
    ];

    const StatCard = ({ title, value, unit, color }) => (
        <Card elevation={2} sx={{ p: 2, textAlign: 'left', borderLeft: `5px solid ${color}` }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.dark, mt: 0.5 }}>
                {value.toFixed(2)} {unit}
            </Typography>
        </Card>
    );

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                // ❌ ลบ pt: { xs: '64px', md: '72px' } ออกจาก Box หลัก
            }}
        >
            {/* 1. Hero Section (MUI Styling) - Header ย่อย */}
            <Box 
                sx={{ 
                    // ✅ ใช้ position: relative และ zIndex เพื่อให้ Hero อยู่ใต้ Header แต่ทับส่วน Body
                    position: 'relative',
                    zIndex: 1, 
                    py: { xs: 3, md: 4 }, 
                    px: 2, 
                    textAlign: 'center',
                    backgroundColor: theme.palette.primary.light 
                }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                    ยินดีต้อนรับ, {user.username}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    ภาพรวมพื้นที่เก็บข้อมูลและกิจกรรมล่าสุดของคุณ
                </Typography>
            </Box>

            {/* 2. Main Dashboard Content */}
            <Container 
                maxWidth="xl" 
                sx={{ 
                    // ✅ เพิ่ม Padding Top ที่นี่แทน Box หลัก เพื่อหลีกเลี่ยง Header
                    pt: { xs: '64px', md: '72px' },
                    pb: 4 
                }}
            >
                {/* 2A. Left Column: Storage Chart & Stats (คอลัมน์ 1) */}
                <Grid container spacing={4}>
                    {/* ... (Grid Item 1) ... */}
                    <Grid item xs={12} lg={4}>
                        <Card elevation={4} sx={{ p: 3, height: '100%', backgroundColor: theme.palette.background.paper }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.dark }}>
                                ภาพรวมพื้นที่เก็บข้อมูล (MB)
                            </Typography>
                            
                            {/* แผนภูมิวงกลม */}
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            labelLine={false}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value.toFixed(2)} MB`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            
                            {/* Data Summary Cards */}
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12}>
                                    <StatCard 
                                        title="พื้นที่รวมทั้งหมด" 
                                        value={storage.total} 
                                        unit="MB" 
                                        color={theme.palette.primary.dark} 
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StatCard 
                                        title="ใช้งานแล้ว" 
                                        value={storage.used} 
                                        unit="MB" 
                                        color={theme.palette.secondary.main} 
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StatCard 
                                        title="คงเหลือ" 
                                        value={storage.remaining} 
                                        unit="MB" 
                                        color={theme.palette.primary.light} 
                                    />
                                </Grid>
                            </Grid>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ mt: 3, fontWeight: 700 }}
                            >
                                อัปเกรดพื้นที่เก็บข้อมูล
                            </Button>
                        </Card>
                    </Grid>

                    {/* 2B. Right Column: Latest Files (คอลัมน์ 2) */}
                    <Grid item xs={12} lg={8}>
                        <Card elevation={4} sx={{ p: 3, height: '100%', backgroundColor: theme.palette.background.paper }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.dark }}>
                                ไฟล์ที่อัปโหลดล่าสุด
                            </Typography>
                            
                            {files.length === 0 ? (
                                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                    คุณยังไม่มีไฟล์ในระบบ
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'grid', gap: 2 }}>
                                    {files.slice(0, 5).map(file => (
                                        <Box 
                                            key={file.id} 
                                            sx={{ 
                                                p: 1.5, 
                                                backgroundColor: theme.palette.background.default, 
                                                borderLeft: `5px solid ${theme.palette.primary.main}`,
                                                borderRadius: 1, 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                    {file.filename}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    ขนาด: {(file.size / (1024 * 1024)).toFixed(2)} MB | อัปโหลด: {new Date(file.uploaded_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Button size="small" variant="text" sx={{ color: theme.palette.warning.main }}>
                                                จัดการ
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Card>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}

export default UserDashboard;