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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    touchAction: 'none',
  };

  const column = KANBAN_COLUMNS.find(c => c.status === task.status);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onSelect(task)} className={`bg-white rounded-md p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 border-t-4 cursor-grab active:cursor-grabbing ${column?.cardBorderClass}`}>
      <p className="text-gray-800 wrap-break-word">{task.title}</p>
      <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-200">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task); }}
          className="shrink-0 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
