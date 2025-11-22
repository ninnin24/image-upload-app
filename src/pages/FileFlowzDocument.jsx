import * as React from 'react';
import { 
    Typography, 
    Box, 
    Container, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import StorageIcon from '@mui/icons-material/Storage';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DownloadIcon from '@mui/icons-material/Download';
import CodeIcon from '@mui/icons-material/Code';


// 🎨 File Flow Theme Colors 
const fileFlowColors = {
    primary: {
        dark: "#005377",
        main: "#00AEEF",
        light: "#87CEEB",
    }, 
    secondary: {
        dark: "#2CA3A3", 
        main: "#40E0D0",
        light: "#AEEEEE", 
    },
    accent: {
        main: "#FF7F50", // สีส้ม
    },
    background: {
        default: "#E0F7FA", // ฟ้าอ่อนมาก
        paper: "#FFFFFF",
    },
    text: {
        primary: "#003F5C", // น้ำเงินเข้มเกือบดำ
        secondary: "#007F91", // เขียวอมน้ำเงิน
        accent: "#FF7F50", 
    },
};

// ⚙️ Material UI Theme
const fileFlowTheme = createTheme({
    typography: { 
        fontFamily: ['Sarabun', 'sans-serif'].join(','),
        h2: { fontWeight: 700, color: fileFlowColors.text.primary, fontSize: '2rem', marginTop: '10px' }, 
        h3: { fontWeight: 700, color: fileFlowColors.primary.dark, fontSize: '1.5rem', borderBottom: `2px solid ${fileFlowColors.primary.light}`, paddingBottom: 5, marginTop: '20px' }, 
        h4: { fontWeight: 600, color: fileFlowColors.text.primary, fontSize: '1.2rem', marginTop: '15px' },
        body1: { lineHeight: 1.5, fontSize: '0.9rem' },
        subtitle1: { color: fileFlowColors.text.secondary, fontSize: '1rem', fontWeight: 600, mt: 1 }, // สำหรับหัวข้อย่อย
    },
    palette: {
        primary: { main: fileFlowColors.primary.main, light: fileFlowColors.primary.light, dark: fileFlowColors.primary.dark },
        secondary: { main: fileFlowColors.secondary.main, light: fileFlowColors.secondary.light, dark: fileFlowColors.secondary.dark }, 
        background: { default: fileFlowColors.background.default, paper: fileFlowColors.background.paper },
        text: { primary: fileFlowColors.text.primary, secondary: fileFlowColors.text.secondary } 
    },
    components: {
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: fileFlowColors.primary.light,
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: fileFlowColors.primary.dark,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                },
                body: {
                    color: fileFlowColors.text.primary,
                    borderBottom: `1px solid ${fileFlowColors.primary.light}`,
                    lineHeight: 1.5,
                    fontSize: '0.9rem',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // เพิ่มความโค้งมน
                }
            }
        }
    },
});

// 📌 Data (เดิม)
const roleData = [
    {
        role: "User (ผู้ใช้งานทั่วไป)",
        description: "- อัปโหลด/ดู/ดาวน์โหลด/ลบ ไฟล์ที่ตนเป็นเจ้าของ หรือไฟล์ที่ถูกแชร์มาให้เท่านั้น\n- ดูและแก้ไขข้อมูลส่วนตัวบางส่วน",
        access: "เข้าถึงข้อมูลเฉพาะของตนเองและบริษัทที่สังกัด ไม่เห็นข้อมูลบริษัทอื่น"
    }
];

const securityFeatures = [
    { 
        icon: LockOpenIcon,
        feature: "การล็อกอินและจัดการสิทธิ์", 
        mechanism: "ใช้ Session Token / JWT Token บันทึกใน Secure Cookie", 
        improvement: "2FA (Two-Factor Authentication): เพิ่มการยืนยันตัวตนสองขั้นตอน" 
    },
    { 
        icon: PolicyIcon,
        feature: "การควบคุมสิทธิ์ (Access Control)", 
        mechanism: "กำหนดสิทธิ์ตามบทบาท (Role-Based Access Control)", 
        improvement: "สิทธิ์ระดับโฟลเดอร์/กลุ่ม: User สามารถกำหนดสิทธิ์การเข้าถึงไฟล์/โฟลเดอร์ (Read-Only, Edit) ให้กับ User อื่นในบริษัทเดียวกันได้" 
    },
];

