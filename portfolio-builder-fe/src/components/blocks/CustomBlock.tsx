import React, { useState, useRef, useEffect } from 'react';

export interface ICustomElement {
  id: string;
  type: 'title' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

// ДОБАВИЛИ readOnly и сделали onChange необязательным
export const CustomBlock = ({ content, onChange, readOnly }: { content: any, onChange?: (data: any) => void, readOnly?: boolean }) => {
  const [elements, setElements] = useState<ICustomElement[]>(content?.elements || []);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (onChange) onChange({ elements });
  }, [elements]);

  const addElement = (type: 'title' | 'text', defaultContent: string, width: number, height: number) => {
    const newEl: ICustomElement = {
      id: Date.now().toString(),
      type,
      x: 40,
      y: 40,
      width,
      height,
      content: defaultContent
    };
    setElements([...elements, newEl]);
    setActiveId(newEl.id);
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newEl: ICustomElement = {
            id: Date.now().toString(),
            type: 'image',
            x: 80,
            y: 80,
            width: 250,
            height: 250,
            content: event.target?.result as string
          };
          setElements([...elements, newEl]);
          setActiveId(newEl.id);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateElement = (id: string, updates: Partial<ICustomElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  return (
    <div className="custom-block-container" onMouseDown={() => !readOnly && setActiveId(null)}>
      
      {/* Прячем тулбар в режиме readOnly */}
      {!readOnly && (
        <div className="custom-toolbar" onMouseDown={e => e.stopPropagation()}>
          <div className="custom-toolbar-buttons">
            <button onClick={() => addElement('title', 'Хобби и увлечения', 350, 60)} className="custom-toolbar-btn">
              <span className="btn-icon">T</span> Добавить заголовок
            </button>
            <button onClick={() => addElement('text', 'В свободное от написания кода время я увлекаюсь...', 350, 120)} className="custom-toolbar-btn">
              <span className="btn-icon" style={{ fontWeight: 400 }}>T</span> Добавить текст
            </button>
            <button onClick={addImage} className="custom-toolbar-btn">
              Добавить изображение
            </button>
          </div>
          <span className="custom-toolbar-hint">Элементы можно перемещать и растягивать</span>
        </div>
      )}

      {/* Холст */}
      <div className="custom-canvas-area" style={{ border: readOnly ? 'none' : '1.5px dashed #d1d5db' }}>
        {elements.map(el => (
          <DraggableItem
            key={el.id}
            item={el}
            isActive={!readOnly && activeId === el.id}
            onSelect={() => !readOnly && setActiveId(el.id)}
            updateItem={updateElement}
            removeItem={removeElement}
            readOnly={readOnly} // Передаем readOnly внутрь элемента
          />
        ))}
      </div>
    </div>
  );
};

// --- Вспомогательный компонент ---
const DraggableItem = ({ item, isActive, onSelect, updateItem, removeItem, readOnly }: any) => {
  const [pos, setPos] = useState({ x: item.x, y: item.y });
  const [size, setSize] = useState({ w: item.width, h: item.height });
  
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  
  const dragStart = useRef({ x: 0, y: 0, w: 0, h: 0, posX: 0, posY: 0 });

  const startDrag = (e: React.MouseEvent) => {
    if (readOnly) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h, posX: pos.x, posY: pos.y };
  };

  const handleWrapperMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    onSelect();
    if (item.type === 'image') {
      startDrag(e);
    }
  };

  const handleDragHandleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    onSelect();
    startDrag(e);
  };

  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    if (readOnly) return;
    e.stopPropagation();
    onSelect();
    setResizeDir(dir);
    dragStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h, posX: pos.x, posY: pos.y };
  };

  useEffect(() => {
    if (readOnly) return; // Если readOnly, даже не вешаем обработчики

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({
          x: dragStart.current.posX + (e.clientX - dragStart.current.x),
          y: dragStart.current.posY + (e.clientY - dragStart.current.y)
        });
      } else if (resizeDir) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        let newW = dragStart.current.w;
        let newH = dragStart.current.h;
        let newX = dragStart.current.posX;
        let newY = dragStart.current.posY;

        if (resizeDir.includes('e')) newW += dx;
        if (resizeDir.includes('s')) newH += dy;
        if (resizeDir.includes('w')) { newW -= dx; newX += dx; }
        if (resizeDir.includes('n')) { newH -= dy; newY += dy; }

        newW = Math.max(50, newW);
        newH = Math.max(30, newH);

        setPos({ x: newX, y: newY });
        setSize({ w: newW, h: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging || resizeDir) {
        setIsDragging(false);
        setResizeDir(null);
        updateItem(item.id, { x: pos.x, y: pos.y, width: size.w, height: size.h });
      }
    };

    if (isDragging || resizeDir) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resizeDir, pos, size, item.id, updateItem, readOnly]);

  return (
    <div
      className={`custom-draggable-item ${isActive ? 'active' : ''}`}
      style={{ 
        left: pos.x, 
        top: pos.y, 
        width: size.w, 
        height: size.h,
        cursor: readOnly ? 'default' : (isDragging ? 'grabbing' : 'grab') // Меняем курсор в публичном виде
      }}
      onMouseDown={handleWrapperMouseDown}
    >
      {isActive && !readOnly && (
        <>
          <button
            className="custom-item-delete"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
          >
            ✕
          </button>
          
          {item.type !== 'image' && (
            <div className="custom-drag-handle" onMouseDown={handleDragHandleMouseDown}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="#3b82f6">
                <path d="M4 2h2v2H4zm6 0h2v2h-2zm-6 5h2v2H4zm6 0h2v2h-2zm-6 5h2v2H4zm6 0h2v2h-2z"/>
              </svg>
            </div>
          )}
        </>
      )}

      {/* Точки ресайза только если активен и не readOnly */}
      {!readOnly && (
        <>
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}

      {item.type === 'image' ? (
        <img src={item.content} alt="custom" className="custom-image-item" draggable={false} />
      ) : (
        <textarea
          className={`custom-text-input ${item.type === 'title' ? 'title' : 'body'}`}
          value={item.content}
          readOnly={readOnly} // Запрещаем печатать текст в публичном виде
          onChange={(e) => updateItem(item.id, { content: e.target.value })}
          onMouseDown={(e) => {
            if (!readOnly) {
              onSelect();
              e.stopPropagation();
            }
          }}
          placeholder={readOnly ? '' : "Введите текст..."}
          style={{ cursor: readOnly ? 'text' : 'text' }}
        />
      )}
    </div>
  );
};