import React, { useState } from "react";
// ✅ นำเข้า Components ของ MUI และ Link จาก MUI (ชื่อ MuiLink)
import { Box, Typography, TextField, Button, Container, MenuItem, Select, FormControl, InputLabel, Link as MuiLink } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

// 🎨 FileFlow Theme Colors (นำมาไว้ในไฟล์เพื่อกำหนด Theme)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" }, 
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    accent: { main: "#FF7F50", light: "#FFB092" },
    text: { primary: "#003F5C", secondary: "#007F91" }, 
    background: { default: "#E0F7FA", paper: "#FFFFFF" },
};

// ⚙️ กำหนด Theme สำหรับ Material UI
const contactTheme = createTheme({
    typography: { fontFamily: ['Sarabun', 'sans-serif'].join(',') },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark, light: fileFlowColors.primary.light },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary, secondary: fileFlowColors.text.secondary },
        background: { default: fileFlowColors.background.default, paper: fileFlowColors.background.paper },
    },
});


const ContactPageContent = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    topic: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("ส่งข้อมูลสำเร็จ! ขอบคุณที่ติดต่อเรา ❤️");
    // รีเซ็ตฟอร์ม
    setFormData({
        firstName: "", lastName: "", company: "", email: "", phone: "", country: "", topic: "", message: "",
    });
  };

  const inputStyle = { mb: 3, width: '100%' };

  return (
    <Container maxWidth="md" sx={{ py: 6, backgroundColor: theme.palette.background.default }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.dark, mb: 1 }}>
                ติดต่อเรา
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '600px', mx: 'auto' }}>
                หากคุณต้องการสอบถามข้อมูลเพิ่มเติม โปรดกรอกแบบฟอร์มด้านล่าง หรือ{" "}
                <MuiLink 
                    href="mailto:support@fileflowz.com" 
                    sx={{ color: theme.palette.secondary.dark, fontWeight: 600 }}
                >
                    ส่งอีเมลถึงทีมสนับสนุน
                </MuiLink>
            </Typography>
        </Box>

        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
                p: { xs: 2, md: 4 }, 
                backgroundColor: theme.palette.background.paper, 
                borderRadius: 2, 
                boxShadow: 4 
            }}
        >
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                
                {/* คอลัมน์ซ้าย: ชื่อ, นามสกุล, บริษัท, อีเมล */}
                <Box sx={{ flex: 1 }}>
                    <TextField
                        name="firstName"
                        label="ชื่อ"
                        placeholder="ชื่อ *"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={inputStyle}
                        variant="outlined"
                    />
                    <FormControl fullWidth sx={inputStyle} required>
                        <InputLabel id="country-label">ประเทศ *</InputLabel>
                        <Select
                            labelId="country-label"
                            name="country"
                            value={formData.country}
                            label="ประเทศ *"
                            onChange={handleChange}
                        >
                            <MenuItem value="">--เลือกประเทศ--</MenuItem>
                            <MenuItem value="ไทย">ไทย</MenuItem>
                            <MenuItem value="ลาว">ลาว</MenuItem>
                            <MenuItem value="เวียดนาม">เวียดนาม</MenuItem>
                            <MenuItem value="สิงคโปร์">สิงคโปร์</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        name="lastName"
                        label="นามสกุล"
                        placeholder="นามสกุล *"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={inputStyle}
                        variant="outlined"
                    />
                    <FormControl fullWidth sx={inputStyle} required>
                        <InputLabel id="topic-label">หัวข้อที่ต้องการติดต่อ *</InputLabel>
                        <Select
                            labelId="topic-label"
                            name="topic"
                            value={formData.topic}
                            label="หัวข้อที่ต้องการติดต่อ *"
                            onChange={handleChange}
                        >
                            <MenuItem value="">--เลือกหัวข้อ--</MenuItem>
                            <MenuItem value="ฝ่ายขาย">ฝ่ายขาย</MenuItem>
                            <MenuItem value="ฝ่ายเทคนิค">ฝ่ายเทคนิค</MenuItem>
                            <MenuItem value="ฝ่ายบัญชี">ฝ่ายบัญชี</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                
                {/* คอลัมน์ขวา: เบอร์โทรศัพท์, ข้อความ */}
                <Box sx={{ flex: 1 }}>
                    <TextField
                        name="company"
                        label="ชื่อบริษัท"
                        placeholder="ชื่อบริษัท *"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={inputStyle}
                        variant="outlined"
                    />
                    <TextField
                        type="email"
                        name="email"
                        label="อีเมลธุรกิจ"
                        placeholder="อีเมลธุรกิจ *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        sx={inputStyle}
                        variant="outlined"
                    />
                    <TextField
                        type="tel"
                        name="phone"
                        label="เบอร์โทรศัพท์"
                        placeholder="เบอร์โทรศัพท์"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        sx={inputStyle}
                        variant="outlined"
                    />
                    <TextField
                        name="message"
                        label="ข้อความที่ต้องการติดต่อ *"
                        placeholder="ข้อความที่ต้องการติดต่อ *"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />
                </Box>
            </Box>

            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                    mt: 2, 
                    py: 1.5, 
                    backgroundColor: theme.palette.primary.main, 
                    fontWeight: 700,
                    boxShadow: '0 4px 10px rgba(0, 83, 119, 0.3)', 
                    '&:hover': { backgroundColor: theme.palette.primary.dark } 
                }}
            >
                ส่งข้อความ
            </Button>
            
            <Typography variant="caption" display="block" align="center" sx={{ mt: 3, color: theme.palette.text.secondary }}>
                เว็บไซต์นี้ได้รับการคุ้มครองโดยนโยบายความเป็นส่วนตัวและเงื่อนไขการใช้บริการของเรา
            </Typography>
        </Box>
    </Container>
  );
};

// Component หลักที่ส่งออก
const ContactPage = () => (
    <ThemeProvider theme={contactTheme}>
        <ContactPageContent />
    </ThemeProvider>
);

export default ContactPage;