interface MetricsBarProps {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export function MetricsBar({ total, todo, inProgress, done }: MetricsBarProps) {
  const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Total */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total de Tarefas
          </span>
          <div className="w-6 h-6 rounded-lg bg-[#1e293b] text-indigo-400 flex items-center justify-center text-xs font-bold">
            #
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-100">{total}</span>
          <span className="text-xs text-slate-500">no workspace</span>
        </div>
      </div>

      {/* Metric 2: A Fazer */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            A Fazer
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-100">{todo}</span>
          <span className="text-xs text-indigo-300 bg-[#1e2238] px-2 py-0.5 rounded-md font-medium border border-[#2c2f55]">
            Pendentes
          </span>
        </div>
      </div>

      {/* Metric 3: Em Andamento */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Em Andamento
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-100">{inProgress}</span>
          <span className="text-xs text-amber-300 bg-[#292218] px-2 py-0.5 rounded-md font-medium border border-[#423218]">
            Em execução
          </span>
        </div>
      </div>

      {/* Metric 4: Taxa de Conclusão */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Taxa de Conclusão
          </span>
          <span className="text-xs font-bold text-emerald-300 bg-[#14261f] px-2 py-0.5 rounded-md border border-[#1b3d2f]">
            {completionPercentage}%
          </span>
        </div>
        <div>
          <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
            <span>{done} finalizadas</span>
            <span>{total - done} restantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
