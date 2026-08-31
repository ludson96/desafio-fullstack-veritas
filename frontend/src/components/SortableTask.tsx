import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SortableTaskProps } from '../types';
import { KANBAN_COLUMNS } from '../constants';

export function SortableTask({ task, onSelect, onDelete }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 30 : 'auto',
    touchAction: 'none',
  };

  const column = KANBAN_COLUMNS.find((c) => c.status === task.status);

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-rose-900/60 text-rose-200 border-rose-600/80 font-bold';
      case 'média':
        return 'bg-amber-900/60 text-amber-200 border-amber-600/80 font-bold';
      case 'baixa':
        return 'bg-slate-700 text-slate-100 border-slate-600 font-medium';
      default:
        return 'bg-slate-700 text-slate-200 border-slate-600';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(task)}
      className={`group relative bg-[#182234] rounded-xl p-3 border border-[#2e3d5b] shadow-sm hover:border-[#4F46E5] hover:bg-[#1e2b42] transition-all duration-150 cursor-grab active:cursor-grabbing ${
        column?.cardBorderClass ? `border-l-4 ${column.cardBorderClass}` : ''
      }`}
    >
      {/* Top row: Badges + Delete Button (render only if there are badges or on hover) */}
      {(task.category || task.priority) ? (
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.category && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#25334d] text-slate-100 border border-[#3b4e72]">
                {task.category}
              </span>
            )}
            {task.priority && (
              <span
                className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${getPriorityStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            title="Excluir tarefa"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-rose-300 hover:bg-rose-950/60 rounded-md focus:opacity-100 focus:outline-none shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          title="Excluir tarefa"
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-rose-300 hover:bg-rose-950/60 rounded-md focus:opacity-100 focus:outline-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      {/* Task Title */}
      <p className="text-xs font-bold text-white break-words leading-tight">
        {task.title}
      </p>

      {/* Description Snippet */}
      {task.description && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-300">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="truncate">{task.description}</span>
        </div>
      )}
    </div>
  );
}


