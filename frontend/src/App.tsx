import { useState, useEffect, type FormEvent } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, closestCorners, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import type { Status, Task } from './types';
import { SortableTask } from './components/SortableTask';
import { KanbanColumnComponent } from './components/KanbanColumnComponent';
import { KANBAN_COLUMNS } from './constants';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    const newTask = {
      title: newTaskTitle,
      status: 'a fazer' as Status,
    };

    try {
      await createTask(newTask);
      setNewTaskTitle('');
      setError(null);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTask(task);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
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

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const isOverAColumn = KANBAN_COLUMNS.some(c => c.status === overId);

    if (isOverAColumn) {
      if (activeTask.status !== overId) {
        const updatedTasks = tasks.map(t =>
          t.id === activeId ? { ...t, status: overId as Status } : t
        );
        setTasks(updatedTasks);
        handleUpdateTask({ ...activeTask, status: overId as Status });
      }
    } else {
      const isOverATask = over.data.current?.type === 'task';
      if (isOverATask) {
        const overTask = tasks.find(t => t.id === overId);
        if (overTask && activeTask.status !== overTask.status) {
          const updatedTasks = tasks.map(t =>
            t.id === activeId ? { ...t, status: overTask.status } : t
          );
          setTasks(updatedTasks);
          handleUpdateTask({ ...activeTask, status: overTask.status });
        } else if (overTask && activeTask.status === overTask.status) {
          setTasks(currentTasks => {
            const activeIndex = currentTasks.findIndex(t => t.id === activeId);
            const overIndex = currentTasks.findIndex(t => t.id === overId);
            if (activeIndex === -1 || overIndex === -1) return currentTasks;
            return arrayMove(currentTasks, activeIndex, overIndex);
          });
        }
      }
    }
    setActiveTask(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Kanban Board</h1>

        <form onSubmit={handleAddTask} className="flex justify-center gap-2 mb-8 sm:mb-12">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nova tarefa..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors">
            Adicionar
          </button>
        </form>

        {loading && <p className="text-center text-gray-500">Carregando tarefas...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded-lg">Erro: {error}</p>}

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {KANBAN_COLUMNS.map((column) => {
              const columnTasks = tasks.filter((task) => task.status === column.status);
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
          <DragOverlay>
            {activeTask ? (
              <SortableTask
                task={activeTask}
                onSelect={() => { }}
                onDelete={() => { }}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {selectedTask && (
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedTask(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedTask(null)} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>

              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                className="text-2xl font-bold w-full p-2 border-2 border-transparent focus:border-blue-500 rounded-md focus:outline-none"
              />

              <textarea
                value={selectedTask.description || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                placeholder="Adicionar uma descrição mais detalhada..."
                rows={6}
                className="w-full p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >Fechar</button>
                <button
                  onClick={() => handleUpdateTask(selectedTask)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >Salvar</button>
              </div>
            </div>
          </div>
        )}

        {taskToDelete && (
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setTaskToDelete(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir a tarefa "{taskToDelete.title}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteTask(taskToDelete.id)}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >Excluir Tarefa</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;