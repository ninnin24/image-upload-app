import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

import { VscHistory, VscCloudUpload, VscCloudDownload, VscTrash, VscEdit, VscFile } from "react-icons/vsc";
import '../styles/DashboardSummary.css';
import '../styles/ActivityLog.css';

const actionOptions = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'UPLOAD', label: 'อัปโหลด' },
    { value: 'DOWNLOAD', label: 'ดาวน์โหลด' },
    { value: 'DELETE', label: 'ลบ' },
    { value: 'EDIT', label: 'แก้ไข' }
];

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [startDate, setStartDate] = useState(null); 
    const [endDate, setEndDate] = useState(null);     

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

    // --- ⭐️⭐️⭐️ (แก้ไข) ย้าย useMemo มาไว้ข้างบนนี้ ⭐️⭐️⭐️ ---
    // (ก่อนฟังก์ชัน helper และ if(loading))
    const filteredActivities = useMemo(() => {
        return activities
            .filter(log => {
                // 1. กรองตาม Action Type
                if (!filter) return true; 
                return log.action_type && log.action_type.trim().toUpperCase() === filter;
            })
            .filter(log => {
                // 2. กรองตาม Start Date
                if (!startDate) return true; 
                return new Date(log.created_at) >= startDate;
            })
            .filter(log => {
                // 3. กรองตาม End Date
                if (!endDate) return true; 
                return new Date(log.created_at) <= endDate;
            });
    }, [activities, filter, startDate, endDate]); // 👈 6.1 เพิ่ม dependencies


    // --- ฟังก์ชัน Helper ---
    const formatDate = date => new Date(date).toLocaleString('th-TH'); 

    const formatActionType = (action) => {
        const safeAction = (action || '').trim().toUpperCase();
        switch (safeAction) {
            case 'UPLOAD': return 'อัปโหลดไฟล์';
            case 'DOWNLOAD': return 'ดาวน์โหลดไฟล์';
            case 'DELETE': return 'ลบไฟล์';
            case 'EDIT': return 'แก้ไขข้อมูล';
            default: return 'ดำเนินการ (' + (action || 'N/A') + ')';
        }
    };

    const getActionIcon = (action) => {
        // ... (โค้ดส่วนนี้เหมือนเดิม) ...
        const safeAction = (action || '').trim().toUpperCase();
        switch (safeAction) {
            case 'UPLOAD': return <VscCloudUpload size={20} style={{ color: '#007bff' }} />;
            case 'DOWNLOAD': return <VscCloudDownload size={20} style={{ color: '#28a745' }} />;
            case 'DELETE': return <VscTrash size={20} style={{ color: '#dc3545' }} />;
            case 'EDIT': return <VscEdit size={20} style={{ color: '#ffc107' }} />;
            default: return <VscFile size={20} />;
        }
    };
    // ---------------------------------

    // --- (OK) ตอนนี้ if(loading) อยู่นี่ได้แล้ว ---
    if (loading) {
        return <div className="activity-log-container"><p>กำลังโหลดข้อมูล...</p></div>;
    }

    return (
        <div className="activity-log-container">
            <div className="activity-log-header">
                <h2><VscHistory size={24} style={{ marginRight: '10px' }} />ประวัติกิจกรรมทั้งหมด</h2>

                {/* --- กลุ่มฟิลเตอร์ (เหมือนเดิม) --- */}
                <div className="filters-group" style={{ display: 'flex', gap: '15px' }}>

                    <div className="activity-filter-container">
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="ตั้งแต่ (วว/ดด/ปปปป)"
                            isClearable
                            dateFormat="dd/MM/yyyy"
                            className="date-picker-input" 
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>

                    <div className="activity-filter-container">
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="ถึง (วว/ดด/ปปปป)"
                            isClearable
                            dateFormat="dd/MM/yyyy"
                            className="date-picker-input" 
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>

                    <div className="activity-filter-container" style={{ minWidth: '180px' }}>
                        <Select
                            options={actionOptions}
                            value={actionOptions.find(opt => opt.value === filter)}
                            onChange={selectedOption => setFilter(selectedOption.value)}
                            instanceId="action-filter-select"
                            placeholder="เลือกการกระทำ..."
                        />
                    </div>

                    <button 
                        className="btn btn-secondary" 
                        onClick={() => {
                            setFilter('');
                            setStartDate(null);
                            setEndDate(null);
                        }}
                        style={{ padding: '8px 12px' }} 
                    >
                        รีเซ็ต
                    </button>

                </div>
            </div>

            {/* ส่วนรายการกิจกรรม (List) */}
            <div className="activity-list">
                {filteredActivities.length === 0 ? (
                    <p>{(filter || startDate || endDate) ? 'ไม่พบกิจกรรมที่ตรงกับตัวกรอง' : 'ยังไม่มีกิจกรรม'}</p>
                ) : (
                    filteredActivities.map((log, index) => (
                        <div key={`${log.id}-${index}`} className="timeline-item-activity">
                            <div className="timeline-icon">
                                {getActionIcon(log.action_type)}
                            </div>
                            <div className="timeline-content">
                                <strong>{formatActionType(log.action_type)}</strong>
                                <p>ไฟล์: {log.file_name}</p>
                                <p>
                                    โดย: <strong className="highlight-username">{log.username || 'ไม่ระบุ'}</strong>
                                    (บริษัท: {log.company_name})
                                </p>
                                <p className="timeline-timestamp">
                                    เวลา: {formatDate(log.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLog;