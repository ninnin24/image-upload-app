import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from '../components/AddUserModal'; // สมมติว่า Modal นี้รองรับ MUI หรือจะปรับให้รองรับ
import { VscAccount } from "react-icons/vsc";

// ⭐️ MUI Imports ⭐️
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';

// ⭐️ Icon Imports for Actions ⭐️
import { Delete as DeleteIcon, VpnKey as ResetPasswordIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // ⭐️ 1. ลบ API_URL ทิ้ง

  const fetchUsers = async () => {
    try {
      // ⭐️ 2. ใช้ Relative Path
      const res = await axios.get(`/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      // เพิ่มการแจ้งเตือนแบบ Material-UI (เช่น Snackbar) ในแอปจริง
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, username) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${username}"?`)) {
      try {
        // ⭐️ 3. ใช้ Relative Path
        await axios.delete(`/admin/users/${userId}`, { withCredentials: true });
        alert(`ลบผู้ใช้ ${username} สำเร็จ`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      }
    }
  };

  const handleResetPassword = async (userId, username) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตรหัสผ่านของ "${username}"?`)) {
      try {
        // ⭐️ 4. ใช้ Relative Path
        const res = await axios.post(`/admin/users/${userId}/reset-password`, {}, { withCredentials: true });
        const newPassword = res.data.new_password;
        alert(`รีเซ็ตรหัสผ่านของ ${username} สำเร็จ!\nรหัสผ่านใหม่คือ: ${newPassword}`);
      } catch (err) {
        console.error("Error resetting password:", err);
        alert('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      }
    }
  };

  return (
    // ใช้ Container ของ MUI เพื่อจำกัดความกว้างและจัดให้อยู่กึ่งกลาง
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VscAccount size={24} style={{ marginRight: '8px' }} />
          <Typography variant="h4" component="h1">
            จัดการผู้ใช้
          </Typography>
        </Box>
        
        {/* ใช้ Button ของ MUI */}
        <Button 
          variant="contained" 
          color="primary" // ใช้สีหลักของ Material Design
          startIcon={<PersonAddIcon />}
          onClick={() => setShowAddModal(true)}
        >
          เพิ่มผู้ใช้ใหม่
        </Button>
      </Box>

      {/* Modal จัดการผู้ใช้ */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {/* ตารางแสดงผู้ใช้ */}
      {users.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">ไม่พบผู้ใช้</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}> {/* ใช้ Paper เป็นพื้นหลังของตาราง */}
          <Table sx={{ minWidth: 650 }} aria-label="user management table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}> {/* สีพื้นหลังหัวตาราง */}
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">ชื่อผู้ใช้</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">อีเมล</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">บริษัท</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">สิทธิ์</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle1" fontWeight="bold">การดำเนินการ</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow
                  key={u.id}
                  hover // มีเอฟเฟกต์เมื่อเมาส์ชี้
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {u.username}
                  </TableCell>
                  <TableCell>{u.email ?? '-'}</TableCell>
                  <TableCell>{u.company_name ?? '-'}</TableCell>
                  <TableCell>
                    <Box 
                      component="span" 
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        backgroundColor: u.role === 'admin' ? '#ef9a9a' : '#c5e1a5', // สีตามสิทธิ์
                        color: u.role === 'admin' ? '#b71c1c' : '#33691e',
                        fontWeight: 'bold',
                      }}
                    >
                      {u.role}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {/* ใช้ IconButton สำหรับ Action */}
                    <Tooltip title="รีเซ็ตรหัสผ่าน">
                      <IconButton 
                        color="warning" // สีส้มสำหรับการเตือน/รีเซ็ต
                        onClick={() => handleResetPassword(u.id, u.username)}
                        aria-label={`รีเซ็ตรหัสผ่านของ ${u.username}`}
                      >
                        <ResetPasswordIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="ลบผู้ใช้">
                      <IconButton 
                        color="error" // สีแดงสำหรับการลบ
                        onClick={() => handleDelete(u.id, u.username)}
                        aria-label={`ลบผู้ใช้ ${u.username}`}
                        sx={{ ml: 1 }} // เว้นระยะห่างเล็กน้อย
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default UserManagement;