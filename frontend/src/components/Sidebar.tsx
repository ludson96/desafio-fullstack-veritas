import type { Status, ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  statusFilter: Status | 'all';
  onStatusFilterChange: (status: Status | 'all') => void;
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  onOpenNewTask: () => void;
}

export function Sidebar({
  currentView,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  taskCounts,
  onOpenNewTask,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[#111726] border-r border-[#1e293b] flex flex-col shrink-0 h-screen sticky top-0 text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1e293b] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] shadow-xs flex items-center justify-center p-2 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="5" height="16" rx="2" fill="#4F46E5" />
            <rect x="9.5" y="4" width="5" height="12" rx="2" fill="#f59e0b" />
            <rect x="16" y="4" width="5" height="8" rx="2" fill="#10b981" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 leading-none">TaskFlow</h1>
          <p className="text-[11px] text-slate-400 mt-1">Workspace Profissional</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={onOpenNewTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {/* Views */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Visualizações
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onViewChange('kanban')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                currentView === 'kanban'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <span>Quadro Kanban</span>
              </div>
            </button>

            <button
              onClick={() => onViewChange('list')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                currentView === 'list'
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Tabela / Lista</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Status Filter */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Filtrar por Status
          </p>
          <div className="space-y-1">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#1e293b] text-slate-100 font-semibold'
                  : 'text-slate-400 hover:bg-[#161f32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Todas</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#2d3748] text-slate-300 font-semibold">
                {taskCounts.total}
              </span>
            </button>

            <button
              onClick={() => onStatusFilterChange('a fazer')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                statusFilter === 'a fazer'
                  ? 'bg-[#1e2238] text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:bg-[#161f32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                <span>A Fazer</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#2c2f55] text-indigo-200 font-semibold">
                {taskCounts.todo}
              </span>
            </button>

            <button
              onClick={() => onStatusFilterChange('em progresso')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                statusFilter === 'em progresso'
                  ? 'bg-[#292218] text-amber-300 font-semibold'
                  : 'text-slate-400 hover:bg-[#161f32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Em Progresso</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#423218] text-amber-200 font-semibold">
                {taskCounts.inProgress}
              </span>
            </button>

            <button
              onClick={() => onStatusFilterChange('concluída')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                statusFilter === 'concluída'
                  ? 'bg-[#14261f] text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:bg-[#161f32]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Concluídas</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#1b3d2f] text-emerald-200 font-semibold">
                {taskCounts.done}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Status Indicator */}
      <div className="p-4 border-t border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-slate-400 font-medium">Servidor Online</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">v1.2</span>
      </div>
    </aside>
  );
}
