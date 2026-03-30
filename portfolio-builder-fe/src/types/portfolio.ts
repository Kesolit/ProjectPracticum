export interface ISection {
  id: string;
  type: 'about' | 'skills' | 'projects' | 'contacts';
  order: number; // Позиция блока в списке [cite: 81]
  content: Record<string, any>; // Динамический контент блока
}

export interface IPortfolio {
  id: string;
  userId: string;
  title: string;
  themeId: string; // Ссылка на выбранный шаблон 
  status: 'draft' | 'published'; // Статус для реализации черновиков [cite: 37]
  sections: ISection[];
}