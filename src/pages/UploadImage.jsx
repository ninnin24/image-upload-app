import React, { useState, useRef } from 'react';
import axios from 'axios';
// แก้ไข: ลบ IconButton ออก เพราะไม่ได้ใช้
import { Box, Typography, Button, Container } from '@mui/material'; 
import { useTheme } from '@mui/material/styles';
import { FaFileUpload } from 'react-icons/fa'; 
import { MdClear } from 'react-icons/md'; 

function UploadImage({ user }) {
    const theme = useTheme(); 
    const [files, setFiles] = useState([]); 
    const [isDragging, setIsDragging] = useState(false); 
    const fileInputRef = useRef(null); 

    const handleUpload = async () => {
        if (files.length === 0) return alert('กรุณาเลือกไฟล์ก่อน!'); 
        
        const formData = new FormData();
        for (const file of files) {
            formData.append('file', file); 
        }

        try {
            const res = await axios.post('/upload', formData, { 
                withCredentials: true,
            });
            
            alert(res.data.message || 'อัปโหลดสำเร็จ!'); 
            setFiles([]); 
            fileInputRef.current.value = null;
        } catch (e) {
            alert('อัปโหลดล้มเหลว');
        }
    };
    
    // ฟังก์ชันสำหรับยกเลิกไฟล์ทั้งหมด
    const handleClearFiles = () => {
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    // --- ส่วนจัดการ Drag-and-Drop ---
    const handleDragOver = (e) => e.preventDefault();
    const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            setFiles([...droppedFiles]); 
        }
    };

    // --- ส่วนจัดการ Input ---
    const handleFileSelect = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            setFiles([...selectedFiles]); 
        }
    };

    const onDropZoneClick = () => {
        fileInputRef.current.value = null; 
        fileInputRef.current.click();
    };

    // --- ฟังก์ชันช่วยแสดงรายชื่อไฟล์ ---
    const renderFileNames = () => {
        if (files.length === 0) {
            // UI เริ่มต้น
            return (
                <Box sx={{ color: theme.palette.text.secondary, opacity: 0.7 }}>
                    <FaFileUpload size={40} style={{ marginBottom: 10 }} />
                    <Typography variant="body1">ยังไม่ได้เลือกไฟล์</Typography>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.palette.text.hint }}>
                        รองรับไฟล์ภาพทุกประเภท (สูงสุด 10MB ต่อไฟล์)
                    </Typography>
                </Box>
            );
        }
        return (
            <Box>
                <Box 
                    component="ul" 
                    sx={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0, 
                        maxHeight: 150, 
                        overflowY: 'auto',
                        textAlign: 'left',
                        mb: 1
                    }}
                >
                    {Array.from(files).map((file, index) => (
                        <Typography 
                            component="li" 
                            key={index} 
                            variant="body2" 
                            sx={{ 
                                p: 0.5, 
                                borderBottom: `1px dashed ${theme.palette.divider}`, 
                                '&:last-child': { borderBottom: 'none' }
                            }}
                        >
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                    ))}
                </Box>
                {/* ปุ่มยกเลิก/ล้างไฟล์ */}
                <Button 
                    onClick={handleClearFiles} 
                    color="error" 
                    size="small" 
                    startIcon={<MdClear />}
                    sx={{ mt: 1, textTransform: 'none' }}
                >
                    ยกเลิกการเลือก {files.length} ไฟล์
                </Button>
            </Box>
        );
    };

    return (
        <Container maxWidth="sm" sx={{ 
            py: 6, 
            minHeight: '100vh', 
            backgroundColor: theme.palette.background.default, 
            pt: { xs: '64px', md: '72px' } 
        }}>
            <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper, boxShadow: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.dark }}>
                    อัปโหลดไฟล์
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                    ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์
                </Typography>
                {/* ✅ คำอธิบายที่แก้ไขใหม่ */}
                <Typography variant="caption" sx={{ mb: 3, display: 'block', color: theme.palette.text.hint }}>
                    *รองรับไฟล์รูปภาพทุกประเภท
                </Typography>

                {/* Drop Zone (MUI Styling) */}
                <Box 
                    className={`drop-zone ${isDragging ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={files.length === 0 ? onDropZoneClick : undefined} 
                    sx={{
                        border: `2px dashed ${isDragging ? theme.palette.secondary.main : theme.palette.primary.main}`,
                        backgroundColor: isDragging ? theme.palette.action.hover : theme.palette.background.default, 
                        borderRadius: 2,
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, border-color 0.3s',
                        mb: 3
                    }}
                >
                    <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        ref={fileInputRef}
                        style={{ display: 'none' }} 
                        // หากต้องการจำกัดเฉพาะรูปภาพ สามารถเพิ่ม accept="image/*" ได้
                        multiple 
                    />
                    
                    <Box className="drop-zone-content">
                        {renderFileNames()} 
                    </Box>
                </Box>

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    color="primary" 
                    disabled={files.length === 0} 
                    fullWidth
                    sx={{
                        py: 1.5,
                        fontWeight: 700,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)' }
                    }}
                >
                    อัปโหลด ({files.length} ไฟล์)
                </Button>
            </Box>
        </Container>
    );
}

export default UploadImage;