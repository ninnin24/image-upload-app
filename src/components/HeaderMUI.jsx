// HeaderMUI.js
import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const NO_HEADER_PATHS = ['/login', '/register', '/forgot-password'];
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" },
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    accent: { main: "#FF7F50", light: "#FFB092" },
    text: { primary: "#003F5C" },
    background: { default: "#E0F7FA" },
};

const theme = createTheme({
    typography: { fontFamily: ['Sarabun', 'sans-serif'].join(',') },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary },
    },
    // ✅ เพิ่ม mixins.toolbar เพื่อให้ UserDashboard อ้างอิงความสูง Header ได้ง่าย
    mixins: {
        toolbar: {
            minHeight: 64, // ค่าเริ่มต้นสำหรับ xs
            '@media (min-width:600px)': {
                minHeight: 72, // ค่าเริ่มต้นสำหรับ md
            },
        },
    },
});

function HeaderMUI({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    if (NO_HEADER_PATHS.includes(location.pathname)) {
        return null;
    }

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
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px'
                }
            }
        };
        const menuItems = !user
            ? [
                { to: homePath, label: "หน้าหลัก" },
                { href: "#products", label: "ผลิตภัณฑ์" },
                { href: "#pricing", "label": "ราคา" },
                { to: "/contact", label: "ติดต่อเรา" },
                { to: "/about", label: "เกี่ยวกับเรา" }
            ]
            : isAdmin
                ? [
                    { to: "/admin/dashboard", label: "แดชบอร์ดผู้ดูแลระบบ" },
                    { to: "/admin/users", label: "จัดการผู้ใช้" },
                    { to: "/admin/files", label: "จัดการไฟล์" },

                ]
                : [
                    { to: "/user/dashboard", label: "หน้าหลัก" },
                    { to: "/upload", label: "อัปโหลดไฟล์" },
                    { to: "/my-list", label: "รายการของฉัน" },
                    { to: "/contact", label: "ติดต่อเรา" }
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
                position="fixed" // ⚡️⚡️⚡️ เปลี่ยนเป็น "fixed" ที่นี่ ⚡️⚡️⚡️
                elevation={0}
                sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, #004060 100%)`,
                    color: 'white',
                    zIndex: 1100,
                    padding: 0,
                    // ✅ ลบ position: 'relative' ออก
                    // ✅ ไม่ต้องกำหนด height ตรงนี้โดยตรงแล้ว เพราะ Toolbar จะกำหนด minHeight ให้
                }}
            >
                <Toolbar disableGutters sx={{
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    width: '100%',
                    // minHeight ถูกกำหนดใน theme.mixins.toolbar แล้ว
                    boxShadow: 'none',
                    // ✅ ลบ position: 'relative' ออกจาก Toolbar ด้วย
                }}>

                    {/* 1. Logo Area - ข้อความ FileFlowz */}
                    <Box
                        onClick={() => navigate(homePath)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.3s',
                            padding: { xs: '0 16px', md: '0 2rem' }
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.secondary.light,
                                lineHeight: 1,
                                fontSize: '1.5rem',
                                '&:hover': {
                                    color: theme.palette.secondary.main,
                                }
                            }}
                        >
                            FileFlowz
                        </Typography>
                    </Box>

                    {/* 2. Navigation Menu และ User Actions */}
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: { xs: '0 16px', md: '0 2rem 0 0' }
                    }}>

                        {/* 🚀 Navigation Menu: จัดให้อยู่กึ่งกลางของพื้นที่ว่างที่เหลือ */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexGrow: 1,
                            justifyContent: 'center',
                        }}>
                            {renderMenu()}
                        </Box>

                        {/* User Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {user ? (
                                <>
                                    <Typography sx={{ color: theme.palette.secondary.light, fontWeight: 600 }}>
                                        👋 {user.username || 'ผู้ใช้'}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={onLogout}
                                        sx={{
                                            fontWeight: 700,
                                            color: 'white',
                                            borderRadius: '10px',
                                            padding: '0.6rem 1.25rem',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': { backgroundColor: theme.palette.warning.light, transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)' }
                                        }}
                                    >
                                        ออกจากระบบ
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        borderRadius: '10px',
                                        padding: '0.6rem 1.25rem',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': { backgroundColor: theme.palette.secondary.light, transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)' }
                                    }}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default HeaderMUI;