const fileManagementFeatures = [
    { 
        icon: StorageIcon,
        feature: "จัดเก็บไฟล์", 
        description: "User สามารถอัปโหลด, ดู, ดาวน์โหลด, และลบไฟล์ที่ตนเป็นเจ้าของ/มีสิทธิ์", 
        improvement: "File Versioning: เก็บไฟล์เวอร์ชันเก่าไว้โดยอัตโนมัติเมื่ออัปโหลดชื่อซ้ำ" 
    },
    { 
        icon: SearchIcon,
        feature: "การค้นหา", 
        description: "ค้นหาไฟล์จากชื่อไฟล์หรือ Metadata พื้นฐาน", 
        improvement: "Advanced Search: ค้นหาจาก เนื้อหาภายในไฟล์(Full-Text Search) และค้นหาตาม Metadata/แท็ก" 
    },
    { 
        icon: DeleteIcon,
        feature: "การกู้คืนไฟล์", 
        description: "การลบไฟล์ถาวรทันที", 
        improvement: "Recycle Bin: ไฟล์ที่ถูกลบจะถูกย้ายไปที่ถังขยะชั่วคราว พร้อมกำหนดอายุ (เช่น 30 วัน)" 
    },
];

// 📌 Data (เพิ่มเติมสำหรับ API Usage)
const apiEndpoints = [
    { 
        icon: LoginIcon,
        action: "Login / รับ Token", 
        method: "POST", 
        endpoint: "/auth/login", 
        note: "ใช้ username/password. Token ถูกส่งกลับใน Secure Cookie หรือ Response body" 
    },
    { 
        icon: CloudUploadIcon,
        action: "อัปโหลดไฟล์ใหม่", 
        method: "POST", 
        endpoint: "/api/v1/files", 
        note: "ใช้ `multipart/form-data`. รองรับ File Versioning อัตโนมัติ" 
    },
    { 
        icon: DownloadIcon,
        action: "ดาวน์โหลดไฟล์", 
        method: "GET", 
        endpoint: "/api/v1/files/{fileId}/download", 
        note: "ดึงเนื้อหาไฟล์ (Binary Data)" 
    },
    { 
        icon: PolicyIcon,
        action: "แชร์/กำหนดสิทธิ์", 
        method: "PATCH", 
        endpoint: "/api/v1/files/{fileId}/share", 
        note: "กำหนดสิทธิ์ (`read-only`, `edit`) ให้ User อื่นในบริษัท" 
    },
    { 
        icon: DeleteIcon,
        action: "ลบไฟล์ (ไปถังขยะ)", 
        method: "DELETE", 
        endpoint: "/api/v1/files/{fileId}", 
        note: "ใช้ Recycle Bin แทนการลบถาวรทันที" 
    },
    { 
        icon: RestorePageIcon,
        action: "กู้คืนจากถังขยะ", 
        method: "POST", 
        endpoint: "/api/v1/recycle-bin/{fileId}/restore", 
        note: "นำไฟล์กลับมาจาก Recycle Bin" 
    },
];

