export type Status = 'a fazer' | 'em progresso' | 'concluída';

export interface Task {
  id: number;
  title: string;
  status: Status;
  description?: string;
}

export interface KanbanColumn {
  title: string;
  status: Status;
  headerBgClass: string;
  cardBorderClass: string;
}

export interface KanbanColumnComponentProps {
  column: KanbanColumn;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export interface SortableTaskProps {
  task: Task;
  onSelect: (task: Task) => void;
  onDelete: (task: Task) => void;
}