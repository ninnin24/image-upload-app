import * as React from 'react';
import { Typography, Button, Box, Container, Grid, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import HappySoftLogo from '../assets/fileflowz2.png'; 

const theme = createTheme({
  typography: {
    fontFamily: ['Sarabun', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#00d4ff',
    },
    warning: { 
      main: '#ffc107',
    }
  },
});

function HomeLandingContent({ onLoginClick }) { 
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: '#f9f9f9', minHeight: '100vh' }}>
        
        {/* =================================================== */}
        {/* 1. Hero Section - โลโก้, หัวข้อ, และปุ่ม CTA */}
        {/* =================================================== */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: { xs: '80px 20px', md: '120px 20px' },
            background: 'linear-gradient(90deg, #007bff 0%, #00d4ff 100%)',
            color: 'white',
          }}
        >
            {/* ⚠️ โลโก้ใน Hero ถูกลบออกเพื่อให้โลโก้ใน Header หลักเด่นขึ้น */}

          <Typography variant="h3" component="h1" sx={{ mb: 3, fontWeight: 800 }}>
            แพลตฟอร์มภาพ & วิดีโอ สำหรับองค์กรที่มั่นใจ
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '700px' }}>
            จัดเก็บ แปลง ปรับ และส่งมอบสื่อของคุณอย่างรวดเร็ว ด้วย API, SDK และระบบอัตโนมัติ
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ backgroundColor: 'white', color: '#007bff', fontWeight: 700, '&:hover': { backgroundColor: '#f0f0f0' } }}
            onClick={onLoginClick} 
          >
            ดูรายละเอียดเพิ่มเติม
          </Button>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          
          {/* =================================================== */}
          {/* 3. Features (Grid Layout) - แก้ไข Parsing Error */}
          {/* =================================================== */}
          <Typography variant="h4" component="h2" align="center" sx={{ mb: 5, fontWeight: 700, color: '#007bff' }}>
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
            <Paper elevation={4} sx={{ maxWidth: '800px', margin: '0 auto', padding: 4, fontStyle: 'italic', backgroundColor: '#f0f8ff' }}>
              <Typography variant="h6" color="textPrimary">
                "ระบบของเราเร็วขึ้นอย่างมีนัยสำคัญ ใช้งานง่ายกว่าเดิมมาก"
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: '#007bff' }}>
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
            backgroundColor: '#0056b3',
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
            sx={{ color: '#333', fontWeight: 700, '&:hover': { backgroundColor: '#e0a800' } }}
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