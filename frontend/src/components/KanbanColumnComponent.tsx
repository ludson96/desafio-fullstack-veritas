import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortableTask } from './SortableTask';
import type { KanbanColumnComponentProps } from '../types';

export function KanbanColumnComponent({ column, tasks, onSelectTask, onDeleteTask }: KanbanColumnComponentProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col ${column.colBackgroundClass || 'bg-slate-200'} border ${column.colBorderClass || 'border-slate-300'} rounded-2xl p-3.5 transition-colors duration-150 shadow-xs ${
        isOver ? 'ring-2 ring-slate-400' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1.5 py-1.5 mb-2.5">
        <div className="flex items-center gap-2">
          {column.dotClass && <span className={`w-2.5 h-2.5 rounded-full ${column.dotClass}`} />}
          <h2 className="text-sm font-bold text-slate-100 tracking-tight">
            {column.title}
          </h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${column.badgeClass || 'bg-slate-700 text-slate-200'}`}>
          {tasks.length}
        </span>
      </div>

      {/* Cards Area */}
      <div className="flex-1 flex flex-col space-y-2.5 min-h-[260px]">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onSelect={onSelectTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700/80 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-300 font-medium">Nenhuma tarefa aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

