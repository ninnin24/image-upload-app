import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Mock Data
const mockFiles = [
  { id: 1, name: 'Project Plan.pdf', size: 9.5 * 1024 * 1024, date: '15 พ.ย. 2568, 15:00' },
  { id: 2, name: 'Client Report.docx', size: 5.2 * 1024 * 1024, date: '15 พ.ย. 2568, 10:30' },
  { id: 3, name: 'Design Mockup.zip', size: 78.2 * 1024 * 1024, date: '14 พ.ย. 2568, 16:15' },
];

const mockActivities = [
  { id: 1, action: 'อัปโหลด', file: 'Project Plan.pdf', time: '15 พ.ย. 2568, 15:00', color: '#4CAF50' },
  { id: 2, action: 'ดาวน์โหลด', file: 'Client Report.docx', time: '15 พ.ย. 2568, 10:30', color: '#2196F3' },
];

// File Preview Modal
const FilePreviewModal = ({ open, onClose, file }) => {
  if (!file) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="bold">{file.name}</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <FolderOpenIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6">{file.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {(file.size / 1024 / 1024).toFixed(1)} MB • อัปโหลดเมื่อ {file.date}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined">ดาวน์โหลด</Button>
        <Button variant="contained" color="primary">เปิดไฟล์</Button>
      </DialogActions>
    </Dialog>
  );
};

function UserDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // ปิดการเลื่อนเฉพาะหน้านี้
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const storage = {
    used: 99.3,
    total: 1024,
    remaining: 1024 - 99.3,
    percentage: 10,
  };

  const pieData = [
    { name: 'ใช้แล้ว', value: storage.used },
    { name: 'เหลือ', value: storage.remaining },
  ];
  const COLORS = ['#1E88E5', '#E3F2FD'];

  const openFile = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const goToMyList = () => navigate('/my-list');
  
  // แก้ไข: ลบเครื่องหมาย ** ที่ทำให้เกิด Syntax Error
  const goToUpgrade = () => navigate('/pricing'); 

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        p: { xs: 2, md: 4 },
        overflow: 'hidden',
        background: '#f8fafc',
      }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 5,
          p: { xs: 3, md: 4 },
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, textAlign: 'center' }}>
          ไฟล์ล่าสุด
        </Typography>

        <Grid container spacing={4} sx={{ flex: 1 }}>
          
          {/* LEFT PIE CHART */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 280, position: 'relative' }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius="65%"
                    outerRadius="85%"
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h3" fontWeight="900" color="primary">
                  {storage.percentage}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ใช้งานแล้ว
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  <FiberManualRecordIcon sx={{ color: '#1E88E5', fontSize: 14, mr: 0.5 }} /> ใช้แล้ว
                </Typography>
                <Typography fontWeight="bold">{storage.used} MB</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">
                  <FiberManualRecordIcon sx={{ color: '#E3F2FD', fontSize: 14, mr: 0.5 }} /> เหลือ
                </Typography>
                <Typography fontWeight="bold">{storage.remaining} MB</Typography>
              </Box>
            </Box>

            {/* ปุ่มอัปเกรดพื้นที่ เชื่อมต่อกับ goToUpgrade */}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3, py: 1.8, borderRadius: 4, fontSize: '1.1rem' }}
              onClick={goToUpgrade}
            >
              อัปเกรดพื้นที่
            </Button>
          </Grid>

          {/* RIGHT SECTION */}
          <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            
            {/* FILE LIST */}
            <Box sx={{ mb: 4, flexGrow: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">ไฟล์ล่าสุด</Typography>

                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  onClick={goToMyList}
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  ดูทั้งหมด
                </Button>
              </Box>

              <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                <Grid container spacing={2}>
                  {mockFiles.map((file) => (
                    <Grid item xs={12} key={file.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: '0.2s',
                          '&:hover': {
                            boxShadow: 6,
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => openFile(file)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={600} noWrap>{file.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file.size / 1024 / 1024).toFixed(1)} MB • {file.date}
                            </Typography>
                          </Box>

                          <Tooltip title="เปิดไฟล์">
                            <IconButton size="small" color="primary">
                              <FolderOpenIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* ACTIVITY LOG */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}> 

              {/* หัวข้อ + ปุ่มดูทั้งหมด */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">ประวัติการใช้งาน</Typography>
                </Box>

                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                  onClick={() => navigate('/activity')}
                >
                  ดูทั้งหมด
                </Button>
              </Box>

              <Box sx={{ maxHeight: '100%', overflowY: 'auto', pr: 1 }}>
                {mockActivities.map((act) => (
                  <Box
                    key={act.id}
                    sx={{
                      p: 1.5,
                      borderLeft: `4px solid ${act.color}`,
                      bgcolor: '#fafafa',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} color={act.color}>
                      {act.action}
                    </Typography>
                    <Typography variant="body2" noWrap>{act.file}</Typography>
                    <Typography variant="caption" color="text.secondary">{act.time}</Typography>
                  </Box>
                ))}

                {/* เพิ่มรายการตัวอย่างให้เกิด scroll */}
                {mockActivities.map((act, index) => (
                  <Box
                    key={`extra-${index}`}
                    sx={{
                      p: 1.5,
                      borderLeft: `4px solid ${act.color}`,
                      bgcolor: '#fafafa',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} color={act.color}>
                      กิจกรรมเสริม: {act.action}
                    </Typography>
                    <Typography variant="body2" noWrap>{act.file}</Typography>
                    <Typography variant="caption" color="text.secondary">{act.time}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

          </Grid>
        </Grid>
      </Card>

      <FilePreviewModal open={modalOpen} onClose={() => setModalOpen(false)} file={selectedFile} />
    </Box>
  );
}

export default UserDashboard;