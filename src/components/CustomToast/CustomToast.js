import React, { useState, useEffect } from 'react';
import './CustomToast.css'; // ניצור קובץ CSS להודעות

const Toast = ({ type, message, onClose }) => {
    // נוכל להוסיף זמן שמתן להודעה להיעלם
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // נסגור את ההודעה לאחר 3 שניות
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
            <p>{message}</p>
        </div>
    );
};

const ToastDemo = () => {
    const [toast, setToast] = useState({ type: '', message: '' });

    const handleClick = (type, message) => {
        setToast({ type, message });
    };

    const closeToast = () => {
        setToast({ type: '', message: '' }); // סוגר את ה-toast
    };

    return (
        <div>
            <button onClick={() => handleClick('success', 'הצלחה!')}>
                הצלחה
            </button>
            <button onClick={() => handleClick('error', 'שגיאה!')}>
                שגיאה
            </button>
            <button onClick={() => handleClick('info', 'מידע חשוב.')}>
                מידע
            </button>

            {/* הצגת ה-toast */}
            {toast.message && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
        </div>
    );
};

export default ToastDemo;
