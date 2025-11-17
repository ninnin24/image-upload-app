import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. ใช้ axios (ถูกต้อง)
import '../styles/LoginPage.css';
import HappySoftLogo from '../assets/fileflowz2.png';

function LoginPage({ setUser, isRegister = false }) { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(isRegister);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        try {
            // ⭐️ 1. เปลี่ยนจาก fetch มาใช้ axios.post
            // axios จะส่ง JSON, จัดการ header, และ credentials ให้อัตโนมัติ (ถ้าตั้งค่า proxy หรือ default)
            // หรือระบุ withCredentials: true ถ้าจำเป็น
            const response = await axios.post('/login', 
                { username, password },
                { withCredentials: true } // ⭐️ 2. ส่ง cookie ไปด้วย
            );

            // ⭐️ 3. axios จะคืนข้อมูล data มาใน .data โดยตรง
            const data = response.data;
            const { role } = data; // ดึง role จาก data ที่ได้มา

            // ⭐️ 4. axios จะ throw error ถ้า response ไม่ใช่ 2xx
            // ดังนั้นถ้ามาถึงตรงนี้ได้ คือ "สำเร็จ" (ไม่ต้องเช็ค response.ok)
            
            setUser(data); 

            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/user/dashboard', { replace: true });
            }
        
            // ⭐️ 5. (สำคัญมาก) ลบ window.location.reload(); ทิ้ง
            // การ reload จะทำลาย State ของ React ที่ setUser เพิ่งตั้งค่าไป
            // navigate() คือวิธีที่ถูกต้องแล้ว

        } catch (err) {
            // ⭐️ 6. Error handling ของ axios ถูกต้องแล้ว (ใช้ err.response)
            if (err.response) {
                setError(err.response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else if (err.request) {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
            } else {
                setError('เกิดข้อผิดพลาดบางอย่าง');
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกข้อมูลสำหรับลงทะเบียน");
            return;
        }

        try {
            // ⭐️ 7. เปลี่ยน handleRegister ให้ใช้ axios ด้วย (เพื่อความสอดคล้อง)
            await axios.post('/register', { username, password });

            // ⭐️ 8. ถ้าไม่ Error (catch ไม่ทำงาน) คือสำเร็จ
            alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
            setIsRegistering(false); 
            setUsername(''); // เคลียร์ฟอร์ม
            setPassword(''); // เคลียร์ฟอร์ม
            
        } catch (err) {
            // ⭐️ 9. Error handling ของ axios
            if (err.response) {
                setError(err.response.data.message || 'การลงทะเบียนล้มเหลว (อาจมีชื่อผู้ใช้นี้แล้ว)');
            } else {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={HappySoftLogo} alt="HappySoft Logo" className="login-logo" />

                {isRegistering ? <h2>สร้างบัญชีผู้ใช้ใหม่</h2> : <h2>เข้าสู่ระบบ</h2>}

                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">ชื่อผู้ใช้/อีเมล</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">
                        {isRegistering ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
                    </button>
                </form>

                <div className="switch-mode-container">
                    <div className="left-action">
                        <a href="/forgot-password" className="forgot-password">ลืมรหัสผ่าน?</a>
                    </div>
                    <div className="right-action">
                        <button
                            className="register-toggle-button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setUsername('');
                                setPassword('');
                            }}
                        >
                            {isRegistering ? "เข้าสู่ระบบ" : "ลงทะเบียนบัญชีใหม่"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;