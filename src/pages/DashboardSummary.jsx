import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Box, Typography, Card, useTheme, Grid, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText } from 'lucide-react'; 

const DashboardSummary = () => {
    const theme = useTheme(); 
    const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
    const [recentFiles, setRecentFiles] = useState([]);

    useEffect(() => {
        axios.get('/admin/summary', { withCredentials: true }) 
            .then(res => {
                const data = res.data;
                setSummary({
                    companies: data.total_companies || 0,
                    users: data.total_users || 0,
                    files: data.total_files || 0,
                });
            })
            .catch(err => console.error('Error fetching summary:', err));

        axios.get('/admin/files', { withCredentials: true })
            .then(res => setRecentFiles(res.data.slice(0, 5)))
            .catch(err => console.error('Error fetching recent files:', err));
    }, []);

    const formatDate = date => new Date(date).toLocaleString('th-TH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    });

    const formatFileSize = bytes => {
        if (!bytes) return '0 Bytes';
        const k = 1024; 
        const s = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
    };

    const chartData = [
        { name: 'บริษัท', value: summary.companies },
        { name: 'ผู้ใช้', value: summary.users },
        { name: 'ไฟล์', value: summary.files },
    ];

    const StatBox = ({ title, value, icon, color }) => (
        <Card 
            elevation={4} 
            sx={{ 
                p: 2, 
                textAlign: 'left', 
                backgroundColor: theme.palette.background.paper, 
                borderLeft: `8px solid ${color}`, 
                borderRadius: '8px',
                transition: 'transform 0.3s',
                '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            <Box sx={{ color: color, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {value.toLocaleString()}
            </Typography>
        </Card>
    );

    return (
        <Box sx={{ flexGrow: 1, px: 0 }}>

            {/* แก้จุดที่ 1 → เพิ่ม mt:0, pt:0 */}
            <Grid container spacing={2} sx={{ maxWidth: "1100px", margin: "0 auto", mt: 0, pt: 0, mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatBox 
                        title="บริษัททั้งหมด" 
                        value={summary.companies} 
                        icon={<Briefcase size={28} />} 
                        color={theme.palette.primary.main} 
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatBox 
                        title="ผู้ใช้ทั้งหมด" 
                        value={summary.users} 
                        icon={<Users size={28} />} 
                        color={theme.palette.secondary.main} 
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatBox 
                        title="จำนวนไฟล์ทั้งหมด" 
                        value={summary.files} 
                        icon={<FileText size={28} />} 
                        color={theme.palette.warning.main} 
                    />
                </Grid>
            </Grid>

            {/* แก้จุดที่ 2 → เพิ่ม mt:0, pt:0 */}
            <Grid container spacing={3} sx={{ maxWidth: "1100px", margin: "0 auto", mt: 0, pt: 0 }}>
                <Grid item xs={12}>
                    <Card elevation={4} sx={{ p: 3, borderRadius: '12px' }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 3, 
                                color: theme.palette.primary.dark,
                                textAlign: "center" 
                            }}
                        >
                            ภาพรวมจำนวนระบบ (บริษัท, ผู้ใช้, ไฟล์)
                        </Typography>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Bar 
                                    dataKey="value" 
                                    fill={theme.palette.primary.main} 
                                    radius={[12, 12, 0, 0]} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card elevation={4} sx={{ p: 3, borderRadius: '12px' }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 3, 
                                color: theme.palette.primary.dark,
                                textAlign: "center" 
                            }}
                        >
                            ไฟล์ล่าสุดที่อัปโหลด
                        </Typography>

                        {recentFiles.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: "center" }}>
                                ยังไม่มีไฟล์อัปโหลดล่าสุด
                            </Typography>
                        ) : (
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                {recentFiles.map(f => (
                                    <Box key={f.id} sx={{
                                        p: 2,
                                        borderLeft: `6px solid ${theme.palette.secondary.main}`,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        transition: "0.2s",
                                        "&:hover": { transform: "translateX(5px)" }
                                    }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {f.filename || "ไม่ระบุชื่อไฟล์"}
                                        </Typography>

                                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                            <Chip 
                                                size="small" 
                                                label={`บริษัท: ${f.company_name || "N/A"}`}
                                            />
                                            <Typography variant="caption">
                                                ขนาด: {formatFileSize(f.filesize_bytes)}
                                            </Typography>
                                        </Box>

                                        <Typography variant="caption" color="text.secondary">
                                            อัปโหลด: {formatDate(f.uploaded_at)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardSummary;
