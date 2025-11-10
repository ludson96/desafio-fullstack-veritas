import { useState, useEffect, type FormEvent } from 'react'

const API_URL = 'http://localhost:8080';

type Status = 'a fazer' | 'em progresso' | 'concluída';

interface Task {
  id: number;
  title: string;
  status: Status;
}

interface KanbanColumn {
  title: string;
  status: Status;
  headerBgClass: string;
  cardBorderClass: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    title: 'A Fazer',
    status: 'a fazer',
    headerBgClass: 'bg-blue-500',
    cardBorderClass: 'border-t-blue-500'
  },
  {
    title: 'Em Progresso',
    status: 'em progresso',
    headerBgClass: 'bg-amber-500',
    cardBorderClass: 'border-t-amber-500'
  },
  { title: 'Concluídas', status: 'concluída', headerBgClass: 'bg-green-500', cardBorderClass: 'border-t-green-500' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Falha ao buscar tarefas');
      }
      const data = await response.json();
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
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar tarefa');
      }
      setNewTaskTitle('');
      setError(null);
      await fetchTasks(); // Re-fetch to get the new task with its ID
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, status: task.status }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao excluir tarefa');
      }
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleMoveTask = (task: Task, newStatus: Status) => {
    const updatedTask = { ...task, status: newStatus };
    handleUpdateTask(updatedTask);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {KANBAN_COLUMNS.map((column) => (
            <div key={column.status} className="bg-gray-100 rounded-lg shadow-md">
              <h2 className={`text-lg font-semibold text-white p-3 rounded-t-lg ${column.headerBgClass}`}>
                {column.title}
              </h2>
              <div className="p-4 space-y-4 min-h-[200px]">
                {tasks
                  .filter((task) => task.status === column.status)
                  .map((task) => (
                    <div key={task.id} className={`bg-white rounded-md p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 border-t-4 ${column.cardBorderClass}`}>
                      {editingTask?.id === task.id ? (
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          onBlur={() => handleUpdateTask(editingTask)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateTask(editingTask)}
                          className="w-full p-1 border-b-2 border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <p onDoubleClick={() => setEditingTask(task)} className="text-gray-800 wrap-break-word cursor-pointer min-h-6">{task.title}</p>
                      )}

                      <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-200">
                        <select
                          value={task.status}
                          onChange={(e) => handleMoveTask(task, e.target.value as Status)}
                          className="grow text-sm p-1 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {KANBAN_COLUMNS.map(col => (
                            <option key={col.status} value={col.status}>{col.title}</option>
                          ))}
                        </select>
                        <button onClick={() => setEditingTask(task)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full transition-colors">✏️</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-full transition-colors">🗑️</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App
