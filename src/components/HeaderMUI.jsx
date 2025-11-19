import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    Link as MuiLink,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import FileFlowzLogo from '../assets/logo_ff.png';

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

function HeaderMUI({ user, onLogout }) {
    const navigate = useNavigate();

    const isAdmin = user?.role === 'admin';
    const homePath = isAdmin ? '/admin/dashboard' : user ? '/user/dashboard' : '/';

    const renderMenu = () => {
        const baseProps = {
            sx: {
                color: 'white',
                fontWeight: 600,
                fontSize: '1.05rem',
                padding: '0.8rem 1rem',
                '&:hover': {
                    color: theme.palette.secondary.light,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                },
            },
        };

        const menuItems = !user
            ? [
                { to: '/', label: 'หน้าหลัก' },
                { to: '/pricing', label: 'ราคา' }, // ✅ Public
                { to: '/contact', label: 'ติดต่อเรา' },
                { to: '/about', label: 'เกี่ยวกับเรา' },
            ]
            : isAdmin
            ? [
                { to: '/admin/dashboard', label: 'แดชบอร์ด' },
                { to: '/pricing', label: 'ราคา' }, // ✅ Admin
                { to: '/contact', label: 'ติดต่อเรา' },
            ] 
            : [
                { to: '/user/dashboard', label: 'หน้าหลัก' },
                { to: '/upload', label: 'อัปโหลดไฟล์' },
                { to: '/my-list', label: 'รายการของฉัน' },
                { to: '/pricing', label: 'ราคา' }, // ✅ Logged-in User
                { to: '/activity', label: 'ประวัติการใช้งาน' },
                { to: '/contact', label: 'ติดต่อเรา' },
            ];

        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item, index) => (
                    <Button
                        key={index}
                        {...baseProps}
                        component={item.to ? Link : MuiLink} 
                        to={item.to}
                        href={item.href}
                    >
                        {item.label}
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
                    {/* Logo + ชื่อแบรนด์ */}
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

                    {/* ปุ่มขวา */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <Typography sx={{ color: theme.palette.secondary.light, fontWeight: 600, fontSize: '1.1rem' }}>
                                    {user.username || 'ผู้ใช้'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={onLogout}
                                    sx={{ fontWeight: 700, color: 'white', borderRadius: '10px', padding: '0.6rem 1.25rem' }}
                                >
                                    ออกจากระบบ
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 700, color: theme.palette.text.primary, borderRadius: '10px', padding: '0.6rem 1.25rem' }}
                            >
                                เข้าสู่ระบบ
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}
    
export default HeaderMUI;