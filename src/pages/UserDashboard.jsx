import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // ❌ ถูกลบออกเนื่องจากไม่ได้ใช้งาน
import { Navigate, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Card, 
    useTheme, 
    Grid, 
    Button,
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Divider,
    useMediaQuery
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'; 
// นำเข้าไอคอนสำหรับ Activity Log
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';


// -------------------- Mock Data / Calculation --------------------

const calculateStorage = (files) => {
    const usedBytes = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const usedMB = usedBytes / (1024 * 1024);
    const totalMB = 1024; // พื้นที่รวม 1GB
    const remainingMB = totalMB - usedMB;

    return {
        used: usedMB,
        total: totalMB,
        remaining: Math.max(0, remainingMB),
        percentage: Math.min(100, (usedMB / totalMB) * 100),
    };
};

const mockActivities = [
    { id: 1, type: 'อัปโหลด', detail: 'รายงานประจำปี_Q3.pdf', date: '14 พ.ย. 2568, 14:00', icon: UploadIcon, color: '#40E0D0' },
    { id: 2, type: 'ดาวน์โหลด', detail: 'แผนการตลาด_2026.docx', date: '14 พ.ย. 2568, 10:30', icon: DownloadIcon, color: '#00AEEF' },
    { id: 3, type: 'ลบไฟล์', detail: 'ไฟล์ชั่วคราว_01.tmp', date: '13 พ.ย. 2568, 16:15', icon: DeleteIcon, color: '#FF7F50' },
    { id: 4, type: 'แชร์ไฟล์', detail: 'ภาพรวมโปรเจกต์ (ไปยัง user@co.th)', date: '13 พ.ย. 2568, 09:00', icon: ShareIcon, color: '#87CEEB' },
    { id: 5, type: 'อัปโหลด', detail: 'Presentation_Demo.pptx', date: '12 พ.ย. 2568, 11:45', icon: UploadIcon, color: '#40E0D0' },
    { id: 6, type: 'ดาวน์โหลด', detail: 'ข้อมูลลูกค้าทั้งหมด.csv', date: '11 พ.ย. 2568, 15:30', icon: DownloadIcon, color: '#00AEEF' },
    { id: 7, type: 'อัปโหลด', detail: 'โลโก้บริษัทฉบับสุดท้าย.png', date: '10 พ.ย. 2568, 08:00', icon: UploadIcon, color: '#40E0D0' },
    { id: 8, type: 'แชร์ไฟล์', detail: 'งบประมาณ Q4', date: '09 พ.ย. 2568, 14:30', icon: ShareIcon, color: '#87CEEB' },
];


// -------------------- UserDashboard Component --------------------

function UserDashboard({ user, onLogout }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    
    // ✅ แก้ไข: ลบ setFiles ออก
    const [files] = useState([
        { id: 101, filename: 'Project Plan.pdf', size: 12500000, uploaded_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 102, filename: 'Client Report.docx', size: 5500000, uploaded_at: new Date(Date.now() - 7200000).toISOString() },
        { id: 103, filename: 'Design Mockup.zip', size: 82000000, uploaded_at: new Date(Date.now() - 10800000).toISOString() },
        { id: 104, filename: 'Meeting Notes.txt', size: 10000, uploaded_at: new Date(Date.now() - 14400000).toISOString() },
        { id: 105, filename: 'Budget Sheet.xlsx', size: 4100000, uploaded_at: new Date(Date.now() - 18000000).toISOString() },
        { id: 106, filename: 'Presentation.pptx', size: 12000000, uploaded_at: new Date(Date.now() - 21600000).toISOString() },
        { id: 107, filename: 'Backup Data.rar', size: 50000000, uploaded_at: new Date(Date.now() - 25200000).toISOString() },
    ]); 
    
    // ✅ แก้ไข: ลบ setStorage ออก
    const [storage] = useState(calculateStorage(files));

    // ✅ ปรับปรุง: ลบการเรียก API ที่ถูก Comment out ออกจาก useEffect ชั่วคราว หรือลบ useEffect ทิ้งไปเลยหากไม่ได้ใช้
    useEffect(() => {
        // if (!user) return;
        // console.log("User data loaded:", user); 
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const data = [
        { name: 'พื้นที่ใช้งาน', value: storage.used },
        { name: 'พื้นที่คงเหลือ', value: storage.remaining },
    ];
    
    const headerHeightXs = theme.mixins.toolbar.minHeight;
    const headerHeightMd = theme.mixins.toolbar['@media (min-width:600px)']?.minHeight || 72;
    const heroSectionHeight = 180; 

    const remainingHeightCalc = (headerH) => `calc(100vh - ${headerH}px - ${heroSectionHeight}px)`;


    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                paddingTop: theme.mixins.toolbar,
                overflowY: 'hidden', 
            }}
        >
            {/* 1. Hero Section (ส่วนต้อนรับสีฟ้า) */}
            <Box
                sx={{
                    height: heroSectionHeight, 
                    flexShrink: 0, 
                    px: 2,
                    textAlign: 'center',
                    backgroundColor: theme.palette.primary.light,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary, mt: 1 }}> 
                    ยินดีต้อนรับ, {user.username || 'ผู้ใช้'}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    ภาพรวมพื้นที่เก็บข้อมูลและกิจกรรมล่าสุดของคุณ
                </Typography>
            </Box>

            {/* 2. Main Dashboard Content (ส่วนนี้จะยืดเต็มพื้นที่ที่เหลือและจัดการการ Scroll ภายใน) */}
            <Container
                maxWidth="xl"
                sx={{
                    flexGrow: 1, 
                    overflowY: isMobile ? 'auto' : 'hidden', 
                    pt: 4, 
                    pb: 4,
                    height: isMobile ? 'auto' : { 
                        xs: remainingHeightCalc(headerHeightXs),
                        md: remainingHeightCalc(headerHeightMd)
                    },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Grid container spacing={4} sx={{ flexGrow: 1, height: isMobile ? 'auto' : '100%' }}>
                    
                    {/* คอลัมน์ซ้าย: สถิติพื้นที่เก็บข้อมูล (lg={4}) */}
                    <Grid item xs={12} lg={4} sx={{ height: isMobile ? 'auto' : '100%' }}>
                        <Card 
                            elevation={4} 
                            sx={{ 
                                p: 3, 
                                height: '100%', 
                                backgroundColor: theme.palette.background.paper, 
                                display: 'flex', 
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.dark, flexShrink: 0 }}>
                                ภาพรวมพื้นที่เก็บข้อมูล (MB)
                            </Typography>
                            
                            {/* Radial Chart - ตรึงความสูงไว้ */}
                            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60} 
                                            outerRadius={90}
                                            startAngle={90}
                                            endAngle={-270}
                                            paddingAngle={0}
                                            fill="#8884d8"
                                            isAnimationActive={true}
                                        >
                                            <Cell fill={theme.palette.secondary.main} key="used" />
                                            <Cell fill={theme.palette.primary.light} key="remaining" />
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value.toFixed(2)} MB`} />
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={theme.palette.text.primary}>
                                            <tspan x="50%" dy="-0.5em" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{storage.percentage.toFixed(0)}%</tspan>
                                            <tspan x="50%" dy="1.5em" style={{ fontSize: '0.8rem', fill: theme.palette.text.secondary }}>ใช้งานแล้ว</tspan>
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            
                            {/* Storage Stats - ตรึงความสูงไว้ */}
                            <Grid container spacing={2} sx={{ mt: 2, flexShrink: 0, flexGrow: 1 }}> 
                                <Grid item xs={6}>
                                    <Box sx={{ p: 1, textAlign: 'left', borderLeft: `5px solid ${theme.palette.secondary.main}` }}>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>ใช้งานแล้ว</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.dark, mt: 0.5 }}>{storage.used.toFixed(2)} MB</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 1, textAlign: 'left', borderLeft: `5px solid ${theme.palette.primary.light}` }}>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>คงเหลือ</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.dark, mt: 0.5 }}>{storage.remaining.toFixed(2)} MB</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700 }}>
                                        อัปเกรดพื้นที่เก็บข้อมูล
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* คอลัมน์ขวา: 2 Card ในแนวนอน (lg={8}) */}
                    <Grid item xs={12} lg={8} sx={{ 
                        height: isMobile ? 'auto' : '100%', 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row', 
                        gap: theme.spacing(4) 
                    }}>
                        
                        {/* 2.3. ไฟล์ที่อัปโหลดล่าสุด (Column 1/2) */}
                        <Card 
                            elevation={4} 
                            sx={{ 
                                p: 3, 
                                flexGrow: 1, 
                                flexBasis: isMobile ? 'auto' : '50%',
                                height: isMobile ? 'auto' : '100%', 
                                backgroundColor: theme.palette.background.paper,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.dark, flexShrink: 0 }}>
                                ไฟล์ที่อัปโหลดล่าสุด
                            </Typography>
                            
                            {/* List Content - ส่วนที่ Scroll ได้ (ใน Desktop) */}
                            <Box sx={{ flexGrow: 1, overflowY: isMobile ? 'hidden' : 'auto', paddingRight: 1 }}>
                                {files.length === 0 ? (
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                        คุณยังไม่มีไฟล์ในระบบ
                                    </Typography>
                                ) : (
                                    <List dense>
                                        {files.slice(0, 7).map(file => (
                                            <ListItem key={file.id} disablePadding sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <ListItemText
                                                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{file.filename}</Typography>}
                                                    secondary={`ขนาด: ${(file.size / (1024 * 1024)).toFixed(2)} MB | อัปโหลด: ${new Date(file.uploaded_at).toLocaleDateString()}`}
                                                />
                                                <Button size="small" variant="text" sx={{ color: theme.palette.warning.main, flexShrink: 0 }}>
                                                    จัดการ
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                            
                            {/* Footer Button - ตรึงไว้ */}
                            <Box sx={{ mt: 2, textAlign: 'right', flexShrink: 0 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => navigate('/my-list')}
                                >
                                    ดูทั้งหมด
                                </Button>
                            </Box>
                            
                        </Card>
                        
                        {/* 2.4. ประวัติการกระทำ (Column 2/2) */}
                        <Card 
                            elevation={4} 
                            sx={{ 
                                p: 3, 
                                flexGrow: 1, 
                                flexBasis: isMobile ? 'auto' : '50%',
                                height: isMobile ? 'auto' : '100%', 
                                backgroundColor: theme.palette.background.paper,
                                display: 'flex',
                                flexDirection: 'column' 
                            }}
                        >
                            {/* Title - ตรึงไว้ */}
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.dark, flexShrink: 0 }}>
                                ประวัติการกระทำ (Activity Log)
                            </Typography>
                            
                            {/* List Content - ส่วนที่ Scroll ได้ (ใน Desktop) */}
                            <Box sx={{ flexGrow: 1, overflowY: isMobile ? 'hidden' : 'auto', paddingRight: 1 }}>
                                <List dense>
                                    {mockActivities.map((activity, index) => (
                                        <React.Fragment key={activity.id}>
                                            <ListItem disablePadding>
                                                <ListItemIcon>
                                                    <activity.icon sx={{ color: activity.color }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>
                                                                {activity.type}
                                                            </Typography>
                                                            <Typography component="span" variant="caption" color="text.secondary">
                                                                {activity.date}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={activity.detail}
                                                />
                                            </ListItem>
                                            {index < mockActivities.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                    {mockActivities.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 5 }}>
                                            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>ไม่มีกิจกรรมล่าสุด</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Box>
                            
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default UserDashboard;