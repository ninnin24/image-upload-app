import * as React from 'react';
import { 
    Typography, 
    Button, 
    Box, 
    Container, 
    Grid, 
    Paper, 
    Divider, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    TextField, 
    Link as MuiLink 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ✅ ICONS: ต้องนำเข้า Icons สำหรับใช้ใน Full Footer 
import { 
    LocationOn, 
    Phone, 
    Mail, 
    ArrowRightAlt as ArrowRightIcon
} from '@mui/icons-material';

// ✅ ASSETS: รูปภาพสำหรับ Hero/Features
import FileFlowz from '../assets/fileflowz2.png'; 
import ApiImage from '../assets/api image.png'; 
import ApiVideo from '../assets/api_video.png'; 
import Rightsimage from '../assets/Rightsimage.png'; 

// 🎨 FileFlow Theme Colors (อัปเดตจาก AboutPage เพื่อให้มี footer_bg)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" }, 
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    accent: { main: "#FF7F50", light: "#FFB092" },
    text: { primary: "#003F5C", secondary: "#007F91" }, 
    background: { default: "#E0F7FA" },
    footer_bg: '#1A2333', 
    warning: { main: '#FFC107' }, 
};

// ⚙️ กำหนด Theme สำหรับ Material UI 
const landingTheme = createTheme({
    typography: { 
        fontFamily: ['Sarabun', 'sans-serif'].join(','),
        h6: { fontWeight: 700 }, 
        subtitle1: { fontWeight: 700 },
    }, 
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark, light: fileFlowColors.primary.light },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary, secondary: fileFlowColors.text.secondary },
        background: { default: fileFlowColors.background.default },
    },
    mixins: {
        toolbar: { minHeight: 64, '@media (min-width:600px)': { minHeight: 72 } },
    },
});

// ✅ TEXT CONTENT: คัดลอกฟังก์ชัน getText ที่จำเป็นสำหรับ Full Footer มา
const getText = (lang, key) => {
    const texts = {
        th: {
            footer_subscribe_title: 'รับข่าวสารและบทความล่าสุด',
            footer_subscribe_desc: 'สมัครรับจดหมายข่าวของเราเพื่อรับข้อมูลล่าสุดเกี่ยวกับเทคโนโลยี โปรโมชั่น และเคล็ดลับการทำธุรกิจ',
            footer_email_label: 'อีเมลของคุณ',
            footer_subscribe_button: 'สมัครรับข่าวสาร',
            footer_privacy_note: 'เราเคารพความเป็นส่วนตัวของคุณและจะไม่แชร์ข้อมูลของคุณกับบุคคลที่สาม',
            footer_expert_desc: 'ผู้เชี่ยวชาญด้านการพัฒนาซอฟต์แวร์และนวัตกรรมเทคโนโลยี พร้อมเป็นพาร์ทเนอร์ทางธุรกิจ ที่ช่วยเสริมสร้างศักยภาพและเพิ่มประสิทธิภาพการทำงาน',
            footer_services: 'บริการของเรา',
            footer_contact: 'ติดต่อเรา',
            footer_all_rights: 'สงวนลิขสิทธิ์ทั้งหมด',
        },
        en: { 
            footer_subscribe_title: 'Get Latest News & Articles',
            footer_all_rights: 'All rights reserved',
        }
    };
    return texts[lang][key] || texts['th'][key];
};
// ----------------------------------------------------


