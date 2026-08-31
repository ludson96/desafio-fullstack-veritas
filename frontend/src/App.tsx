import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import type { Category, Priority, Status, Task, ViewMode } from './types';
import { SortableTask } from './components/SortableTask';
import { KanbanColumnComponent } from './components/KanbanColumnComponent';
import { KANBAN_COLUMNS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MetricsBar } from './components/MetricsBar';
import { ListView } from './components/ListView';
import { TaskModal } from './components/TaskModal';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Views State
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  // Modals State
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Keyboard shortcut for / to focus search and N for new task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNewTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const newTask = {
      title: taskData.title || '',
      status: taskData.status || 'a fazer',
      description: taskData.description || '',
      priority: taskData.priority || 'média',
      category: taskData.category || 'Geral',
    };

    await createTask(newTask as Task);
    await fetchTasks();
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!taskData.id) return;
    await updateTask(taskData as Task);
    setSelectedTask(null);
    await fetchTasks();
  };

  const handleUpdateTaskStatus = async (task: Task, newStatus: Status) => {
    const updated = { ...task, status: newStatus };
    setTasks((current) => current.map((t) => (t.id === task.id ? updated : t)));
    try {
      await updateTask(updated);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
      await fetchTasks();
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'task';
    if (!isActiveATask) return;

    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    const isOverAColumn = KANBAN_COLUMNS.some((c) => c.status === overId);

    if (isOverAColumn) {
      if (activeTaskObj.status !== overId) {
        const updatedTasks = tasks.map((t) =>
          t.id === activeId ? { ...t, status: overId as Status } : t
        );
        setTasks(updatedTasks);
        handleUpdateTaskStatus(activeTaskObj, overId as Status);
      }
    } else {
      const isOverATask = over.data.current?.type === 'task';
      if (isOverATask) {
        const overTask = tasks.find((t) => t.id === overId);
        if (overTask && activeTaskObj.status !== overTask.status) {
          const updatedTasks = tasks.map((t) =>
            t.id === activeId ? { ...t, status: overTask.status } : t
          );
          setTasks(updatedTasks);
          handleUpdateTaskStatus(activeTaskObj, overTask.status);
        } else if (overTask && activeTaskObj.status === overTask.status) {
          setTasks((currentTasks) => {
            const activeIndex = currentTasks.findIndex((t) => t.id === activeId);
            const overIndex = currentTasks.findIndex((t) => t.id === overId);
            if (activeIndex === -1 || overIndex === -1) return currentTasks;
            return arrayMove(currentTasks, activeIndex, overIndex);
          });
        }
      }
    }
    setActiveTask(null);
  };

  // Filtered Tasks Calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = (task.description || '').toLowerCase().includes(q);
        const matchesCat = (task.category || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && (task.priority || 'baixa') !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && (task.category || 'Geral') !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Task Counts for Sidebar & Metrics
  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'a fazer').length,
      inProgress: tasks.filter((t) => t.status === 'em progresso').length,
      done: tasks.filter((t) => t.status === 'concluída').length,
    };
  }, [tasks]);

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-[#4F46E5] selection:text-white antialiased font-sans">
      {/* Sidebar */}
      <Sidebar
        currentView={viewMode}
        onViewChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        taskCounts={taskCounts}
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Mini-Dashboard Metrics */}
          <MetricsBar {...taskCounts} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200 text-xs font-bold">
                ✕
              </button>
            </div>
          )}

          {/* Active Filter Indicators */}
          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="mb-4 flex items-center justify-between bg-[#111726] border border-[#1e293b] rounded-xl px-4 py-2 text-xs text-slate-300 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-100">Filtros ativos:</span>
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-[#1e293b] text-indigo-300 border border-[#334155]">
                    Busca: "{searchQuery}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-[#1e293b] text-indigo-300 border border-[#334155]">
                    Status: {statusFilter}
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-[#1e293b] text-indigo-300 border border-[#334155]">
                    Prioridade: {priorityFilter}
                  </span>
                )}
                {categoryFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-[#1e293b] text-indigo-300 border border-[#334155]">
                    Categoria: {categoryFilter}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-xs font-semibold text-[#818cf8] hover:underline ml-3 cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* View Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-7 h-7 border-2 border-slate-700 border-t-[#4F46E5] rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-slate-400 font-semibold">Carregando tarefas...</p>
            </div>
          ) : viewMode === 'kanban' ? (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              {(() => {
                const visibleColumns =
                  statusFilter === 'all'
                    ? KANBAN_COLUMNS
                    : KANBAN_COLUMNS.filter((c) => c.status === statusFilter);

                return (
                  <div
                    className={`grid gap-5 ${
                      visibleColumns.length === 1
                        ? 'grid-cols-1 max-w-xl mx-auto'
                        : 'grid-cols-1 md:grid-cols-3'
                    }`}
                  >
                    {visibleColumns.map((column) => {
                      const columnTasks = filteredTasks.filter(
                        (task) => task.status === column.status
                      );
                      return (
                        <KanbanColumnComponent
                          key={column.status}
                          column={column}
                          tasks={columnTasks}
                          onSelectTask={setSelectedTask}
                          onDeleteTask={setTaskToDelete}
                        />
                      );
                    })}
                  </div>
                );
              })()}
              <DragOverlay>
                {activeTask ? (
                  <SortableTask
                    task={activeTask}
                    onSelect={() => {}}
                    onDelete={() => {}}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <ListView
              tasks={filteredTasks}
              onSelectTask={setSelectedTask}
              onUpdateStatus={handleUpdateTaskStatus}
              onDeleteTask={setTaskToDelete}
            />
          )}
        </main>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={handleCreateTask}
        mode="create"
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
        initialTask={selectedTask}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
          onClick={() => setTaskToDelete(null)}
        >
          <div
            className="bg-[#111726] rounded-2xl shadow-xl border border-[#1e293b] p-6 w-full max-w-md relative animate-in fade-in zoom-in-95 duration-100 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/40 text-rose-400 flex items-center justify-center shrink-0 border border-rose-800/60">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Excluir Tarefa</h3>
                <p className="text-xs text-slate-400">Esta ação não poderá ser desfeita.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-[#1e293b] p-3 rounded-xl border border-[#334155] mb-6">
              Tem certeza que deseja excluir a tarefa <strong className="text-slate-100">"{taskToDelete.title}"</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-[#1e293b] text-slate-300 hover:bg-[#334155] text-xs font-medium rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete.id)}
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer"
              >
                Excluir Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;