import React, { useEffect } from 'react';
import './Privacy.css';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Privacy Policy</h2>
        <p>Effective Date: June 16, 2024</p>
        <p>Welcome to StellarMix! Your privacy is important to us. This Privacy Policy explains how we handle your data when you use our app.</p>
        <h3>Data Collection</h3>
        <p>Spotify Data: We do not store any of your data from Spotify. The data is used solely to provide you with personalized playlists and is not saved on our servers.</p>
        <h3>Data Usage</h3>
        <p>Personalization: The data we access from Spotify is used only to create and enhance your personalized playlists.</p>
        <p>No Selling of Data: We do not sell, trade, or otherwise transfer your data to outside parties.</p>
        <h3>Data Security</h3>
        <p>We use industry-standard security measures to protect your data while it is being processed.</p>
        <h3>Changes to this Privacy Policy</h3>
        <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly.</p>
        <h3>Free and Open Source</h3>
        <p>StellarMix is a free and open-source project by <a target='_blank' href="https://mikefortuna.com" rel="noreferrer">Mike Fortuna</a>. Contributions from the community are welcome. Check out the repository on <a href='https://github.com/bkny-labs/stellar-mix-fe' target='_blank' rel="noreferrer">GitHub</a> to get involved!</p>
        <button onClick={onClose} className="close-modal-button">Close</button>
      </div>
    </div>
  );
};

export default PrivacyModal;
