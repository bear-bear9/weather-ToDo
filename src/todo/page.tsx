import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
import TodoHeader from './header';
import TodoItem from './item';
import { TodoForm } from './todoform';
import TodoFilter from './todofilter';
import './layout.css'
import WeatherPage from '../weather/page';

export default function TodoPage() {

  // ローカルストレージ化
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<FilterType>('all');

  // 💡 【超重要】ここを関数の冒頭（returnより前）に配置してください
  // これにより、追加・削除・チェックのたびに「最新の数字」がここで作られ、下のコンポーネントに配られます
  const totalCount = todos.length;
  const currentCompletedCount = todos.filter(t => t.completed).length;
  const activeCount = totalCount - currentCompletedCount;

  // バグ発生個所
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    // 依存配列により変化を監視
  }, [todos]);

  // TODOの完了状態を反転させる
  const toggleTodo = (id: any) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos([...updated]);
  };

  // TODO追加メソッド
  // バグ発生個所：ローカルストレージ対応後、TODOを追加しても総数が増えない
  // リロードすると正常の値になるため非同期動作を確認
  const addTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  // 削除ボタンが押された時の処理
  const deleteTodo = (id: number) => {
    // filterを使って「クリックされたID以外」を残す = 削除
    const newTodos = todos.filter(t => t.id !== id);
    setTodos([...newTodos]);
  };

  // 保存ボタンが押された時の処理
  // バグ発生個所：保存時にstateが更新されず、編集内容が反映されなかった

  // 編集ボタンを押した瞬間にsetEditText(text)を実行して、最新の文字を同期させるようにしました。
  const editTodo = (id: number, newText: string) => {
    setTodos(prev => [...prev.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    )]);
  };

  // フィルタリングされたTODOリスト
  const todoFiltermethod = todos.filter((todo: Todo) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <WeatherPage
        key="weather-stable"
        totalCount={todos.length}
        uncompletedCount={todos.filter(t => !t.completed).length}
      />
      {/* バグ発生個所：動的キーにしないとヘッダーのカウントがリアルタイムで更新できなかった */}
      <TodoHeader
        key={`header-${todos.length}-${todos.filter(t => t.completed).length}`}
        title="ToDo with 天気"
        totalCount={todos.length}
        completedCount={todos.filter(t => t.completed).length}
        activeCount={todos.length - todos.filter(t => t.completed).length}
      />
      <TodoForm onAddTodo={addTodo} />
      {/* バグ発生個所：動的キーにしないとヘッダーのカウントがリアルタイムで更新できなかった */}
      <TodoFilter
        key={`filter-${todos.length}-${todos.filter(t => t.completed).length}`}
        totalCount={todos.length}
        activeCount={todos.length - todos.filter(t => t.completed).length}
        completedCount={todos.filter(t => t.completed).length}
        filter={filter}
        onFilterChange={setFilter}
      />
      <div className="todo-list">
        {todoFiltermethod.map(todo => (
          <TodoItem key={todo.id} {...todo} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={editTodo} />
        ))}
      </div>
    </div>
  );
}