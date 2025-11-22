import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    Link as MuiLink,
    IconButton,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Language as LanguageIcon, RestoreFromTrash } from '@mui/icons-material';

import FileFlowzLogo from '../assets/logo_ff.png';


const getText = (lang, key) => {
    const texts = {
        th: {
            language_button: 'EN / English',
            logout: 'ออกจากระบบ',
            login: 'เข้าสู่ระบบ',
            user_default: 'ผู้ใช้',
            // Menu Items TH
            home: 'หน้าหลัก',
            price: 'ราคา',
            contact: 'ติดต่อเรา',
            about: 'เกี่ยวกับเรา',
            dashboard: 'แดชบอร์ด',
            upload: 'อัปโหลดไฟล์',
            mylist: 'รายการของฉัน',
            activity: 'ประวัติการใช้งาน',
            docs: 'เอกสาร', 
            recycle_bin: 'ถังขยะ',
        },
        en: {
            language_button: 'TH / ภาษาไทย',
            logout: 'Logout',
            login: 'Login',
            user_default: 'User',
            // Menu Items EN
            home: 'Home',
            price: 'Pricing',
            contact: 'Contact Us',
            about: 'About Us',
            dashboard: 'Dashboard',
            upload: 'Upload File',
            mylist: 'My List',
            activity: 'Activity History',
            docs: 'Documentation',
            recycle_bin: 'Recycle Bin',
        }
    };
    return texts[lang][key] || texts['th'][key];
};

const fileFlowColors = {
    primary: { dark: '#005377', main: '#00AEEF', light: '#87CEEB' },
    secondary: { dark: '#2CA3A3', main: '#40E0D0', light: '#AEEEEE' },
    accent: { main: '#FF7F50', light: '#FFB092' },
    text: { primary: '#003F5C' },
};

const theme = createTheme({
    typography: { fontFamily: ['Sarabun', 'sans-serif'].join(',') },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary },
    },
    mixins: {
        toolbar: { minHeight: 64, '@media (min-width:600px)': { minHeight: 72 } },
    },
});

function HeaderMUI({ user, onLogout, language, setLanguage }) { 
    const navigate = useNavigate();
    
    const [localLanguage, setLocalLanguage] = React.useState(language || 'th');
    const currentLang = language || localLanguage;
    const currentSetLanguage = setLanguage || setLocalLanguage;


    const isAdmin = user?.role === 'admin';
    const homePath = isAdmin ? '/admin/dashboard' : user ? '/user/dashboard' : '/';

    const handleLanguageToggle = () => {
        currentSetLanguage(prevLang => (prevLang === 'th' ? 'en' : 'th'));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        if (onLogout) onLogout();

        navigate('/'); 
    };

    const renderMenu = () => {
        const baseProps = {
            sx: {
                color: 'white',
                // ⬇️ [แก้ไข] ลดขนาดตัวอักษรลง
                fontWeight: 500, // ลดความหนาของฟอนต์
                fontSize: '0.9rem', // ลดขนาดฟอนต์ให้เล็กลง
                padding: '0.5rem 0.75rem', // ลด padding ให้กระชับ
                whiteSpace: 'nowrap', // ⭐️ [แก้ไข] บังคับให้เป็นบรรทัดเดียว
                '&:hover': {
                    color: theme.palette.secondary.light,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                },
            },
        };

        // ⭐️ เมนูที่แสดงผล (แบบข้อความ)
        const menuItems = !user
            ? [
                { to: '/', labelKey: 'home' },
                { to: '/pricing', labelKey: 'price' },
                { to: '/docs', labelKey: 'docs' },
                { to: '/contact', labelKey: 'contact' },
                { to: '/about', labelKey: 'about' },
            ]
            : isAdmin
            ? [
                { to: '/admin/dashboard', labelKey: 'dashboard' },

            ]
            : [
                { to: '/user/dashboard', labelKey: 'home' },
                { to: '/upload', labelKey: 'upload' },
                { to: '/my-list', labelKey: 'mylist' },
                { to: '/activity', labelKey: 'activity' },
            ];

        return (
            // ปรับ Box ให้มี Gap น้อยลงเพื่อประหยัดพื้นที่
            <Box sx={{ display: 'flex', gap: 0.5 }}> 
                {menuItems.map((item, index) => (
                    <Button
                        key={index}
                        {...baseProps}
                        component={item.to ? Link : MuiLink}
                        to={item.to}
                        href={item.href}
                    >
                        {getText(currentLang, item.labelKey)} 
                    </Button>
                ))}
            </Box>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, #004060 100%)`,
                    color: 'white',
                    zIndex: 1100,
                }}
            >
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
                    
                    {/* Logo */}
                    <Box
                        onClick={() => navigate(homePath)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            '&:hover': { opacity: 0.9 },
                        }}
                    >
                        <img
                            src={FileFlowzLogo}
                            alt="FileFlowz Logo"
                            style={{
                                height: '44px',
                                width: 'auto',
                                marginRight: '0px',
                                flexShrink: 0,
                                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.6))',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: 'white',
                                fontSize: { xs: '1.45rem', sm: '1.6rem' },
                                letterSpacing: '0.5px',
                            }}
                        >
                            FileFlowz
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
                        {renderMenu()}
                    </Box>

                    {/* ปุ่มขวา: Language Toggle + User Info/Login Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        {/* ⭐️ ICON: ปุ่มถังขยะ (Recycle Bin) - แสดงเมื่อ User Logged in ⭐️ */}
                        {user && (
                            <IconButton 
                                onClick={() => navigate('/recycle-bin')} 
                                sx={{ 
                                    color: fileFlowColors.accent.light, // ใช้สีส้มอ่อน
                                    '&:hover': { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } 
                                }}
                                size="large"
                                aria-label={getText(currentLang, 'recycle_bin')} 
                            >
                                <RestoreFromTrash sx={{ fontSize: '1.6rem' }} />
                            </IconButton>
                        )}
                        
                        {/* ⭐️ ปุ่มเปลี่ยนภาษา ⭐️ */}
                        <Button
                            variant="text"
                            size="small"
                            onClick={handleLanguageToggle}
                            startIcon={<LanguageIcon sx={{ fontSize: '1.2rem' }} />}
                            sx={{
                                color: theme.palette.secondary.light, // สีอ่อนๆ เพื่อให้เห็นชัดบนพื้นหลังเข้ม
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                padding: '0.5rem 0.75rem',
                                minWidth: 'unset',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                }
                            }}
                        >
                            {getText(currentLang, 'language_button')}
                        </Button>

                        {/* User Info/Login/Logout Button */}
                        {user ? (
                            <>
                                <Typography sx={{ color: theme.palette.secondary.light, fontWeight: 600, fontSize: '1.1rem' }}>
                                    {user.username || getText(currentLang, 'user_default')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={handleLogout} 
                                    sx={{ fontWeight: 700, color: 'white', borderRadius: '10px', padding: '0.6rem 1.25rem' }}
                                >
                                    {getText(currentLang, 'logout')}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 700, color: theme.palette.text.primary, borderRadius: '10px', padding: '0.6rem 1.25rem' }}
                            >
                                {getText(currentLang, 'login')}
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default HeaderMUI;