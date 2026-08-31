export type Status = 'a fazer' | 'em progresso' | 'concluída';
export type Priority = 'baixa' | 'média' | 'alta';
export type Category = 'Geral' | 'Frontend' | 'Backend' | 'Design' | 'Bug' | 'Melhoria';
export type ViewMode = 'kanban' | 'list';

export interface Task {
  id: number;
  title: string;
  status: Status;
  description?: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string;
}

export interface KanbanColumn {
  title: string;
  status: Status;
  headerBgClass: string;
  cardBorderClass: string;
  badgeClass?: string;
  dotClass?: string;
  colBackgroundClass?: string;
  colBorderClass?: string;
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