function HomeLandingContent({ onLoginClick }) { 
    const language = 'th';
    const theme = landingTheme; 

    return (
        <ThemeProvider theme={theme}>
            {/* Box หลัก: กำหนดสีพื้นหลัง #E0F7FA เต็มจอ */}
            <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}>
                
                {/* =================================================== */}
                {/* 1. Hero Section */}
                {/* =================================================== */}
                
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: { xs: '60px 20px', md: '80px 20px' },
                        background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`, 
                        color: 'white', 
                    }}
                >
                    <Container maxWidth="lg" sx={{ p: 0 }}>
                        <img 
                            src={FileFlowz} 
                            alt="FileFlowz Logo" 
                            style={{ 
                                width: '150px', 
                                height: '150px',
                                borderRadius: '20px', 
                                marginBottom: '0px', 
                            }}
                        />
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ mb: 0, fontWeight: 800, color: 'white' }} 
                        >
                            แพลตฟอร์มภาพ & วิดีโอ สำหรับองค์กรที่มั่นใจ
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ mb: 3, maxWidth: '700px', color: 'rgba(255, 255, 255, 0.9)', mx: 'auto' }} 
                        >
                            จัดเก็บ แปลง ปรับ และส่งมอบสื่อของคุณอย่างรวดเร็ว ด้วย API, SDK และระบบอัตโนมัติ
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large" 
                            color="secondary" 
                            sx={{ 
                                backgroundColor: theme.palette.secondary.main, 
                                color: theme.palette.text.primary, 
                                fontWeight: 700, 
                                padding: '0.8rem 2rem', 
                                '&:hover': { backgroundColor: theme.palette.secondary.light } 
                            }}
                            onClick={onLoginClick} 
                        >
                            ดูรายละเอียดเพิ่มเติม
                        </Button>
                    </Container>
                </Box>

                {/* --- */}

                {/* =================================================== */}
                {/* 2. ส่วน Features */}
                {/* =================================================== */}

                <Container maxWidth="lg" sx={{ py: 8 }}>
                    
                    <Typography variant="h4" component="h2" align="center" sx={{ mb: 5, fontWeight: 700, color: theme.palette.primary.main }}>
                        ความสามารถหลัก
                    </Typography>
                    
                    <Grid container spacing={4} justifyContent="center" >
                        {[
                            { title: 'API ภาพ', desc: 'เพิ่มภาพบนเว็บไซต์หรือแอปในไม่กี่นาที', icon: ApiImage, isFullImage: true },
                            { title: 'API วิดีโอ', desc: 'เพิ่มวิดีโอพร้อมระบบแปลงและส่งแบบเรียลไทม์', icon: ApiVideo, isFullImage: true },
                            { title: 'จัดการสื่อ (DAM)', desc: 'ไลบรารีสื่อเต็มรูปแบบ พร้อมการแท็กอัตโนมัติและควบคุมสิทธิ์', icon: Rightsimage, isFullImage: true },
                            
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                                <Paper 
                                    elevation={3} 
                                    sx={{ 
                                        padding: item.isFullImage ? 2 : 4, 
                                        textAlign: 'center', 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        transition: 'transform 0.3s', 
                                        '&:hover': { transform: 'translateY(-5px)', elevation: 6 },
                                        ...(item.isFullImage && {
                                            aspectRatio: '16/9', 
                                            maxHeight: { xs: 200, md: 300 }, 
                                        })
                                    }}
                                >
                                    {item.isFullImage ? (
                                        <img 
                                            src={item.icon} 
                                            alt={item.title} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain', 
                                                display: 'block',
                                                borderRadius: '4px', 
                                            }} 
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* --- */}

                {/* =================================================== */}
                {/* 3. CTA Footer (Call to Action - นำกลับมา) */}
                {/* =================================================== */} 
                <Box 
                    className="cta-footer" 
                    sx={{ 
                        padding: 8, 
                        backgroundColor: theme.palette.primary.dark, // ⭐️ พื้นหลังสีน้ำเงินเข้ม
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
                            color: theme.palette.text.primary, 
                            fontWeight: 700, 
                            '&:hover': { backgroundColor: theme.palette.warning.light } 
                        }}
                        onClick={onLoginClick} 
                    >
                        เริ่มต้นใช้งานวันนี้!
                    </Button>
                </Box>
                
        
                <Box component="footer" sx={{ background: fileFlowColors.footer_bg, color: 'white', padding: 6 }}>
                    <Container maxWidth="lg">
                        
                        {/* 4.1: ส่วนสมัครรับข่าวสาร */}
                        <Grid container spacing={4} alignItems="flex-start" sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>{getText(language, 'footer_subscribe_title')}</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {getText(language, 'footer_subscribe_desc')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 1.5 }}> 
                                    <TextField
                                        label={getText(language, 'footer_email_label')}
                                        variant="filled"
                                        fullWidth
                                        InputProps={{ style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                                        InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                                        sx={{ 
                                            '& .MuiFilledInput-underline:before': { borderBottomColor: 'rgba(255, 255, 255, 0.4)' },
                                            '& .MuiFilledInput-underline:after': { borderBottomColor: theme.palette.secondary.main },
                                        }}
                                    />
                                    <Button 
                                        variant="text" 
                                        sx={{ 
                                            color: theme.palette.secondary.main, 
                                            fontWeight: 700, 
                                            whiteSpace: 'nowrap',
                                            '&:hover': { color: theme.palette.secondary.light }
                                        }}
                                        endIcon={<ArrowRightIcon />}
                                    >
                                        {getText(language, 'footer_subscribe_button')}
                                    </Button>
                                </Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                                    {getText(language, 'footer_privacy_note')}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4, background: 'rgba(255, 255, 255, 0.2)' }} />

                        {/* 4.2: ส่วนหลัก (Logo, Services, Contact) */}
                        <Grid container spacing={4}>
                            {/* Logo/Description */}
                            <Grid item xs={12} md={5}> 
                                <Typography variant="h6" sx={{ color: fileFlowColors.accent.main, mb: 1.5 }}>HAPPY SOFT</Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {getText(language, 'footer_expert_desc')}
                                </Typography>
                            </Grid>
                            
                            {/* Services */}
                            <Grid item xs={6} md={3}> 
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>{getText(language, 'footer_services')}</Typography>
                                <List dense sx={{ p: 0 }}>
                                    {['รับพัฒนาซอฟต์แวร์', 'ระบบบริหารจัดการสมาชิก', 'โซลูชันบ้านและธุรกิจอัจฉริยะ', 'บริการฝึกอบรมเฉพาะทาง', 'การตลาดออนไลน์'].map((item) => (
                                        <ListItem key={item} sx={{ p: 0, minHeight: 25 }}>
                                            <ListItemIcon sx={{ minWidth: 28 }}><ArrowRightIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} /></ListItemIcon>
                                            <ListItemText primary={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{item}</Typography>} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>

                            {/* Contact Info */}
                            <Grid item xs={12} md={4}> 
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>{getText(language, 'footer_contact')}</Typography>
                                <List dense sx={{ p: 0 }}>
                                    <ListItem sx={{ p: 0, minHeight: 25, mb: 1 }}><ListItemIcon sx={{ minWidth: 30 }}><LocationOn sx={{ fontSize: 18, color: theme.palette.secondary.light }} /></ListItemIcon><ListItemText primary={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>69 ม.18 ต.หนองโก อ.กระนวน จ.ขอนแก่น 40170</Typography>} /></ListItem>
                                    <ListItem sx={{ p: 0, minHeight: 25, mb: 1 }}><ListItemIcon sx={{ minWidth: 30 }}><Phone sx={{ fontSize: 18, color: theme.palette.secondary.light }} /></ListItemIcon><ListItemText primary={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>082-898-9932</Typography>} /></ListItem>
                                    <ListItem sx={{ p: 0, minHeight: 25, mb: 2 }}><ListItemIcon sx={{ minWidth: 30 }}><Mail sx={{ fontSize: 18, color: theme.palette.secondary.light }} /></ListItemIcon><ListItemText primary={<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>happysoftth@gmail.com</Typography>} /></ListItem>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        sx={{ 
                                            color: theme.palette.secondary.light, 
                                            borderColor: theme.palette.secondary.light,
                                            fontWeight: 600, 
                                            '&:hover': { borderColor: theme.palette.secondary.light, background: 'rgba(76, 175, 80, 0.1)' }
                                        }}
                                    >
                                        {getText(language, 'footer_contact')}
                                    </Button>
                                </List>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3, background: 'rgba(255, 255, 255, 0.2)' }} />

                        {/* 4.3: Sub-Footer */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', mb: { xs: 1, md: 0 } }}>
                                © 2025 Happy Soft. {getText(language, 'footer_all_rights')}
                            </Typography>
                            <Box>
                                {/* ลิงก์เสริมด้านล่าง */}
                                {[{th: 'เงื่อนไขการใช้งาน'}, {th: 'นโยบายความเป็นส่วนตัว'}, {th: 'นโยบายคุกกี้'}, {th: 'แผนผังเว็บไซต์'}].map((link, index) => (
                                    <MuiLink 
                                        href="#" 
                                        key={link.th} 
                                        sx={{ 
                                            color: 'rgba(255, 255, 255, 0.5)', 
                                            fontSize: '0.8rem', 
                                            textDecoration: 'none', 
                                            mx: 1, 
                                            '&:hover': { color: 'white', textDecoration: 'underline' } 
                                        }}
                                    >
                                        {link.th}
                                    </MuiLink>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>
        
                <Box component="footer" sx={{ background: '#222', color: '#ccc', padding: 6, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>เกี่ยวกับเรา</Button>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>บริการ</Button>
                        <Button color="inherit" sx={{ mx: 1, color: '#ccc', fontSize: '0.9rem' }}>นโยบาย</Button>
                    </Box>
                    <Divider sx={{ my: 3, background: '#444', maxWidth: '400px', margin: '0 auto 20px' }} /> 
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#777' }}>
                        © {new Date().getFullYear()}  Happy Soft. สงวนลิขสิทธิ์ทั้งหมด
                    </Typography>
                </Box>
                
            </Box> 
        </ThemeProvider>
    );
}

export default HomeLandingContent;