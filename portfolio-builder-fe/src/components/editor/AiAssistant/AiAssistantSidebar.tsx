import React, { useState, useEffect } from 'react';
import './AiAssistantSidebar.css';
import { getAiRecommendations } from '../../../api/api';
import { AiReviewResponse, getCriterionLabel } from '../../../types/aiReview';

interface AiAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: any[]; // Добавили пропс для получения блоков
}

export const AiAssistantSidebar: React.FC<AiAssistantSidebarProps> = ({ isOpen, onClose, blocks }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [structuredReview, setStructuredReview] = useState<AiReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      setError(null);
      setStructuredReview(null);

      const fetchAiData = async () => {
        try {
          // Отправляем текущие блоки портфолио на бэкенд
          const result = await getAiRecommendations(blocks);
                  
          const review = result.data;
          if (review && review.overallScore !== undefined) {
            // Парсим JSON если это строка
            const parsedReview: AiReviewResponse = typeof review === 'string' ? JSON.parse(review) : review;
            setStructuredReview(parsedReview);
          } else {
            setError('Ответ от ИИ пуст или неверного формата');
          }
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
      ) : structuredReview ? (
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
            {/* === ОБЩАЯ ОЦЕНКА === */}
            <div className="ai-review-section">
              <div className="overall-score-card">
                <div className="score-circle">
                  <span className="score-value">{structuredReview.overallScore}</span>
                  <span className="score-max">/100</span>
                </div>
                <p className="score-label">Общая оценка портфолио</p>
              </div>
            </div>

            {/* === ПОХВАЛА И ЗОНЫ РОСТА === */}
            {structuredReview.sandwichFeedback && (
              <div className="ai-review-section">
                <h4 className="section-title">Анализ портфолио</h4>
                
                {/* Сильные стороны */}
                {structuredReview.sandwichFeedback.strengths && structuredReview.sandwichFeedback.strengths.length > 0 && (
                  <div className="feedback-block strengths-block">
                    <h5 className="feedback-title">
                      <svg className="feedback-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Сильные стороны
                    </h5>
                    <ul className="feedback-list">
                      {structuredReview.sandwichFeedback.strengths.map((strength, idx) => (
                        <li key={idx} className="feedback-item">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Зоны роста */}
                {structuredReview.sandwichFeedback.growthAreas && structuredReview.sandwichFeedback.growthAreas.length > 0 && (
                  <div className="feedback-block growth-block">
                    <h5 className="feedback-title">
                      <svg className="feedback-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                      Зоны для развития
                    </h5>
                    <ul className="feedback-list">
                      {structuredReview.sandwichFeedback.growthAreas.map((area, idx) => (
                        <li key={idx} className="feedback-item">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Быстрый результат */}
                {structuredReview.sandwichFeedback.quickWin && (
                  <div className="quick-win-card">
                    <p className="quick-win-label">💡 Быстрое улучшение</p>
                    <p className="quick-win-text">{structuredReview.sandwichFeedback.quickWin}</p>
                  </div>
                )}
              </div>
            )}

            {/* === ДЕТАЛЬНАЯ ОЦЕНКА ПО КРИТЕРИЯМ === */}
            {structuredReview.criteriaScores && Object.keys(structuredReview.criteriaScores).length > 0 && (
              <div className="ai-review-section">
                <h4 className="section-title">Критерии оценки</h4>
                <div className="criteria-grid">
                  {Object.entries(structuredReview.criteriaScores).map(([key, criterion]) => {
                    if (!criterion || !criterion.score) return null;
                    return (
                      <div key={key} className="criterion-card">
                        <div className="criterion-header">
                          <p className="criterion-name">{getCriterionLabel(key)}</p>
                          <div className="criterion-score-badge">{criterion.score}</div>
                        </div>
                        <p className="criterion-comment">{criterion.comment}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* === РАЗБОР ПРОЕКТОВ === */}
            {structuredReview.projectReviews && structuredReview.projectReviews.length > 0 && (
              <div className="ai-review-section">
                <h4 className="section-title">Анализ проектов</h4>
                <div className="projects-list">
                  {structuredReview.projectReviews.map((project, idx) => (
                    <div key={idx} className="project-card">
                      <h5 className="project-name">{project.projectName}</h5>
                      <p className="project-verdict">{project.verdict}</p>
                      {project.missingMetrics && (
                        <p className="project-detail"><strong>Отсутствующие метрики:</strong> {project.missingMetrics}</p>
                      )}
                      {project.suggestedTemplate && (
                        <p className="project-detail"><strong>Рекомендуемый шаблон:</strong> {project.suggestedTemplate}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === НАРУШЕНИЯ BLACKLIST === */}
            {structuredReview.blacklistViolations && structuredReview.blacklistViolations.length > 0 && (
              <div className="ai-review-section warning-section">
                <h4 className="section-title">
                  <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3.05h16.94a2 2 0 001.71-3.05L13.71 3.86a2 2 0 00-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Найденные замечания
                </h4>
                <ul className="violations-list">
                  {structuredReview.blacklistViolations.map((violation, idx) => (
                    <li key={idx} className="violation-item">{violation}</li>
                  ))}
                </ul>
              </div>
            )}
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
      ) : null}
    </div>
  );
};