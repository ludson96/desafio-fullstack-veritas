import type { KanbanColumn } from '../types';

export const KANBAN_COLUMNS: readonly KanbanColumn[] = [
  {
    title: 'A Fazer',
    status: 'a fazer',
    headerBgClass: 'bg-[#4F46E5]',
    cardBorderClass: 'border-l-[#4F46E5]',
    badgeClass: 'bg-[#4F46E5] text-white border border-[#6366f1]',
    dotClass: 'bg-[#4F46E5]',
    colBackgroundClass: 'bg-[#1e2742]',
    colBorderClass: 'border-[#2d3a60]',
  },
  {
    title: 'Em Progresso',
    status: 'em progresso',
    headerBgClass: 'bg-amber-500',
    cardBorderClass: 'border-l-amber-500',
    badgeClass: 'bg-amber-500 text-slate-950 font-bold border border-amber-400',
    dotClass: 'bg-amber-500',
    colBackgroundClass: 'bg-[#2d241c]',
    colBorderClass: 'border-[#4a3928]',
  },
  {
    title: 'Concluídas',
    status: 'concluída',
    headerBgClass: 'bg-emerald-500',
    cardBorderClass: 'border-l-emerald-500',
    badgeClass: 'bg-emerald-500 text-slate-950 font-bold border border-emerald-400',
    dotClass: 'bg-emerald-500',
    colBackgroundClass: 'bg-[#192f27]',
    colBorderClass: 'border-[#265343]',
  },
];

