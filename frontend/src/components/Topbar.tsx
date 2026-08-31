import type { Category, Priority } from '../types';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
  categoryFilter: Category | 'all';
  onCategoryFilterChange: (category: Category | 'all') => void;
  onOpenNewTask: () => void;
}

export function Topbar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onOpenNewTask,
}: TopbarProps) {
  return (
    <header className="bg-[#111726] border-b border-[#1e293b] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs text-slate-200">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tarefas por título ou descrição... (tecle /)"
          className="w-full pl-9.5 pr-4 py-2 bg-[#1e293b] border border-[#334155] rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:bg-[#161f32] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Options and Actions */}
      <div className="flex items-center gap-2.5">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Prioridade:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
            className="text-xs bg-[#1e293b] border border-[#334155] rounded-xl px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
          >
            <option value="all" className="bg-[#1e293b]">Todas as prioridades</option>
            <option value="alta" className="bg-[#1e293b]">Alta</option>
            <option value="média" className="bg-[#1e293b]">Média</option>
            <option value="baixa" className="bg-[#1e293b]">Baixa</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Categoria:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value as Category | 'all')}
            className="text-xs bg-[#1e293b] border border-[#334155] rounded-xl px-2.5 py-1.5 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
          >
            <option value="all" className="bg-[#1e293b]">Todas as categorias</option>
            <option value="Frontend" className="bg-[#1e293b]">Frontend</option>
            <option value="Backend" className="bg-[#1e293b]">Backend</option>
            <option value="Design" className="bg-[#1e293b]">Design</option>
            <option value="Bug" className="bg-[#1e293b]">Bug</option>
            <option value="Melhoria" className="bg-[#1e293b]">Melhoria</option>
            <option value="Geral" className="bg-[#1e293b]">Geral</option>
          </select>
        </div>

        {/* Create Task Button */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Criar Tarefa</span>
        </button>
      </div>
    </header>
  );
}
