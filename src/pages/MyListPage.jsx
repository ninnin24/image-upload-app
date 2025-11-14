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
} from '@mui/material';

import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function MyListPage({ user }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      axios.get('/user/files', { withCredentials: true })
        .then(res => {
          setFiles(res.data);
          setError(null);
        })
        .catch(() => {
          setFiles([]);
          setError("ไม่สามารถโหลดรายการไฟล์ได้ กรุณาลองใหม่อีกครั้ง");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

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


  const formatFileSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  const formatDate = (dateString) => new Date(dateString).toLocaleString('th-TH');


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>กำลังโหลดไฟล์...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          startIcon={<DeleteIcon />} // ⭐️ เพิ่ม Icon
        >
          ลบไฟล์ที่เลือก ({selectedFiles.size})
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
                      ขนาด: {formatFileSize(file.filesize_bytes)}
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