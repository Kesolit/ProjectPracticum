// Все типы блоков по макету (ровно 8)
export type BlockType = 
  | 'main'        // Главный блок (хедер и приветствие)
  | 'navigation'  // Навигация (верхнее меню)
  | 'about'       // О себе (биография)
  | 'projects'    // Галерея проектов (кейсы)
  | 'skills'      // Навыки (технологии)
  | 'experience'  // История опыта (карьера)
  | 'reviews'     // Отзывы (рекомендации)
  | 'footer'      // Подвал (контакты);

export interface ISection {
  id: string;
  type: BlockType;
  order: number;                // Позиция блока в списке
  content: Record<string, any>; // Динамический контент блока
}

// Основная структура портфолио для редактора (Draft)
export interface IPortfolio {
  id: string;
  userId: string;
  title: string;
  slug?: string;                // Текстовый адрес (например, sasha-dev)
  themeId: string;
  status: 'draft' | 'published';
  sections: ISection[];
  updatedAt: string;
}

// Структура для публичного просмотра (Read-Only)
export interface IPublicPortfolio {
  owner: {
    fullName: string;
    role: string;
    contacts: {
      email?: string;
      telegram?: string;
      github?: string;
    };
  };
  config: {
    themeId: string;
    title: string;
  };
  // Массив секций, уже отсортированный бэкендом по полю order
  sections: Array<{
    type: BlockType;
    content: Record<string, any>;
  }>;
  publishedAt: string;
}