import { useState, useEffect, type FormEvent } from 'react';
import type { Category, Priority, Status, Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<void>;
  initialTask?: Task | null;
  mode: 'create' | 'edit';
}

export function TaskModal({ isOpen, onClose, onSave, initialTask, mode }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('a fazer');
  const [priority, setPriority] = useState<Priority>('média');
  const [category, setCategory] = useState<Category>('Geral');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask && mode === 'edit') {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'a fazer');
      setPriority(initialTask.priority || 'média');
      setCategory(initialTask.category || 'Geral');
    } else {
      setTitle('');
      setDescription('');
      setStatus('a fazer');
      setPriority('média');
      setCategory('Geral');
    }
    setValidationError(null);
  }, [initialTask, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('O título da tarefa é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...(initialTask ? { id: initialTask.id } : {}),
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category,
      });
      onClose();
    } catch (err) {
      setValidationError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111726] rounded-2xl shadow-xl border border-[#1e293b] p-6 w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-100 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e293b]">
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            {mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-[#1e293b] transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {validationError && (
          <div className="mb-4 p-3 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Desenvolver nova rota de autenticação"
              className="w-full px-3.5 py-2 text-sm font-medium text-slate-100 bg-[#1e293b] border border-[#334155] rounded-xl focus:bg-[#161f32] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 text-xs text-slate-200 bg-[#1e293b] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="a fazer" className="bg-[#1e293b]">A Fazer</option>
                <option value="em progresso" className="bg-[#1e293b]">Em Progresso</option>
                <option value="concluída" className="bg-[#1e293b]">Concluída</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs text-slate-200 bg-[#1e293b] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="alta" className="bg-[#1e293b]">Alta</option>
                <option value="média" className="bg-[#1e293b]">Média</option>
                <option value="baixa" className="bg-[#1e293b]">Baixa</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 text-xs text-slate-200 bg-[#1e293b] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="Geral" className="bg-[#1e293b]">Geral</option>
                <option value="Frontend" className="bg-[#1e293b]">Frontend</option>
                <option value="Backend" className="bg-[#1e293b]">Backend</option>
                <option value="Design" className="bg-[#1e293b]">Design</option>
                <option value="Bug" className="bg-[#1e293b]">Bug</option>
                <option value="Melhoria" className="bg-[#1e293b]">Melhoria</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione contexto, requisitos ou observações..."
              rows={4}
              className="w-full px-3.5 py-2 text-xs text-slate-200 bg-[#1e293b] border border-[#334155] rounded-xl focus:bg-[#161f32] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1e293b] text-slate-300 hover:bg-[#334155] text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white disabled:opacity-50 text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Tarefa' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
