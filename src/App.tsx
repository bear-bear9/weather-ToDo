import React from 'react';
import TodoPage from './todo/page';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* 天気アプリを表示：総数が変更できなくなるバグが発生したためTodoにネスト */}
      {/* Todoアプリを表示 */}
      <TodoPage />
    </div>
  );
}

export default App;
