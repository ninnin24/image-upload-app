import React, { useEffect, useState } from 'react';
import '../styles/Home.css';

function MyListPage() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
        setFiles(storedFiles);
    }, []);

    const handleDelete = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        localStorage.setItem('uploaded_files', JSON.stringify(newFiles));
        setFiles(newFiles);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>รายการของฉัน</h1>
            {files.length === 0 ? (
                <p className="no-files">ยังไม่มีไฟล์อัปโหลด</p>
            ) : (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            <strong>{file.name}</strong> - {file.uploadedAt}
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(index)}
                            >
                                🗑️ ลบ
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyListPage;
