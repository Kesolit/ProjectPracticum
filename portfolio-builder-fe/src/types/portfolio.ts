// Все типы блоков по макету (ровно 8)
export type BlockType = 
  | 'main'        // Главный блок (хедер и приветствие)
  | 'navigation'  // Навигация (верхнее меню)
  | 'about'       // О себе (биография)
  | 'projects'    // Галерея проектов (кейсы)
  | 'skills'      // Навыки (технологии)
  | 'experience'  // История опыта (карьера)
  | 'reviews'     // Отзывы (рекомендации)
  | 'footer'      // Подвал (контакты)

export interface ISection {
  id: string;
  type: BlockType;           // ← теперь ровно 8 типов
  order: number;             // Позиция блока в списке
  content: Record<string, any>; // Динамический контент блока
}

export interface IPortfolio {
  id: string;
  userId: string;
  title: string;
  themeId: string;           // Ссылка на выбранный шаблон 
  status: 'draft' | 'published'; // Статус для реализации черновиков
  sections: ISection[];
}