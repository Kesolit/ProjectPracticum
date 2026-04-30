import React, { useState } from 'react';
import './SaveSuccessModal.css';

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
}

const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({ isOpen, onClose, publicUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewSite = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-x" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <div className="success-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2>Портфолио сохранено!</h2>
          <p>
            Ваш черновик успешно сохранен в базе данных. Теперь портфолио доступно 
            по публичной ссылке в режиме "только чтение".
          </p>
        </div>

        <div className="url-container">
          <input 
            type="text" 
            readOnly 
            value={publicUrl} 
            className="url-input"
          />
          <button className="copy-button" onClick={handleCopy}>
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Закрыть</button>
          <button className="btn-primary" onClick={handleViewSite}>Посмотреть сайт</button>
        </div>
      </div>
    </div>
  );
};

export default SaveSuccessModal;