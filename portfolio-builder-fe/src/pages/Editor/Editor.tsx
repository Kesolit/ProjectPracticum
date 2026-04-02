  import logo from '../../assets/logo.svg'
  import { useState, useRef, useEffect } from 'react'
  import './Editor.css'

  interface BlockType {
    name: string
    desc: string
    bg: string
    square: string
    type: string
  }

  const Editor = () => {
    const [droppedBlocks, setDroppedBlocks] = useState<BlockType[]>([])
    const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null)
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)

    const blocks: BlockType[] = [
      { name: 'Главный блок', desc: 'Хедер и приветствие', bg: '#DBEAFE', square: '#3B82F6', type: 'main' },
      { name: 'Навигация', desc: 'Верхнее меню', bg: '#F3E8FF', square: '#8B5CF6', type: 'nav' },
      { name: 'Обо мне', desc: 'Биография', bg: '#DCFCE7', square: '#10B981', type: 'about' },
      { name: 'Галерея проектов', desc: 'Кейсы', bg: '#FEF9C3', square: '#EAB308', type: 'projects' },
      { name: 'Навыки', desc: 'Технологии', bg: '#CFFAFE', square: '#06B6D4', type: 'skills' },
      { name: 'История опыта', desc: 'Карьера', bg: '#FFEDD5', square: '#F97316', type: 'experience' },
      { name: 'Отзывы', desc: 'Рекомендации', bg: '#FCE7F3', square: '#EC489A', type: 'reviews' },
      { name: 'Подвал', desc: 'Контакты', bg: '#E5E7EB', square: '#6B7280', type: 'footer' }
    ]

    // Обработчик начала перетаскивания
    const handleDragStart = (e: React.DragEvent, block: BlockType) => {
      // Сохраняем данные блока
      e.dataTransfer.setData('block', JSON.stringify(block))
      e.dataTransfer.effectAllowed = 'copy'
      
      // Создаём прозрачное изображение для стандартного курсора
      const dragIcon = document.createElement('div')
      dragIcon.style.opacity = '0'
      document.body.appendChild(dragIcon)
      e.dataTransfer.setDragImage(dragIcon, 0, 0)
      document.body.removeChild(dragIcon)
      
      // Сохраняем блок для визуального отображения
      setDraggedBlock(block)
      setIsDragging(true)
      
      // Получаем позицию курсора
      setDragPosition({ x: e.clientX, y: e.clientY })
    }

    // Обновление позиции курсора
    const handleDrag = (e: React.DragEvent) => {
      if (isDragging) {
        setDragPosition({ x: e.clientX, y: e.clientY })
      }
    }

    // Окончание перетаскивания
    const handleDragEnd = () => {
      setIsDragging(false)
      setDraggedBlock(null)
    }

    // Сброс блока на холст
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      
      const blockData = e.dataTransfer.getData('block')
      if (blockData) {
        const block: BlockType = JSON.parse(blockData)
        if (!droppedBlocks.some(b => b.type === block.type)) {
          setDroppedBlocks([...droppedBlocks, block])
        }
      }
      setDraggedBlock(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }

    // Удаление блока с холста
    const removeBlock = (type: string) => {
      setDroppedBlocks(droppedBlocks.filter(b => b.type !== type))
    }

    // Отслеживаем движение мыши по всему экрану во время перетаскивания
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          setDragPosition({ x: e.clientX, y: e.clientY })
        }
      }
      
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, [isDragging])

    return (
      <div className="editor">
        <header className="editor-header">
          <div className="logo">
            <img src="/logo.svg" alt="dev/folio" className="logo-icon" onError={(e) => e.currentTarget.style.display = 'none'} />
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

        <div className="editor-main">
          {/* Левая панель */}
          <aside className="sidebar">
            <h2>Элементы конструктора</h2>
            <p className="hint">Перетащите блоки для создания портфолио</p>
            <div className="blocks-list">
              {blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="block-card draggable"
                  style={{ backgroundColor: block.bg }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                >
                  <div className="block-color-square" style={{ backgroundColor: block.square }}></div>
                  <div className="block-text">
                    <strong>{block.name}</strong>
                    <small>{block.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Центральная область (холст) */}
          <main
            className={`canvas ${isDragging ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {droppedBlocks.length === 0 ? (
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
            ) : (
              <div className="dropped-blocks-container">
                {droppedBlocks.map((block, idx) => (
                  <div key={idx} className="dropped-card-wrapper fade-in">
                    <div className="dropped-card" style={{ backgroundColor: block.bg }}>
                      <div className="dropped-color-square" style={{ backgroundColor: block.square }}></div>
                      <div className="dropped-text">
                        <strong>{block.name}</strong>
                        <p>{block.desc}</p>
                      </div>
                      <button 
                        className="remove-block-btn"
                        onClick={() => removeBlock(block.type)}
                        title="Удалить блок"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Визуальный элемент, следующий за курсором */}
        {isDragging && draggedBlock && (
          <div
            className="drag-cursor-block"
            style={{
              left: dragPosition.x - 10,
              top: dragPosition.y - 10,
              backgroundColor: draggedBlock.bg
            }}
          >
            <div className="drag-cursor-square" style={{ backgroundColor: draggedBlock.square }}></div>
            <div className="drag-cursor-text">
              <strong>{draggedBlock.name}</strong>
            </div>
          </div>
        )}
      </div>
    )
  }

  export default Editor