import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortableTask } from './SortableTask';
import type { KanbanColumnComponentProps } from '../types';

export function KanbanColumnComponent({ column, tasks, onSelectTask, onDeleteTask }: KanbanColumnComponentProps) {
  const { setNodeRef } = useDroppable({ id: column.status });
  const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-lg shadow-md">
      <h2 className={`text-lg font-semibold text-white p-3 rounded-t-lg ${column.headerBgClass}`}>
        {column.title}
      </h2>
      <div className="p-4 space-y-4 min-h-[200px]">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onSelect={onSelectTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
