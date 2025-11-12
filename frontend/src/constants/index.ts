import type { KanbanColumn } from '../types';

export const KANBAN_COLUMNS: readonly KanbanColumn[] = [
  {
    title: 'A Fazer',
    status: 'a fazer',
    headerBgClass: 'bg-blue-500',
    cardBorderClass: 'border-t-blue-500'
  },
  {
    title: 'Em Progresso',
    status: 'em progresso',
    headerBgClass: 'bg-amber-500',
    cardBorderClass: 'border-t-amber-500'
  },
  { title: 'Concluídas', status: 'concluída', headerBgClass: 'bg-green-500', cardBorderClass: 'border-t-green-500' },
];
