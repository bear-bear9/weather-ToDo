import React, { useState } from 'react';
import { TodoFormProps } from './types';

export　function TodoForm({ onAddTodo }: TodoFormProps) {
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium'
  });
  const [error, setError] = useState('');

  // React.ChangeEvent: 入力内容が変わったときに使う型。
  // /React.FormEvent: フォームを送信したときに使う型。
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
      <div className="form-group">
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="新しいTODOを入力してください"
          className="todo-input"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="priority-select"
        >
          <option value="low">低優先度</option>
          <option value="medium">中優先度</option>
          <option value="high">高優先度</option>
        </select>
        <button type="submit" className="add-button">
          追加
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}