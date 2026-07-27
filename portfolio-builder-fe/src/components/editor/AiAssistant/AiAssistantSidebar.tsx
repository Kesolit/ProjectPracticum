import React, { useState, useEffect } from 'react';
import './AiAssistantSidebar.css';
import { getAiRecommendations } from '../../../api/api';

interface AiAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: any[]; // Добавили пропс для получения блоков
}

export const AiAssistantSidebar: React.FC<AiAssistantSidebarProps> = ({ isOpen, onClose, blocks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setError(null);
      setAiResponse(null);

      const fetchAiData = async () => {
        try {
          // Отправляем текущие блоки портфолио на бэкенд
          const result = await getAiRecommendations(blocks);
                  
          setAiResponse(result.data || result.message || result.recommendations || 'Ответ от ИИ пуст.');
        } catch (err: any) {
          setError(err.message || 'Не удалось получить рекомендации от ИИ.');
        } finally {
          setIsAnalyzing(false);
        }
      };

      fetchAiData();
    }
  }, [isOpen, blocks]); // Перезапрашиваем, если модалка открылась или блоки изменились

  if (!isOpen) return null;

  return (
    <div className="ai-sidebar">
      <div className="ai-sidebar-header">
        <h3 className="ai-sidebar-title">Проверка портфолио с помощью ИИ</h3>
        <button className="ai-sidebar-close" onClick={onClose} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {isAnalyzing ? (
        <div className="ai-sidebar-loading">
          <div className="ai-icon-circle pulse-animation">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
              <path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"></path>
            </svg>
          </div>
          <h4 className="ai-hero-title">Проводим диагностику</h4>
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      ) : error ? (
        <div className="ai-sidebar-loading">
          <h4 className="ai-hero-title" style={{ color: '#DC2626' }}>Ошибка</h4>
          <p className="ai-hero-subtitle" style={{ padding: '0 20px' }}>{error}</p>
        </div>
      ) : (
        <>
          <div className="ai-sidebar-hero">
            <div className="ai-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
                <path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"></path>
              </svg>
            </div>
            <h4 className="ai-hero-title">Анализ завершён</h4>
            <p className="ai-hero-subtitle">
              Искусственный интеллект проанализировал ваше портфолио и подготовил рекомендации
            </p>
          </div>

          <div className="ai-sidebar-content-wrapper">
            <div className="ai-sidebar-content" style={{ whiteSpace: 'pre-wrap' }}> 
              {aiResponse}
            </div>
          </div>

          <div className="ai-sidebar-footer">
            <button className="ai-feedback-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Оставить отзыв
            </button>
          </div>
        </>
      )}
    </div>
  );
};