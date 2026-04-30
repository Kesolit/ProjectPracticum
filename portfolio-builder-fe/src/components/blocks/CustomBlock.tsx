import React from 'react';

export const CustomBlock = ({ content, onChange }: { content: any, onChange: (data: any) => void }) => {
  return (
    <div className="about-card" style={{ textAlign: 'left', width: '100%' }}>
      <input 
        style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          border: 'none', 
          outline: 'none', 
          width: '100%', 
          marginBottom: '16px',
          color: '#111827' 
        }}
        placeholder="Заголовок блока..."
        value={content?.title || ''}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
      />
      <textarea
        className="about-input-field"
        style={{ width: '100%', minHeight: '100px' }}
        placeholder="Текст вашего кастомного блока..."
        value={content?.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
      />
    </div>
  );
};