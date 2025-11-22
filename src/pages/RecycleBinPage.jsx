import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Grid, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    LinearProgress
} from '@mui/material';
import { 
    Restore as RestoreIcon, 
    DeleteForever as DeleteForeverIcon, 
    RestoreFromTrash as RecycleBinIcon,
    FilePresent as FileIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 🎨 Theme and Colors (Hardcoded for component independence)
const fileFlowColors = {
    primary: { dark: "#005377", main: "#00AEEF", light: "#87CEEB" },
    secondary: { main: "#40E0D0" },
    accent: { main: "#FF7F50" },
    background: { default: "#E0F7FA", paper: "#FFFFFF" },
    text: { primary: "#003F5C", secondary: "#007F91" },
};

const fileFlowTheme = createTheme({
    typography: { 
        fontFamily: 'Sarabun, sans-serif',
    },
    palette: {
        primary: { main: fileFlowColors.primary.main, dark: fileFlowColors.primary.dark },
        secondary: { main: fileFlowColors.secondary.main },
        warning: { main: fileFlowColors.accent.main },
        background: { default: fileFlowColors.background.default, paper: fileFlowColors.background.paper },
        text: { primary: fileFlowColors.text.primary },
    },
});

// 📌 ข้อมูลจำลองสำหรับตารางถังขยะ
const deletedFiles = [
    { id: 1, name: 'Project_Proposal_v3.pdf', type: 'PDF', deletedBy: 'Jane Doe', deletedDate: '2025-11-15', daysLeft: 7 },
    { id: 2, name: 'Marketing_Visual.png', type: 'PNG', deletedBy: 'John Smith', deletedDate: '2025-11-18', daysLeft: 4 },
    { id: 3, name: 'Old_Report_Q1.xlsx', type: 'XLSX', deletedBy: 'Jane Doe', deletedDate: '2025-11-10', daysLeft: 12 },
];

function RecycleBinPage() {
    const theme = fileFlowTheme;
    
    // ฟังก์ชันจำลองสำหรับการจัดการไฟล์
    const handleRestore = (id) => {
        console.log(`Restoring file ${id}`);
        // Logic สำหรับเรียก API กู้คืนไฟล์
    };

    const handleDelete = (id) => {
        console.log(`Permanently deleting file ${id}`);
        // Logic สำหรับเรียก API ลบถาวร
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 5, py: 5 }}>

                {/* 1. Header/Title Section (Clean, Professional Style) */}
                <Box 
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        borderLeft: `8px solid ${fileFlowColors.accent.main}`, // สีส้ม Accent
                        backgroundColor: theme.palette.background.paper, 
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700, 
                            color: theme.palette.primary.dark, 
                            fontSize: '1.8rem' 
                        }}
                    >
                        <RecycleBinIcon sx={{ fontSize: '1.8rem', verticalAlign: 'middle', mr: 1, color: theme.palette.warning.main }} /> 
                        ถังขยะ (Recycle Bin)
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1.5, color: theme.palette.text.secondary }}>
                        หน้านี้สำหรับจัดการไฟล์ที่ถูกลบชั่วคราว ไฟล์จะถูกลบถาวรโดยอัตโนมัติเมื่อครบ 30 วัน
                    </Typography>
                </Box>

                {/* 2. Quick Actions / Summary */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${fileFlowColors.secondary.main}` }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: fileFlowColors.secondary.main }}>3</Typography>
                            <Typography variant="caption" color="text.secondary">ไฟล์ทั้งหมดในถังขยะ</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>ความจุถังขยะที่ใช้ไป</Typography>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={15} 
                                    sx={{ 
                                        height: 10, 
                                        borderRadius: 5, 
                                        backgroundColor: theme.palette.primary.light, 
                                        '& .MuiLinearProgress-bar': { backgroundColor: fileFlowColors.accent.main } 
                                    }} 
                                />
                                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                                    1.5 GB / 10 GB
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            color="error" 
                            startIcon={<DeleteForeverIcon />}
                            sx={{ height: '100%', fontWeight: 700, borderColor: theme.palette.warning.main, color: theme.palette.warning.main }}
                            onClick={() => console.log('Confirm Permanent Delete All')}
                        >
                            ลบทั้งหมดถาวร
                        </Button>
                    </Grid>
                </Grid>

                {/* 3. File List Table */}
                <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.dark, fontWeight: 700 }}>รายการไฟล์ที่ถูกลบ</Typography>
                <TableContainer component={Paper} elevation={2}>
                    <Table size="medium">
                        <TableHead sx={{ backgroundColor: fileFlowColors.primary.light }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>ชื่อไฟล์</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>ถูกลบโดย</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>วันที่ถูกลบ</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>เหลือเวลา (วัน)</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark, textAlign: 'center' }}>ดำเนินการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deletedFiles.map((file) => (
                                <TableRow key={file.id} hover>
                                    <TableCell sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                        <FileIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                        {file.name}
                                    </TableCell>
                                    <TableCell>{file.deletedBy}</TableCell>
                                    <TableCell>{file.deletedDate}</TableCell>
                                    <TableCell>
                                        <Box sx={{ color: file.daysLeft < 5 ? fileFlowColors.accent.main : fileFlowColors.text.primary, fontWeight: 700 }}>
                                            {file.daysLeft} วัน
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            color="secondary" 
                                            startIcon={<RestoreIcon />}
                                            onClick={() => handleRestore(file.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            กู้คืน
                                        </Button>
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => handleDelete(file.id)}
                                        >
                                            ลบถาวร
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
            </Container>
        </ThemeProvider>
    );
}

export default RecycleBinPage;