// src/pages/ActivityLog.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const actionOptions = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'UPLOAD', label: 'อัปโหลด' },
  { value: 'DOWNLOAD', label: 'ดาวน์โหลด' },
  { value: 'DELETE', label: 'ลบ' },
  { value: 'EDIT', label: 'แก้ไข' },
];

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/admin/files', { withCredentials: true });
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities
      .filter(log => (!filter ? true : (log.action_type || '').toUpperCase() === filter))
      .filter(log => (!startDate ? true : new Date(log.created_at) >= new Date(startDate)))
      .filter(log => (!endDate ? true : new Date(log.created_at) <= new Date(endDate)));
  }, [activities, filter, startDate, endDate]);

  const formatDate = date => new Date(date).toLocaleString('th-TH');

  const getActionIcon = action => {
    switch ((action || '').toUpperCase()) {
      case 'UPLOAD': return <CloudUploadIcon color="primary" />;
      case 'DOWNLOAD': return <CloudDownloadIcon color="success" />;
      case 'DELETE': return <DeleteIcon color="error" />;
      case 'EDIT': return <EditIcon color="warning" />;
      default: return <DescriptionIcon />;
    }
  };

  const formatActionType = action => {
    switch ((action || '').toUpperCase()) {
      case 'UPLOAD': return 'อัปโหลดไฟล์';
      case 'DOWNLOAD': return 'ดาวน์โหลดไฟล์';
      case 'DELETE': return 'ลบไฟล์';
      case 'EDIT': return 'แก้ไขข้อมูล';
      default: return action || 'ไม่ระบุ';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HistoryIcon sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            ประวัติกิจกรรมทั้งหมด
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="ตั้งแต่ (yyyy-mm-dd)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="ถึง (yyyy-mm-dd)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel>การกระทำ</InputLabel>
              <Select value={filter} label="การกระทำ" onChange={e => setFilter(e.target.value)}>
                {actionOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="button"
              onClick={() => { setFilter(''); setStartDate(''); setEndDate(''); }}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#eee',
                cursor: 'pointer',
              }}
            >
              รีเซ็ต
            </Box>
          </Grid>
        </Grid>

        {/* Activity List */}
        {filteredActivities.length === 0 ? (
          <Typography>ไม่พบกิจกรรมที่ตรงกับตัวกรอง</Typography>
        ) : (
          <List>
            {filteredActivities.map((log, idx) => (
              <Box key={idx}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>{getActionIcon(log.action_type)}</ListItemIcon>
                  <ListItemText
                    primary={`${formatActionType(log.action_type)} - ${log.file_name || 'ไม่ระบุไฟล์'}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          โดย: {log.username || 'ไม่ระบุ'} (บริษัท: {log.company_name || '-'})
                        </Typography>
                        <br />
                        เวลา: {formatDate(log.created_at)}
                      </>
                    }
                  />
                </ListItem>
                {idx !== filteredActivities.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
};

export default ActivityLog;
