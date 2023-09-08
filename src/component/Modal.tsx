import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onLogout: () => void;
    onLogin: () => void;
  }

const Modal: React.FC<ModalProps> = ({ isOpen, onLogin, onLogout }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <h2>Your Spotify session is about to expire</h2>
        <button onClick={onLogout}>Log Out</button>
        <button onClick={onLogin}>Log In Again</button>
      </div>
    </div>
  );
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  zIndex: 888,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  maxWidth: '500px',
  minHeight: '300px',
};

export default Modal;
