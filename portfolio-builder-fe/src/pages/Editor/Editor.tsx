import logo from '../../assets/logo.svg'
import './Editor.css'

const Editor = () => {
  const blocks = [
    { name: 'Главный блок', desc: 'Хедер и приветствие', bg: '#DBEAFE', square: '#3B82F6' },
    { name: 'Навигация', desc: 'Верхнее меню', bg: '#F3E8FF', square: '#8B5CF6' },
    { name: 'Обо мне', desc: 'Биография', bg: '#DCFCE7', square: '#10B981' },
    { name: 'Галерея проектов', desc: 'Кейсы', bg: '#FEF9C3', square: '#EAB308' },
    { name: 'Навыки', desc: 'Технологии', bg: '#CFFAFE', square: '#06B6D4' },
    { name: 'История опыта', desc: 'Карьера', bg: '#FFEDD5', square: '#F97316' },
    { name: 'Отзывы', desc: 'Рекомендации', bg: '#FCE7F3', square: '#EC489A' },
    { name: 'Подвал', desc: 'Контакты', bg: '#E5E7EB', square: '#6B7280' }
  ]

  return (
    <div className="editor">
      {/* Хеддер */}
      <header className="editor-header">
        <div className="logo">
          <img src={logo} alt="dev/folio" className="logo-icon" />
          <span className="logo-text">dev/folio</span>
        </div>
        <div className="header-actions">
          <button className="header-btn">Предпросмотр</button>
          <button className="header-btn">Экспорт</button>
          <button className="header-btn save-btn">Сохранить портфолио</button>
          <button className="profile-btn">
            <span className="profile-icon">👤</span>
          </button>
        </div>
      </header>

      {/* Основное содержание */}
      <div className="editor-main">
        {/* Левая панель */}
        <aside className="sidebar">
          <h2>Элементы конструктора</h2>
          <p className="hint">Перетащите блоки для создания портфолио</p>
          <div className="blocks-list">
            {blocks.map((block, idx) => (
              <div key={idx} className="block-card" style={{ backgroundColor: block.bg }}>
                <div className="block-color-square" style={{ backgroundColor: block.square }}></div>
                <div className="block-text">
                  <strong>{block.name}</strong>
                  <small>{block.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Центральная область */}
        <main className="canvas">
          <div className="empty-state">
            <h3>Начните создавать свое портфолио</h3>
            <p>
              Перетащите компоненты из левой боковой панели, чтобы создать идеальное 
              портфолио разработчика. Меняйте их порядок по своему усмотрению!
            </p>
            <div className="tip">Совет: Начните с Главного блока, чтобы представиться.</div>
            <div className="placeholder">
              Перетащите элементы сюда — Ваше портфолио появится здесь
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Editor