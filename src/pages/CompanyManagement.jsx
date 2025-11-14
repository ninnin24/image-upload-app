import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCompanyModal from "../components/AddCompanyModal";
import { 
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, useTheme, Snackbar, Dialog, 
    DialogTitle, DialogContent, DialogActions, Alert
} from "@mui/material";
import { Building, Trash2, Edit } from "lucide-react"; 

const bytesToMB = (bytes) => {
    if (bytes === 0) return 0;
    return (bytes / (1024 * 1024)); 
};

const CompanyManagement = () => {
    const theme = useTheme();
    const [companies, setCompanies] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);

    const handleCloseSnackbar = () => setSnackbarOpen(false);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get("/admin/companies", { withCredentials: true }); 
            setCompanies(res.data);
        } catch (err) {
            console.error("Error fetching companies:", err);
            setSnackbarMessage("ดึงข้อมูลบริษัทล้มเหลว");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleOpenDeleteDialog = (company) => {
        setCompanyToDelete(company);
        setDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setCompanyToDelete(null);
        setDeleteDialogOpen(false);
    };
    const handleDeleteConfirmed = async () => {
        if (!companyToDelete) return;
        const companyId = companyToDelete.id;
        const companyName = companyToDelete.name;

        handleCloseDeleteDialog();

        try {
            await axios.delete(`/admin/companies/${companyId}`, { withCredentials: true });
            setSnackbarMessage(`ลบ "${companyName}" สำเร็จ`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            fetchCompanies(); 
        } catch (err) {
            console.error('Error deleting company:', err);
            const message = err.response?.data?.message || "ลบบริษัทล้มเหลว (ต้องไม่มี User หรือ File ผูกอยู่)";
            setSnackbarMessage(message);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',             // ครอบเต็มหน้าจอแนวตั้ง
                width: '100%',                  // เต็มความกว้าง
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',           // กึ่งกลางแนวนอน
                justifyContent: 'flex-start',   // เริ่มจากบน (ถ้าต้องการกลางแนวตั้ง เปลี่ยนเป็น 'center')
                p: 3,
                boxSizing: 'border-box',
                backgroundColor: theme.palette.background.default,
            }}
        >
            {/* Header + Add Button */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    maxWidth: 1200,
                    mb: 3,
                    pb: 1,
                    borderBottom: `2px solid ${theme.palette.divider}`
                }}
            >
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: theme.palette.primary.dark 
                    }}
                >
                    <Building size={24} style={{ marginRight: theme.spacing(1) }} />
                    จัดการบริษัท
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowAddModal(true)}
                    sx={{ borderRadius: '8px', boxShadow: theme.shadows[4] }}
                >
                    + เพิ่มบริษัทใหม่
                </Button>
            </Box>

            {/* Add Company Modal */}
            {showAddModal && (
                <AddCompanyModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchCompanies}
                />
            )}

            {/* Table */}
            <Box sx={{ width: '100%', maxWidth: 1200 }}>
                {companies.length === 0 ? (
                    <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
                        ไม่พบบริษัทในระบบ
                    </Alert>
                ) : (
                    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px', overflowX: 'auto' }}>
                        <Table stickyHeader sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>ชื่อบริษัท</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>ผู้ใช้</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>ไฟล์</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>พื้นที่ใช้ไป (MB)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>พื้นที่คงเหลือ (MB)</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>วันที่สร้าง</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>การดำเนินการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.map((c) => {
                                    const quotaGB = c.storage_quota_gb?.Valid ? c.storage_quota_gb.Float64 : 0;
                                    const quotaMB = quotaGB * 1024; 
                                    const usedBytes = c.storage_used_bytes || 0;
                                    const usedMB = bytesToMB(usedBytes); 
                                    const remainingMB = quotaMB > 0 ? (quotaMB - usedMB) : 'N/A';
                                    const usedMB_Display = usedMB.toFixed(2); 
                                    const remainingMB_Display = (typeof remainingMB === 'number') ? remainingMB.toFixed(2) : remainingMB;
                                    const usagePercent = quotaMB > 0 ? (usedMB / quotaMB) * 100 : 0;
                                    let usageColor = theme.palette.success.main; 
                                    if (usagePercent >= 80) usageColor = theme.palette.warning.main; 
                                    if (usagePercent >= 95) usageColor = theme.palette.error.main; 

                                    return (
                                        <TableRow key={c.id} hover>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="subtitle1" fontWeight={600}>{c.name}</Typography>
                                            </TableCell>
                                            <TableCell align="center">{c.user_count}</TableCell>
                                            <TableCell align="center">{c.file_count}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: usageColor }}>
                                                {usedMB_Display}
                                            </TableCell>
                                            <TableCell align="right">{remainingMB_Display}</TableCell>
                                            <TableCell align="center">{new Date(c.created_at).toLocaleDateString('th-TH')}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" size="small" aria-label="แก้ไข" disabled>
                                                    <Edit size={20} />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    size="small" 
                                                    aria-label="ลบ"
                                                    onClick={() => handleOpenDeleteDialog(c)} 
                                                >
                                                    <Trash2 size={20} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle sx={{ color: theme.palette.error.main, fontWeight: 700 }}>
                    ยืนยันการลบบริษัท
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        คุณแน่ใจหรือไม่ว่าต้องการลบ "{companyToDelete?.name}"? 
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        (คำเตือน: การลบบริษัทจะทำได้ต่อเมื่อบริษัทนั้นไม่มีผู้ใช้หรือไฟล์ใดๆ ผูกอยู่)
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="outlined" color="primary">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleDeleteConfirmed} variant="contained" color="error" autoFocus>
                        ลบ
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CompanyManagement;
