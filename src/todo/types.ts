export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

// ここに論理演算子をつけていたことでバグが発生しました
// 型定義はあいまいではなくちゃんとすること
export type TodoItemProps = Todo & {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
};

export type TodoHeaderProps = {
  title: string;
  totalCount: number;
  completedCount: number;
  activeCount: number
};

// form定義のため
export interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

export type FilterType = 'all' | 'pending' | 'completed';

export interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}