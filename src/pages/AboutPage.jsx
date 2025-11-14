import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText,  } from '@mui/material';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';

// 🎨 FileFlow Theme Colors (นำมาจาก Theme กลาง)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" }, 
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    accent: { main: "#FF7F50", light: "#FFB092" },
    text: { primary: "#003F5C", secondary: "#007F91" }, 
    background: { default: "#E0F7FA", paper: "#AEEEEE" },
};

// ⚙️ กำหนด Theme (ต้องสร้าง Theme ใหม่ในไฟล์นี้เพื่อให้ useTheme ดึงค่าได้)
const aboutTheme = createTheme({
    typography: { fontFamily: ['Sarabun', 'sans-serif'].join(',') },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark, light: fileFlowColors.primary.light },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light },
        warning: { main: fileFlowColors.accent.main, light: fileFlowColors.accent.light },
        text: { primary: fileFlowColors.text.primary, secondary: fileFlowColors.text.secondary },
        background: { default: fileFlowColors.background.default, paper: fileFlowColors.background.paper },
    },
});


// Sub Component สำหรับ Timeline Item (ใช้สีจาก Theme)
const TimelineItem = ({ year, text, theme }) => (
    <Box sx={{ position: 'relative', pb: 4 }}>
        <Box 
            sx={{
                position: 'absolute',
                left: '-32px',
                top: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: theme.palette.secondary.main,
                border: `3px solid ${theme.palette.primary.light}`,
            }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.dark, mb: 0.5 }}>
            {year}:
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
            {text}
        </Typography>
    </Box>
);


function AboutPage({ user, onLogout }) { 
    // ⚠️ ใช้ useTheme() ภายใน ThemeProvider ที่หุ้ม Component นี้
  return (
    <ThemeProvider theme={aboutTheme}>
        <PageContent user={user} onLogout={onLogout} />
    </ThemeProvider>
  );
}

// แยก Content ออกมาเพื่อใช้ useTheme() ได้อย่างถูกต้อง
const PageContent = ({ user, onLogout }) => {
    const theme = useTheme();

    return (
        <Box sx={{ background: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh', paddingTop: '1px' }}>
            
            {/* Hero Section - จัดสไตล์ตามธีม FileFlow */}
            <Box 
                sx={{
                    // ✅ ใช้สี Primary Main (#00AEEF)
                    background: theme.palette.primary.main,
                    color: 'white',
                    textAlign: 'center',
                    padding: { xs: '60px 20px', md: '80px 20px' },
                    boxShadow: 3
                }}
            >
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    เกี่ยวกับ Happy Soft
                </Typography>
                <Typography variant="h6">
                    ผู้นำด้านนวัตกรรมเทคโนโลยีที่มุ่งมั่นพัฒนาโซลูชันเพื่อขับเคลื่อนธุรกิจไทย
                </Typography>
            </Box>

            {/* Content Section */}
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* วิสัยทัศน์ */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 2 }}>
                        วิสัยทัศน์
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.primary }}>
                        เป็นผู้นำในการสร้างสรรค์โซลูชันเทคโนโลยีที่ชาญฉลาดและสร้างผลกระทบเชิงบวกที่ยั่งยืนให้กับธุรกิจและสังคมในประเทศไทยและภูมิภาค
                    </Typography>
                </Box>

                {/* พันธกิจ */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 2 }}>
                        พันธกิจ
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.primary }}>
                        เป็นพันธมิตรทางเทคโนโลยีที่เชื่อถือได้และสร้างสรรค์ (Trusted & Innovative Technology Partner)
                        สำหรับธุรกิจทุกขนาด
                    </Typography>
                </Box>

                {/* ค่านิยมหลัก (Core Values) - ใช้ List Item ที่มี Border Accent */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 2 }}>
                        ค่านิยมหลัก (Core Values)
                    </Typography>
                    <List sx={{ p: 0 }}>
                        <ListItem disablePadding sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.secondary.main}`, pl: 2, backgroundColor: theme.palette.background.paper, borderRadius: '4px' }}>
                            <ListItemText primary="มุ่งเน้นลูกค้าเป็นศูนย์กลาง (Customer-Centricity)" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.secondary.main}`, pl: 2, backgroundColor: theme.palette.background.paper, borderRadius: '4px' }}>
                            <ListItemText primary="ขับเคลื่อนด้วยนวัตกรรมและความเป็นเลิศ (Innovation & Excellence)" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.secondary.main}`, pl: 2, backgroundColor: theme.palette.background.paper, borderRadius: '4px' }}>
                            <ListItemText primary="ซื่อสัตย์และโปร่งใสในทุกขั้นตอน (Integrity & Transparency)" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.secondary.main}`, pl: 2, backgroundColor: theme.palette.background.paper, borderRadius: '4px' }}>
                            <ListItemText primary="พลังแห่งการทำงานเป็นทีมและความร่วมมือ (Teamwork & Collaboration)" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                        <ListItem disablePadding sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.secondary.main}`, pl: 2, backgroundColor: theme.palette.background.paper, borderRadius: '4px' }}>
                            <ListItemText primary="ความรับผิดชอบและพัฒนาอย่างไม่หยุดยั้ง (Accountability & Continuous Growth)" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                    </List>
                </Box>
                
                {/* เส้นทางของเรา (Timeline) */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 3 }}>
                        เส้นทางของเรา
                    </Typography>
                    <Box className="timeline" sx={{ borderLeft: `3px solid ${theme.palette.secondary.main}`, pl: 3 }}>
                        {/* Timeline Items */}
                        <TimelineItem year="2023" text="ก่อตั้ง Happy Soft และเริ่มพัฒนาโซลูชันซอฟต์แวร์" theme={theme} />
                        <TimelineItem year="ปลายปี 2023" text="เปิดตัวระบบสมาชิกออนไลน์" theme={theme} />
                        <TimelineItem year="2024" text="ขยายทีมและบริการ Smart Solution" theme={theme} />
                        <TimelineItem year="ปลายปี 2024" text="เปิดบริการฝึกอบรมเฉพาะทาง" theme={theme} />
                        <TimelineItem year="2025" text="เสริมทัพบริการการตลาดออนไลน์ครบวงจร" theme={theme} />
                    </Box>
                </Box>

            </Container>

            {/* Footer Placeholder */}
            <Box component="footer" sx={{ background: theme.palette.primary.dark, color: theme.palette.secondary.light, textAlign: 'center', py: 4, mt: 4 }}>
                <Typography variant="subtitle1">
                    ร่วมเป็นส่วนหนึ่งของการเดินทางสู่ความสำเร็จกับ Happy Soft
                </Typography>
            </Box>
        </Box>
    );
};

export default AboutPage;