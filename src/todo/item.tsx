import React, { useState } from 'react';
// IFは別コンポーネントで定義
import { TodoItemProps } from './types';

// 2. 子：Propsとしてデータを受け取る
// 3のuseStateの更新でontToggle追加
export default function TodoItem({ id, text, completed, priority, onToggle, onDelete, onEdit }: TodoItemProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  // 保存時に文字が変わらないバグが発生したので追加
  const startEditing = () => {
    setEditText(text); 
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(id, editText);
    setIsEditing(false); // 編集モードを終了
  };
  
  return (
    <div className={`todo-item priority-${priority}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />

      {isEditing ? (
        <div className="edit-section">
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave} className="save-button">保存</button>
          <button onClick={() => { setIsEditing(false); setEditText(text); }} className="cancel-button">キャンセル</button>
        </div>
      ) : (
        <div className="todo-content">
          <span className="todo-text" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
            {text}
          </span>

          <span className="priority-label">{priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}</span>

          <div className="todo-actions">
            <button onClick={startEditing} className="edit-button">編集</button>
            <button onClick={() => onDelete(id)} className="delete-button">削除</button>
          </div>
        </div>
      )}
    </div>
  );
}