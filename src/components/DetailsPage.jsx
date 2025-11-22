// src/pages/DetailsPage.jsx (โค้ดสำหรับหน้ารายละเอียด)

import * as React from 'react';
import { Typography, Box, Container, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';

// 🎨 Theme Colors (ใช้สีเดิมจาก Header)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" }, 
    secondary: { dark: "#2CA3A3", main: "#40E0D0", light: "#AEEEEE" },
    text: { primary: "#003F5C" }, 
};

function DetailsPage() {
    return (
        <Box sx={{ py: 8, px: 2, minHeight: '100vh', background: 'white' }}>
            <Container maxWidth="md">
                
                <Typography 
                    variant="h3" 
                    component="h1" 
                    align="center"
                    sx={{ mb: 2, fontWeight: 800, color: fileFlowColors.primary.dark }}
                >
                    รายละเอียดแพลตฟอร์ม FileFlowz
                </Typography>

                <Typography 
                    variant="h6" 
                    align="center"
                    color="textSecondary"
                    sx={{ mb: 5, color: fileFlowColors.text.primary }}
                >
                    FileFlowz คือระบบจัดการสื่อดิจิทัล (DAM) และ Content Delivery Network (CDN) แบบครบวงจร ที่ออกแบบมาสำหรับองค์กรที่ต้องการความรวดเร็วและความปลอดภัยสูงสุดในการจัดการภาพและวิดีโอ
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700, color: fileFlowColors.primary.main }}>
                        <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> การจัดการสินทรัพย์ (DAM)
                    </Typography>
                    <List>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="จัดเก็บข้อมูลขนาดใหญ่ด้วยพื้นที่ Cloud ที่ยืดหยุ่น" /></ListItem>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="ค้นหาสื่อได้ง่ายด้วยการแท็กอัตโนมัติ (AI Tagging)" /></ListItem>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="ควบคุมสิทธิ์การเข้าถึงและใช้งานสื่อตามบทบาทองค์กร" /></ListItem>
                    </List>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700, color: fileFlowColors.primary.main }}>
                        <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> API และการส่งมอบ
                    </Typography>
                    <List>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="Image & Video Transformation API: แปลงรูปแบบ, ปรับขนาด, คร็อปภาพแบบเรียลไทม์" /></ListItem>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="CDN Delivery: ส่งมอบไฟล์ที่ปรับแต่งแล้วผ่าน CDN ทั่วโลกด้วยความเร็วสูง" /></ListItem>
                        <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon><ListItemText primary="SDK สำหรับทุกภาษา: รองรับ React, Vue, Node.js, Python และอื่น ๆ" /></ListItem>
                    </List>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Typography variant="h5" sx={{ color: fileFlowColors.secondary.dark }}>
                        พร้อมเริ่มต้นใช้งานหรือยัง?
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default DetailsPage;