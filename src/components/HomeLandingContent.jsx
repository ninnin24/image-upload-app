// src/components/HomeLandingContent.jsx

import * as React from 'react';
import { Typography, Button, Box, Container, Grid, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FileFlowz from '../assets/fileflowz2.png'; 

// 🎨 FileFlow Theme Colors (ใช้จากที่คุณกำหนด)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" }, 
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    accent: { main: "#FF7F50", light: "#FFB092" },
    text: { primary: "#003F5C", secondary: "#007F91" }, 
    background: { default: "#E0F7FA" }, 
};

// ⚙️ กำหนด Theme สำหรับ Material UI
const landingTheme = createTheme({
    typography: { fontFamily: ['Sarabun', 'sans-serif'].join(',') },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark, light: fileFlowColors.primary.light },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary, secondary: fileFlowColors.text.secondary },
    },
});


function HomeLandingContent({ onLoginClick }) { 
    return (
        <ThemeProvider theme={landingTheme}>
            <Box sx={{ background: landingTheme.palette.background.default, minHeight: '100vh' }}>
                
                {/* =================================================== */}
                {/* 1. Hero Section - เปลี่ยนพื้นหลังเป็น Gradient และลบ boxShadow */}
                {/* =================================================== */}
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: { xs: '60px 20px', md: '100px 20px' },
                        // ✅ Gradient: เริ่มจากสี Header (Primary Dark) ไปยัง Primary Light
                        background: `linear-gradient(180deg, ${landingTheme.palette.primary.dark} 0%, ${landingTheme.palette.primary.light} 100%)`, 
                        // ❌ ลบ boxShadow ออก เพื่อให้เชื่อมต่อกับ Header อย่างไร้รอยต่อ
                        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        color: 'white', // ✅ เปลี่ยนสีข้อความเป็นสีขาว เพื่อให้อ่านง่ายบน Gradient
                    }}
                >
                    {/* ✅ โลโก้ FileFlowz */}
                    <img 
                        src={FileFlowz} 
                        alt="FileFlowz Logo" 
                        style={{ 
                            width: '150px', 
                            height: '150px',
                            borderRadius: '20px', 
                            marginBottom: '32px', 
                        }}
                    />

                    {/* ✅ ปรับสี Typography เป็นสีขาว */}
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ mb: 3, fontWeight: 800, color: 'white' }}
                    >
                        แพลตฟอร์มภาพ & วิดีโอ สำหรับองค์กรที่มั่นใจ
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ mb: 4, maxWidth: '700px', color: 'rgba(255, 255, 255, 0.9)' }} // สีขาวโปร่งแสงเล็กน้อย
                    >
                        จัดเก็บ แปลง ปรับ และส่งมอบสื่อของคุณอย่างรวดเร็ว ด้วย API, SDK และระบบอัตโนมัติ
                    </Typography>
                    
                    {/* ปุ่ม CTA (คงเดิม) */}
                    <Button 
                        variant="contained" 
                        size="large" 
                        sx={{ 
                            backgroundColor: landingTheme.palette.secondary.main, 
                            color: landingTheme.palette.text.primary, 
                            fontWeight: 700, 
                            '&:hover': { backgroundColor: landingTheme.palette.secondary.light } 
                        }}
                        onClick={onLoginClick} 
                    >
                        ดูรายละเอียดเพิ่มเติม
                    </Button>
                </Box>

                <Container maxWidth="lg" sx={{ py: 8 }}>
                    
                    {/* =================================================== */}
                    {/* 3. Features (Grid Layout) */}
                    {/* =================================================== */}
                    <Typography variant="h4" component="h2" align="center" sx={{ mb: 5, fontWeight: 700, color: landingTheme.palette.primary.main }}>
                        ความสามารถหลัก
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {[
                            { title: 'API ภาพ', desc: 'เพิ่มภาพบนเว็บไซต์หรือแอปในไม่กี่นาที', icon: 'icon1.png' },
                            { title: 'API วิดีโอ', desc: 'เพิ่มวิดีโอพร้อมระบบแปลงและส่งแบบเรียลไทม์', icon: 'icon2.png' },
                            { title: 'จัดการสื่อ (DAM)', desc: 'ไลบรารีสื่อเต็มรูปแบบ พร้อมการแท็กอัตโนมัติและควบคุมสิทธิ์', icon: 'icon3.png' },
                            { title: 'AI & วิเคราะห์สื่อ', desc: 'ค้นหา ใช้วัตถุ และครอปอัตโนมัติด้วย AI', icon: 'icon4.png' }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper 
                                    elevation={3} 
                                    sx={{ padding: 4, textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', elevation: 6 } }}
                                >
                                    <img src={item.icon} alt={item.title} style={{ height: '60px', marginBottom: '15px', margin: '0 auto 15px' }} />
                                    <Typography variant="h5" component="h3" sx={{ mb: 1.5, fontWeight: 600 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {item.desc}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* =================================================== */}
                    {/* 4. Testimonials & Client Logos */}
                    {/* =================================================== */} 
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h4" component="h2" sx={{ mb: 6, fontWeight: 700 }}>
                            เสียงจากลูกค้า
                        </Typography>
                        <Paper elevation={4} sx={{ maxWidth: '800px', margin: '0 auto', padding: 4, fontStyle: 'italic', backgroundColor: landingTheme.palette.background.paper }}>
                            <Typography variant="h6" color="textPrimary">
                                "ระบบของเราเร็วขึ้นอย่างมีนัยสำคัญ ใช้งานง่ายกว่าเดิมมาก"
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: landingTheme.palette.primary.main }}>
                                – David Lien, VP of Engineering, Minted
                            </Typography>
                        </Paper>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 5, mt: 5 }}>
                            <img src="client1.png" alt="Client 1" style={{ height: '40px', opacity: 0.7, transition: 'opacity 0.3s' }} />
                            <img src="client2.png" alt="Client 2" style={{ height: '40px', opacity: 0.7, transition: 'opacity 0.3s' }} />
                            <img src="client3.png" alt="Client 3" style={{ height: '40px', opacity: 0.7, transition: 'opacity 0.3s' }} />
                        </Box>
                    </Box>
                </Container>

                {/* =================================================== */}
                {/* 5. CTA Footer (Call to Action) */}
                {/* =================================================== */} 
                <Box 
                    className="cta-footer" 
                    sx={{ 
                        padding: 8, 
                        backgroundColor: landingTheme.palette.primary.dark,
                        color: 'white', 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="h3" component="h2" sx={{ mb: 4, fontWeight: 800 }}>
                        พร้อมเริ่มต้นสร้างประสบการณ์สื่อที่น่าทึ่งแล้วหรือยัง?
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        color="warning" 
                        sx={{ 
                            color: landingTheme.palette.text.primary, 
                            fontWeight: 700, 
                            '&:hover': { backgroundColor: landingTheme.palette.warning.light } 
                        }}
                        onClick={onLoginClick} 
                    >
                        เริ่มต้นใช้งานวันนี้!
                    </Button>
                </Box>
                
                {/* =================================================== */}
                {/* 6. Footer */}
                {/* =================================================== */}
                <Box component="footer" sx={{ background: '#222', color: '#ccc', padding: 6, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>เกี่ยวกับเรา</Button>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>บริการ</Button>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>นโยบาย</Button>
                    </Box>
                    <Divider sx={{ my: 3, background: '#444', maxWidth: '400px', margin: '0 auto 20px' }} /> 
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#777' }}>
                        © {new Date().getFullYear()} ชื่อบริษัท. สงวนลิขสิทธิ์ทั้งหมด
                    </Typography>
                </Box>

            </Box>
        </ThemeProvider>
    );
}

export default HomeLandingContent;