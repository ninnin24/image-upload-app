import React, { useState } from 'react'; // ⭐️ 1. ลบ useEffect ออก
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import HappySoftLogo from '../assets/fileflowz2.png';

// ⭐️ 2. ลบ API_URL ทิ้ง

// ⭐️ 3. รับ 'setUser' มาจาก Props
function LoginPage({ setUser, isRegister = false }) { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // ⭐️ 4. แก้ไข isRegistering 
    const [isRegistering, setIsRegistering] = useState(isRegister);
    const navigate = useNavigate();

    // ⭐️ 5. ลบ USEEFFECT ที่ตรวจสอบ LOCALSTORAGE ทิ้งไปทั้งหมด
    /*
    useEffect(() => {
        // ... (ลบบล็อกนี้ทิ้ง) ...
    }, [navigate]);
    */

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        try {
            // ⭐️ 6. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
            const response = await fetch(`/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                const { role } = data;
                localStorage.setItem('user_role', role);

                // ⭐️ 7. (สำคัญ!) อัปเดต State หลักใน App.js
                // เราต้องส่ง 'data' ทั้งก้อน (ที่มี username, role)
                setUser(data); 

                if (role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/user/dashboard', { replace: true });
                }
            } else {
                setError(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
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
            // ⭐️ 8. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
            const response = await fetch(`/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
                setIsRegistering(false); // ⭐️ 9. กลับไปหน้า Login
            } else {
                setError(data.message || 'การลงทะเบียนล้มเหลว');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
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
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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