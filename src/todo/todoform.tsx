import React, { useState } from 'react';
import { TodoFormProps } from './types';

export function TodoForm({ onAddTodo, onCompleteAll, onDeleteAll }: TodoFormProps & { onCompleteAll: () => void, onDeleteAll: () => void }) {
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium'
  });
  const [error, setError] = useState('');

  // React.ChangeEvent: 入力内容が変わったときに使う型。
  // React.FormEvent: フォームを送信したときに使う型。
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // エラーをクリア
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // バリデーション
    if (!formData.text.trim()) {
      setError('TODOの内容を入力してください');
      return;
    }

    if (formData.text.length > 100) {
      setError('TODOの内容は100文字以下で入力してください');
      return;
    }

    // 新しいTODOを作成
    // コンパイルエラー発生個所：tsは配列内を明確にしないと怒られる
    // priorityはjavaだったらそのままの記述でいいが
    // tsはasを使って優先度の種類を指定する
    const newTodo = {
      id: Date.now(),
      text: formData.text.trim(),
      completed: false,
      priority: formData.priority as "low" | "medium" | "high"
    };

    // 親コンポーネントに新しいTODOを渡す
    onAddTodo(newTodo);

    // フォームをリセット
    setFormData({
      text: '',
      priority: 'medium'
    });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        name="text"
        value={formData.text}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
        placeholder="ここにToDoを入力してください！"
        className="todo-input"
        style={{ width: '100%', marginBottom: '4px' }}
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{
            width: '110px',
            height: '40px',
            borderRadius: '8px'
          }}
        >
          <option value="low">優先度:低</option>
          <option value="medium">優先度:中</option>
          <option value="high">優先度:高</option>
        </select>
        <button
          type="submit"
          style={{ flex: 2, height: '40px', backgroundColor: '#007bff', color: '#fff', borderRadius: '8px', fontWeight: 'bold' }}
        >
          追加
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button type="button" onClick={onCompleteAll} style={{ flex: 1, fontSize: '10px', padding: '0', border: '1px solid #ddd', borderRadius: '4px' }}>一括完了</button>
          <button type="button" onClick={onDeleteAll} style={{ flex: 1, fontSize: '10px', padding: '0', border: '1px solid #ffcccc', color: '#ff4444', borderRadius: '4px' }}>一括削除</button>
        </div>
      </div>
      {error && <p style={{ color: 'red', fontSize: '10px', marginTop: '2px', textAlign: 'center' }}>{error}</p>}
    </form>
  );
}