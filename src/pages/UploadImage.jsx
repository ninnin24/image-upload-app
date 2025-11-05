import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function UploadImage() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            const storedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
            storedFiles.push({
                name: selectedFile.name,
                url: reader.result,
                uploadedAt: new Date().toLocaleString(),
            });
            localStorage.setItem('uploaded_files', JSON.stringify(storedFiles));
            alert(`อัปโหลดเรียบร้อย: ${selectedFile.name}`);
            navigate('/home'); // กลับ Home หลังอัปโหลด
        };
        reader.readAsDataURL(selectedFile);
    };

    return (
        <div className="upload-container">
            <h1>อัปโหลดไฟล์</h1>
            <input type="file" onChange={handleFileSelect} />
            <button onClick={handleUpload} disabled={!selectedFile}>
                🚀 อัปโหลด
            </button>
            {selectedFile && <p>📁 ไฟล์ที่เลือก: {selectedFile.name}</p>}
        </div>
    );
}

export default UploadImage;