function FileFlowzDocument() {
    
    // Helper component สำหรับแสดงโค้ด
    const CodeBlock = ({ children, language = 'json' }) => (
        <Paper 
            elevation={0} 
            sx={{ 
                backgroundColor: '#003F5C', 
                color: 'white', 
                p: 1.5, 
                mt: 1, 
                mb: 2, 
                borderRadius: 1, 
                overflowX: 'auto', 
                borderLeft: `5px solid ${fileFlowColors.accent.main}`
            }}
        >
            <Typography component="pre" variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {children}
            </Typography>
        </Paper>
    );

    return (
        <ThemeProvider theme={fileFlowTheme}>
            
            <Box 
                sx={{ 
                    background: fileFlowTheme.palette.background.default, 
                    minHeight: '100vh', 
                    pt: 0.5, 
                    pb: 3 
                }}
            >

                <Container 
                    maxWidth="lg"
                    sx={{ mt: 0, pt: 0, pb: 0 }}
                >
                    
                    {/* Title Section */}
                    <Paper elevation={3} sx={{ 
                        p: { xs: 1.5, md: 2.5 }, 
                        mb: 3, 
                        background: `linear-gradient(135deg, ${fileFlowColors.primary.dark} 0%, #004060 100%)`, 
                        color: 'white',
                        borderLeft: `10px solid ${fileFlowColors.accent.main}`, 
                    }}>

                        <Typography 
                            variant="h2" 
                            component="h1" 
                            sx={{ color: 'white', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800 }}
                        >
                            FileFlowz: Programmable Media API
                        </Typography>
                        
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: 800 }}>
                            เอกสารนี้สรุปคุณสมบัติ API และ SDKs ที่ผู้ใช้งานทั่วไป (User) สามารถใช้ในการจัดการ, อัปโหลด อย่างปลอดภัย
                        </Typography>

                    </Paper>

                    {/* 1. Roles */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h3" component="h2">1. บทบาทผู้ใช้งาน (User Roles)</Typography>
                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />บทบาท</TableCell>
                                        <TableCell>คำอธิบายสิทธิ์</TableCell>
                                        <TableCell>สิทธิ์การเข้าถึงข้อมูล</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roleData.map((row) => (
                                        <TableRow key={row.role}>
                                            <TableCell sx={{ fontWeight: 700, color: fileFlowColors.accent.main }}>{row.role}</TableCell>
                                            <TableCell>
                                                <List dense disablePadding>
                                                    {row.description.split('\n').map((line, index) => (
                                                        <ListItem key={index} disableGutters sx={{ py: 0 }}>
                                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                                <CheckCircleOutlineIcon sx={{ fontSize: 16, color: fileFlowColors.secondary.main }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={line.replace(/^- /, '')} primaryTypographyProps={{ variant: 'body1' }} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </TableCell>
                                            <TableCell>{row.access}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* 2. Features */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h3" component="h2">2. คุณสมบัติหลักของระบบ (Core Features)</Typography>
                        <Divider sx={{ my: 2 }} />

                        {/* Security */}
                        <Typography variant="h4">2.1 การรักษาความปลอดภัยและการจัดการสิทธิ์</Typography>
                        <TableContainer sx={{ mt: 1.5 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '20%' }}><SecurityIcon sx={{ fontSize: 16, mr: 0.5 }} />คุณสมบัติ</TableCell>
                                        <TableCell sx={{ width: '40%' }}>กลไกการทำงานเดิม</TableCell>
                                        <TableCell sx={{ width: '40%', color: fileFlowColors.accent.main }}>ส่วนที่เพิ่ม/ปรับปรุง</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {securityFeatures.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <row.icon color="primary" sx={{ fontSize: 20 }} />
                                                    <Typography variant="body1" component="span">{row.feature}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.mechanism}</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: fileFlowColors.accent.main }}>{row.improvement}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* File Management */}
                        <Typography variant="h4" sx={{ mt: 3 }}>2.2 การจัดการไฟล์</Typography>
                        <TableContainer sx={{ mt: 1.5 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '20%' }}><StorageIcon sx={{ fontSize: 16, mr: 0.5 }} />คุณสมบัติ</TableCell>
                                        <TableCell sx={{ width: '40%' }}>คำอธิบายเดิม</TableCell>
                                        <TableCell sx={{ width: '40%', color: fileFlowColors.accent.main }}>ส่วนที่เพิ่ม/ปรับปรุง</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fileManagementFeatures.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <row.icon color="secondary" sx={{ fontSize: 20 }} />
                                                    <Typography variant="body1" component="span">{row.feature}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: fileFlowColors.accent.main }}>{row.improvement}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* 3. API Usage */}
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h3" component="h2">3. การใช้งาน RESTful API สำหรับ User</Typography>
                        {/* 🌟 แก้ไข: ใช้ &lt; และ &gt; แทน < และ > เพื่อไม่ให้ JSX เข้าใจผิดว่าเป็น Tag */}
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            FileFlowz API เป็นไปตามสถาปัตยกรรม REST โดยใช้ HTTP Methods มาตรฐาน และต้องแนบ JWT Token ใน Header `Authorization: Bearer &lt;Token&gt;` สำหรับ Protected Routes ทั้งหมด
                        </Typography>
                        
                        <TableContainer sx={{ mt: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><CodeIcon sx={{ fontSize: 16, mr: 0.5 }} />การดำเนินการ</TableCell>
                                        <TableCell>Method</TableCell>
                                        <TableCell>Endpoint (URI)</TableCell>
                                        <TableCell>หมายเหตุสำคัญ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {apiEndpoints.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <row.icon color="primary" sx={{ fontSize: 20 }} />
                                                    <Typography variant="body1" component="span">{row.action}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body1" 
                                                    component="span" 
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        color: row.method === 'POST' || row.method === 'PATCH' ? fileFlowColors.secondary.dark : (row.method === 'GET' ? fileFlowColors.primary.dark : fileFlowColors.accent.main)
                                                    }}
                                                >
                                                    {row.method}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.endpoint}</TableCell>
                                            <TableCell>{row.note}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{ my: 3 }} />

                        {/* API Example */}
                        <Typography variant="h4">3.1 ตัวอย่างการใช้งาน API: การอัปโหลดไฟล์</Typography>
                        <Typography variant="body1">
                            การอัปโหลดไฟล์ใหม่โดยใช้ POST และ `multipart/form-data`:
                        </Typography>
                        <CodeBlock language="bash">
{`# 1. Login (สมมติว่าได้รับ Token มาแล้ว)
# 2. Upload File (ใช้ Token ใน Authorization Header)
curl -X POST "https://api.fileflowz.com/api/v1/files" \\
     -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
     -F "file=@/path/to/your/report.pdf"`}
                        </CodeBlock>
                        <Typography variant="body1">
                            ตัวอย่าง Response (201 Created):
                        </Typography>
                        <CodeBlock language="json">
{`{
  "message": "File uploaded successfully.",
  "fileId": "f-1A2B3C",
  "fileName": "report.pdf",
  "version": 1,
  "uploadedAt": "2025-11-21T07:30:00Z"
}`}
                        </CodeBlock>
                    </Paper>
                    
                    <Divider sx={{ my: 5 }} />

                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default FileFlowzDocument;