import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    
    // 1. ถ้ายังไม่มี User (ไม่ได้ล็อกอิน หรือ user เป็น null) -> ไปหน้า Login
    if (!user || !user.role) {
        return <Navigate to="/login" replace />;
    }

    // 2. ถ้าล็อกอินแล้ว แต่ Role ไม่ถูกต้อง (เช่น User จะเข้าหน้า Admin)
    if (!allowedRoles.includes(user.role)) {
        // เช็คว่าเขาเป็นใคร แล้วส่งกลับไปหน้าบ้านของเขา
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/user/dashboard" replace />;
        }
    }

    // 3. ถ้าผ่านทุกด่าน -> อนุญาตให้เข้าถึงหน้านั้น
    return children;
};

export default ProtectedRoute;