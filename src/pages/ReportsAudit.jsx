import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
// *** ลบการนำเข้าไฟล์ CSS เดิมออก เพราะจะใช้สไตล์ของ MUI แทน
// import '../styles/ReportsAudit.css'; 

// 🚀 นำเข้าคอมโพเนนต์หลักจาก Material-UI
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Alert,
} from '@mui/material';

// 🔍 นำเข้าไอคอนใหม่จาก MUI Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';

function ReportsAudit() {
  const [reportData, setReportData] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [searchReport, setSearchReport] = useState('');
  const [searchLogs, setSearchLogs] = useState('');
  const [error, setError] = useState(null); // สถานะสำหรับจัดการข้อผิดพลาด

  const API_BASE_URL = 'http://172.18.20.45:8080/admin';

  // 1. ฟังก์ชันดึงข้อมูลหลัก (General fetch function)
  // ใช้ useCallback เพื่อทำให้ฟังก์ชัน fetchData มีความเสถียร
  const fetchData = useCallback(async (endpoint, setter, errorMessage) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${endpoint}`, {
        withCredentials: true,
      });
      setter(res.data);
      setError(null); // เคลียร์ข้อผิดพลาดเมื่อสำเร็จ
    } catch (err) {
      console.error(errorMessage, err);
      // ตั้งค่าข้อความข้อผิดพลาดที่ผู้ใช้มองเห็นได้
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: โปรดตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์'); 
    }
  }, []); // ไม่มี dependencies ภายในเพราะใช้ค่าคงที่

  // 2. ฟังก์ชันดึงรายงาน (Reports fetch function)
  // ใช้ useCallback และระบุ fetchData และ setter เป็น dependency
  const fetchReports = useCallback(() => 
    fetchData('report-summary', setReportData, 'โหลดรายงานล้มเหลว:')
  , [fetchData, setReportData]); // dependency array เพื่อป้องกัน ESLint warning

  // 3. ฟังก์ชันดึง Logs (User Logs fetch function)
  // ใช้ useCallback และระบุ fetchData และ setter เป็น dependency
  const fetchUserLogs = useCallback(() => 
    fetchData('user-logs', setUserLogs, 'โหลดประวัติผู้ใช้ล้มเหลว:')
  , [fetchData, setUserLogs]); // dependency array เพื่อป้องกัน ESLint warning


  // 4. useEffect สำหรับการดึงข้อมูลเริ่มต้น
  // ✅ แก้ไข ESLint warning โดยการรวม fetchReports และ fetchUserLogs ใน dependency array
  useEffect(() => {
    fetchReports();
    fetchUserLogs();
  }, [fetchReports, fetchUserLogs]); // <<-- แก้ไขแล้ว

  // ฟังก์ชันสำหรับ Export
  const exportToExcel = () => {
    window.location.href = `${API_BASE_URL}/export/excel`;
  };

  const exportToPDF = () => {
    window.location.href = `${API_BASE_URL}/export/pdf`;
  };

  // ✅ ฟิลเตอร์ข้อมูลรายงาน
  const filteredReports = reportData.filter(item =>
    item.company_name.toLowerCase().includes(searchReport.toLowerCase())
  );

  // ✅ ฟิลเตอร์ข้อมูล log
  const filteredLogs = userLogs.filter(
    log =>
      log.username.toLowerCase().includes(searchLogs.toLowerCase()) ||
      log.filename.toLowerCase().includes(searchLogs.toLowerCase())
  );

  return (
    // ใช้ Container เพื่อกำหนดขอบเขตและจัดกึ่งกลางเนื้อหา
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <AssessmentIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          รายงานและการตรวจสอบไฟล์
        </Typography>
      </Box>

      {/* แสดง Error Alert หากมีข้อผิดพลาด */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* -------------------- รายงานสรุป -------------------- */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              รายงานสรุปจำนวนไฟล์ต่อบริษัท
            </Typography>

            {/* 🔍 ช่องค้นหารายงาน */}
            <TextField
              fullWidth
              label="ค้นหาชื่อบริษัท..."
              variant="outlined"
              value={searchReport}
              onChange={e => setSearchReport(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />

            {/* ตารางรายงาน */}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ชื่อบริษัท</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>จำนวนไฟล์ทั้งหมด</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>อัปโหลดล่าสุด</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.company_name}</TableCell>
                        <TableCell align="right">{item.total_files}</TableCell>
                        <TableCell>{new Date(item.last_upload).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>
                        ไม่พบข้อมูลบริษัท
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* -------------------- ประวัติการกระทำของผู้ใช้ -------------------- */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              ประวัติการกระทำของผู้ใช้
            </Typography>

            {/* 🔍 ช่องค้นหา Log */}
            <TextField
              fullWidth
              label="ค้นหาชื่อผู้ใช้หรือชื่อไฟล์..."
              variant="outlined"
              value={searchLogs}
              onChange={e => setSearchLogs(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />

            {/* ตาราง Log */}
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'secondary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ชื่อผู้ใช้</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>การกระทำ</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ชื่อไฟล์</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>วันที่</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{log.username}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.filename}</TableCell>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>
                        ไม่พบข้อมูลการกระทำของผู้ใช้
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* -------------------- ปุ่มส่งออก (Export Buttons) -------------------- */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          color="success"
          onClick={exportToExcel}
          startIcon={<FileDownloadIcon />}
        >
          ดาวน์โหลด Excel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={exportToPDF}
          startIcon={<FileDownloadIcon />}
        >
          ดาวน์โหลด PDF
        </Button>
      </Box>
    </Container>
  );
}

export default ReportsAudit;