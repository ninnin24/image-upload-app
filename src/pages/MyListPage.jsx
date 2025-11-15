import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Checkbox, 
  IconButton, 
  Alert,
  Tooltip,
  useTheme,
  // ✅ เพิ่ม Components สำหรับ Filter
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField
} from '@mui/material';

import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
// ✅ นำ DateRangeIcon กลับมาใช้ใน TextField เพื่อแก้ warning
import DateRangeIcon from '@mui/icons-material/DateRange'; 

function MyListPage({ user }) {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  
  // 🚀 State สำหรับการ Filter
  const [fileType, setFileType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const effectiveHeaderHeight = theme.spacing(10); 
  
  // -------------------- Data Fetching --------------------

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      axios.get('/user/files', { withCredentials: true })
        .then(res => {
          const processedFiles = res.data.map(file => ({
            ...file,
            size: file.filesize_bytes || file.size || 0 
          }));
          setFiles(processedFiles);
          setError(null);
        })
        .catch(() => {
          setFiles([]);
          setError("ไม่สามารถโหลดรายการไฟล์ได้ กรุณาลองใหม่อีกครั้ง");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // -------------------- Handlers --------------------

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId);
      } else {
        newSelected.add(fileId);
      }
      return newSelected;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedFiles.size} ไฟล์ที่เลือก?`)) {
      try {
        await axios.post('/files/delete-multiple', 
          { ids: [...selectedFiles] },
          { withCredentials: true }
        );

        alert(`ลบไฟล์ที่เลือกจำนวน ${selectedFiles.size} ไฟล์สำเร็จ`);

        setFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        setSelectedFiles(new Set());
        
      } catch (err) {
        console.error("Delete failed:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์");
      }
    }
  };

  const handleResetFilter = () => {
    setFileType('all');
    setStartDate('');
    setEndDate('');
    // 💡 ในการใช้งานจริง, คุณต้องเรียกฟังก์ชัน fetchFiles(resetParams) ที่นี่
    alert('ทำการรีเซ็ตตัวกรองแล้ว');
  };

  // -------------------- Formatters --------------------

  const formatFileSize = (bytes) => {
    if (typeof bytes !== 'number' || bytes < 0) return 'N/A';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }
  const formatDate = (dateString) => new Date(dateString).toLocaleString('th-TH');


  // -------------------- Render Logic --------------------

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ 
          textAlign: 'center', 
          py: 5,
          paddingTop: effectiveHeaderHeight 
      }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>กำลังโหลดไฟล์...</Typography>
      </Container>
    );
  }
  
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        paddingTop: effectiveHeaderHeight,
        mt: 4, 
        mb: 4 
      }}
    >
      {/* 1. Header และปุ่มลบไฟล์ */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <FolderIcon color="primary" sx={{ mr: 1, fontSize: '1.2em' }} /> ไฟล์ของฉัน
        </Typography>

        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDeleteSelected}
          disabled={selectedFiles.size === 0}
          startIcon={<DeleteIcon />} 
        >
          ลบไฟล์ที่เลือก ({selectedFiles.size})
        </Button>
      </Box>
      
      {/* 2. Filter / Search Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          p: 2, 
          mb: 4, 
          bgcolor: theme.palette.primary.light, 
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        {/* 2.1. Dropdown ประเภทบริษัท/ไฟล์ */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="file-type-label">ประเภทไฟล์</InputLabel>
          <Select
            labelId="file-type-label"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            label="ประเภทไฟล์"
            sx={{ bgcolor: 'white' }}
          >
            <MenuItem value="all">
              <em>ทั้งหมด</em>
            </MenuItem>
            <MenuItem value="doc">เอกสาร</MenuItem>
            <MenuItem value="image">รูปภาพ</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="other">อื่นๆ</MenuItem>
          </Select>
        </FormControl>
        
        {/* 2.2. วันที่เริ่มต้น */}
        <TextField
          label="วัน/เดือน/ปี เริ่มต้น"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: 'white' }}
          // ใช้งาน DateRangeIcon 
          InputProps={{
              startAdornment: <DateRangeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          }}
        />

        {/* 2.3. วันที่สิ้นสุด */}
        <TextField
          label="วัน/เดือน/ปี สิ้นสุด"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: 'white' }}
          // ใช้งาน DateRangeIcon
          InputProps={{
              startAdornment: <DateRangeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          }}
        />
        
        {/* 2.4. ปุ่ม "รีเซ็ต/ค้นหา" */}
        <Button 
          variant="contained" 
          onClick={handleResetFilter} 
          sx={{ height: '40px' }} 
        >
          รีเซ็ต
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {files.length === 0 ? (

        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          คุณยังไม่มีไฟล์ในระบบ
        </Typography>
      ) : (
      
        <List sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1, boxShadow: 1 }}>
          {files.map(file => (
          
            <ListItem 
              key={file.id} 
              secondaryAction={
              
                <Tooltip title="ดูไฟล์">
                  <IconButton 
                    edge="end" 
                    aria-label="view"
                    href={`http://172.18.20.45:8080/files/download?id=${file.id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              }
              divider 
              sx={{ '&:hover': { bgcolor: 'action.hover' } }}
            >
              
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedFiles.has(file.id)}
                  tabIndex={-1}
                  disableRipple
                  onChange={() => handleSelectFile(file.id)}
                  color="primary"
                />
              </ListItemIcon>
            
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {file.filename}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                    <Typography component="span" variant="caption" color="text.secondary">
                      อัปโหลด: {formatDate(file.uploaded_at)}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      ขนาด: {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default MyListPage;