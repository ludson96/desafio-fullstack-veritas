import { useState, useEffect, FormEvent } from 'react'
// Opcional: remover a importação de App.css se o arquivo for excluído
// import './App.css' 

const API_URL = 'http://localhost:8080';

type Status = 'a fazer' | 'em progresso' | 'concluída';

interface Task {
  id: number;
  title: string;
  status: Status;
}

const KANBAN_COLUMNS: { title: string, status: Status }[] = [
  { title: 'A Fazer', status: 'a fazer' },
  { title: 'Em Progresso', status: 'em progresso' },
  { title: 'Concluídas', status: 'concluída' },
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
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-10">Kanban Board</h1>

        <form onSubmit={handleAddTask} className="flex justify-center gap-2 mb-10">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nova tarefa..."
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors">
            Adicionar
          </button>
        </form>

        {loading && <p className="text-center text-slate-500">Carregando tarefas...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded-lg">Erro: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {KANBAN_COLUMNS.map(({ title, status }) => (
            <div key={status} className="bg-slate-200/80 rounded-xl shadow-inner p-4">
              <h2 className="text-xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-slate-300">{title}</h2>
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div key={task.id} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 border border-slate-200">
                      {editingTask?.id === task.id ? (
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          onBlur={() => handleUpdateTask(editingTask)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateTask(editingTask)}
                          className="w-full p-1 border-b-2 border-indigo-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <p onDoubleClick={() => setEditingTask(task)} className="text-slate-800 break-words cursor-pointer min-h-[24px]">{task.title}</p>
                      )}

                      <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-200">
                        <select
                          value={task.status}
                          onChange={(e) => handleMoveTask(task, e.target.value as Status)}
                          className="flex-grow text-sm p-1 border border-slate-300 rounded bg-slate-50 focus:outline-none"
                        >
                          {KANBAN_COLUMNS.map(col => (
                            <option key={col.status} value={col.status}>{col.title}</option>
                          ))}
                        </select>
                        <button onClick={() => setEditingTask(task)} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full transition-colors">✏️</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-slate-500 hover:text-red-600 p-1 rounded-full transition-colors">🗑️</button>
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
