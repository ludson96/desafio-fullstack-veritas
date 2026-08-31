import type { Status, Task } from '../types';

interface ListViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateStatus: (task: Task, newStatus: Status) => void;
  onDeleteTask: (task: Task) => void;
}

export function ListView({ tasks, onSelectTask, onUpdateStatus, onDeleteTask }: ListViewProps) {
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'a fazer':
        return 'bg-[#1e2238] text-indigo-300 border-[#2c2f55]';
      case 'em progresso':
        return 'bg-[#292218] text-amber-300 border-[#423218]';
      case 'concluída':
        return 'bg-[#14261f] text-emerald-300 border-[#1b3d2f]';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-rose-950/50 text-rose-300 border-rose-800/60 font-semibold';
      case 'média':
        return 'bg-amber-950/50 text-amber-300 border-amber-800/60 font-medium';
      case 'baixa':
        return 'bg-slate-800 text-slate-300 border-slate-700 font-medium';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#1e293b] text-slate-500 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-100">Nenhuma tarefa encontrada</h3>
        <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros ou crie uma nova tarefa.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111726] border border-[#1e293b] rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#161f32] border-b border-[#1e293b] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Tarefa</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Prioridade</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b] text-xs">
            {tasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="hover:bg-[#161f32] cursor-pointer transition-colors group"
              >
                {/* Title & Description */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100 leading-snug">{task.title}</div>
                  {task.description && (
                    <p className="text-slate-400 text-[11px] truncate max-w-xs sm:max-w-md mt-0.5">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Status Dropdown */}
                <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateStatus(task, e.target.value as Status)}
                    className={`text-[11px] font-semibold border rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    <option value="a fazer" className="bg-[#111726]">A Fazer</option>
                    <option value="em progresso" className="bg-[#111726]">Em Progresso</option>
                    <option value="concluída" className="bg-[#111726]">Concluída</option>
                  </select>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] uppercase tracking-wider ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority || 'baixa'}
                  </span>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1e293b] text-slate-300 border border-[#334155] text-[11px] font-medium">
                    {task.category || 'Geral'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectTask(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-lg transition"
                      title="Editar detalhes"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteTask(task)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                      title="Excluir tarefa"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
