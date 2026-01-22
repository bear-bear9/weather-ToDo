import React from 'react';
// IFは別コンポーネントで定義
import { TodoHeaderProps } from './types';

function TodoHeader({ title, totalCount, completedCount, activeCount }: TodoHeaderProps) {

  return (
    <div className="todo-header">
      <h1>{title}</h1>
      <div className="todo-stats">
        {/* Propsをそのまま表示。これでチラつきません */}
        <span>総数: {totalCount}</span>
        <span>完了: {completedCount}</span>
        <span>未完了: {activeCount}</span>
      </div>
    </div>
  );
}
export default TodoHeader;