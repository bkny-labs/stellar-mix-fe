import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // default duration will be 3000ms (3 seconds)
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, position, onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} toast-${position}`}>
      {message}
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

export default Toast;
