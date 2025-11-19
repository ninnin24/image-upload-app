import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Link as MuiLink, 
    Paper,
    Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// ⚠️ ต้องแน่ใจว่า HappySoftLogo ถูกนำเข้าอย่างถูกต้อง
// import HappySoftLogo from '../assets/fileflowz2.png'; 
// ถ้าคุณใช้โลโก้เป็น URL หรือ Component สามารถปรับตรงส่วน <img /> ได้เลย
const HappySoftLogo = "https://via.placeholder.com/150x50?text=HappySoft+Logo"; // Placeholder

/**
 * คอมโพเนนต์สำหรับหน้า 'ลืมรหัสผ่าน' (Forgot Password) ที่ใช้ Material UI
 */
function ForgotPasswordPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ⭐️ ใช้ useTheme ถ้าต้องการดึงสีจาก Theme ภายนอก 
    // ถ้าโค้ดนี้ถูกครอบด้วย <ThemeProvider theme={happySoftTheme}> อยู่แล้ว
    // เราสามารถใช้ palette.primary.main ได้โดยตรงผ่าน sx prop
    
    /**
     * จัดการการส่งฟอร์มเพื่อส่งคำขอรีเซ็ตรหัสผ่าน
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!usernameOrEmail) {
            setError("กรุณากรอกชื่อผู้ใช้หรืออีเมลที่ลงทะเบียนไว้");
            return;
        }

        try {
            // สมมติว่ามี API call สำหรับ forgot-password
            const response = await fetch(`/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(
                    `สำเร็จ! กรุณาตรวจสอบอีเมล ${usernameOrEmail} เพื่อทำตามขั้นตอนการรีเซ็ตรหัสผ่าน`
                );
                // อาจหน่วงเวลาแล้ว redirect
                // setTimeout(() => navigate('/login'), 5000);
            } else {
                setError(data.message || 'ไม่สามารถดำเนินการได้: โปรดตรวจสอบชื่อผู้ใช้/อีเมลอีกครั้ง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server: ไม่สามารถส่งคำขอได้');
        }
    };

    return (
        <Box 
            sx={{ 
                // จัดกึ่งกลางหน้าจอแบบเต็มความสูง
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'background.default', // ใช้สีพื้นหลังของ Theme
                padding: 3
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        padding: { xs: 3, md: 5 }, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        borderRadius: 2 
                    }}
                >
                    {/* 1. Logo */}
                    <Box sx={{ mb: 3 }}>
                        <img 
                            src={HappySoftLogo} 
                            alt="HappySoft Logo" 
                            style={{ maxWidth: '180px', height: 'auto' }} 
                        />
                    </Box>

                    {/* 2. Header */}
                    <Typography 
                        component="h1" 
                        variant="h5" 
                        sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}
                    >
                        ลืมรหัสผ่าน
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        align="center" 
                        sx={{ mb: 3 }}
                    >
                        กรุณากรอกชื่อผู้ใช้หรืออีเมล เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้คุณ
                    </Typography>

                    {/* 3. Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="usernameOrEmail"
                            label="ชื่อผู้ใช้/อีเมล"
                            name="usernameOrEmail"
                            autoComplete="email"
                            autoFocus
                            value={usernameOrEmail}
                            onChange={e => setUsernameOrEmail(e.target.value)}
                            // ใช้สี accent_orange เป็น border/focus color
                            color="primary" 
                        />

                        {/* 4. Error/Success Messages */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                                {error}
                            </Alert>
                        )}
                        {message && (
                            <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
                                {message}
                            </Alert>
                        )}

                        {/* 5. Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!!message}
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                fontWeight: 700,
                                // ใช้สีหลักของ Theme (น้ำเงินเข้ม)
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            ส่งคำขอรีเซ็ตรหัสผ่าน
                        </Button>
                        
                        {/* 6. Back to Login Link */}
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <MuiLink 
                                component="button" 
                                variant="body2" 
                                onClick={() => navigate('/login')}
                                sx={{ color: 'text.secondary', textDecoration: 'none' }}
                            >
                                <ArrowBackIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> 
                                ย้อนกลับไปหน้าเข้าสู่ระบบ
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}


export default ForgotPasswordPage;