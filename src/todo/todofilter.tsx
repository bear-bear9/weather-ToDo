import React from 'react';
import { TodoFilterProps } from './types';

function TodoFilter({
  filter,
  onFilterChange,
  totalCount,
  activeCount,
  completedCount
}: TodoFilterProps) {
  return (
    <div className="todo-filter">
      <button
        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        すべて ({totalCount})
      </button>
      <button
        className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
        onClick={() => onFilterChange('pending')}
      >
        未完了 ({activeCount})
      </button>
      <button
        className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        完了済み ({completedCount})
      </button>
    </div>
  );
}

export default TodoFilter;