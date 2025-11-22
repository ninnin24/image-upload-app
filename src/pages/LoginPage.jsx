import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';
import HappySoftLogo from '../assets/fileflowz2.png'; // ตรวจสอบ path รูปภาพให้ถูกต้อง

function LoginPage({ setUser, isRegister = false }) {
    const navigate = useNavigate();
    
    // State สำหรับโหมด Login/Register
    const [isRegistering, setIsRegistering] = useState(isRegister);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // State สำหรับข้อมูล Form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',      // เพิ่ม: ชื่อ-นามสกุล
        email: '',         // เพิ่ม: อีเมล
        phone: '',         // เพิ่ม: เบอร์โทร
        companyName: ''    // เพิ่ม: ชื่อบริษัท (เพื่อให้ Admin รู้ว่าสังกัดไหน)
    });

    // ฟังก์ชันจัดการการเปลี่ยนค่าใน Input
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // --- ส่วนของ Login ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/login', 
                { 
                    username: formData.username, 
                    password: formData.password 
                },
                { withCredentials: true }
            );

            const data = response.data;
            setUser(data);

            // Redirect ตาม Role
            if (data.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/user/dashboard', { replace: true });
            }

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else {
                setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- ส่วนของ Register ---
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validation เบื้องต้น
        if (formData.password !== formData.confirmPassword) {
            setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
        if (!formData.companyName) {
            setError("กรุณาระบุชื่อบริษัท");
            return;
        }

        setLoading(true);

        try {
            // ส่งข้อมูลทั้งหมดตาม Requirement ไปที่ Backend
            // Backend ต้องทำการสร้าง User และผูกกับ CompanyID (หรือสร้าง Company ใหม่ถ้ายังไม่มี)
            await axios.post('/register', {
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                companyName: formData.companyName,
                role: 'user' // Default เป็น user เสมอ
            });

            alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
            
            // รีเซ็ตฟอร์มและกลับไปหน้า Login
            setIsRegistering(false);
            setFormData({
                username: '', password: '', confirmPassword: '',
                fullName: '', email: '', phone: '', companyName: ''
            });

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'การลงทะเบียนล้มเหลว');
            } else {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className={`login-box ${isRegistering ? 'register-mode' : ''}`}>
                <img src={HappySoftLogo} alt="Logo" className="login-logo" />

                <h2>{isRegistering ? "สร้างบัญชีผู้ใช้ใหม่" : "เข้าสู่ระบบ"}</h2>

                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    
                    {/* ส่วนข้อมูลที่ใช้ทั้ง Login และ Register */}
                    <div className="input-group">
                        <label htmlFor="username">ชื่อผู้ใช้ (Username)</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="กรอกชื่อผู้ใช้ภาษาอังกฤษ"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ส่วนที่แสดงเฉพาะตอน Register */}
                    {isRegistering && (
                        <>
                            <div className="input-group">
                                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="divider">ข้อมูลส่วนตัว</div>

                            <div className="input-group">
                                <label htmlFor="fullName">ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">อีเมล</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="divider">ข้อมูลองค์กร</div>

                            <div className="input-group">
                                <label htmlFor="companyName">ชื่อบริษัท / หน่วยงาน</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="ระบุชื่อบริษัทที่คุณสังกัด"
                                />
                            </div>
                        </>
                    )}

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "กำลังประมวลผล..." : (isRegistering ? "ลงทะเบียน" : "เข้าสู่ระบบ")}
                    </button>
                </form>

                <div className="switch-mode-container">
                    {!isRegistering && (
                        <div className="left-action">
                            <a href="/forgot-password" onClick={(e) => e.preventDefault()} className="forgot-password">
                                ลืมรหัสผ่าน?
                            </a>
                        </div>
                    )}
                    <div className={`right-action ${isRegistering ? 'full-width' : ''}`}>
                        <button
                            className="register-toggle-button"
                            type="button" // สำคัญ: ต้องใส่ type="button" เพื่อไม่ให้ submit form
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                // Optional: Clear form when switching
                            }}
                        >
                            {isRegistering ? "กลับไปหน้าเข้าสู่ระบบ" : "ลงทะเบียนบัญชีใหม่"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;