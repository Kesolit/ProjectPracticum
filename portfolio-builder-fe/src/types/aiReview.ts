/**
 * Типы для ответа ИИ анализа портфолио
 */

export interface CriterionScore {
  score: number | string;
  comment: string;
}

export interface CriteriaScores {
  hrReadability?: CriterionScore;
  stackDepth?: CriterionScore;
  metrics?: CriterionScore;
  atsCompatibility?: CriterionScore;
  architecture?: CriterionScore;
}

export interface SandwichFeedback {
  strengths: string[];
  growthAreas: string[];
  quickWin: string;
}

export interface ProjectReview {
  projectName: string;
  verdict: string;
  missingMetrics?: string;
  suggestedTemplate?: string;
}

export interface AiReviewResponse {
  overallScore: number;
  sandwichFeedback: SandwichFeedback;
  criteriaScores: CriteriaScores;
  projectReviews?: ProjectReview[];
  blacklistViolations?: string[];
}

/**
 * Получить человеческие названия для критериев
 */
export const getCriterionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    hrReadability: 'Читаемость для HR',
    stackDepth: 'Глубина технического стека',
    metrics: 'Метрики и результаты',
    atsCompatibility: 'Совместимость с ATS',
    architecture: 'Архитектура портфолио',
  };
  return labels[key] || key;
};
