import { useState, useEffect, type FormEvent } from 'react'

const API_URL = 'http://localhost:8080';

type Status = 'a fazer' | 'em progresso' | 'concluída';

interface Task {
  id: number;
  title: string;
  status: Status;
  description?: string; // Descrição opcional
}

interface KanbanColumn {
  title: string;
  status: Status;
  headerBgClass: string;
  cardBorderClass: string;
}

const KANBAN_COLUMNS: readonly KanbanColumn[] = [
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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
        body: JSON.stringify(newTask), // Enviar a nova tarefa com a descrição
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
        body: JSON.stringify({ title: task.title, status: task.status, description: task.description }),
      });
      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Falha ao excluir tarefa');
      }
      setTaskToDelete(null); // Fecha o modal de confirmação
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
                    <div key={task.id} onClick={() => setSelectedTask(task)} className={`bg-white rounded-md p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 border-t-4 cursor-pointer ${column.cardBorderClass}`}>
                      <p className="text-gray-800 wrap-break-word">{task.title}</p>
                      <div className="flex items-center gap-2 mt-4 pt-2 border-t border-gray-200">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()} // Impede que o modal abra ao clicar no select
                          onChange={(e) => { e.stopPropagation(); handleMoveTask(task, e.target.value as Status) }}
                          className="grow text-sm p-1 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {KANBAN_COLUMNS.map(col => (
                            <option key={col.status} value={col.status}>{col.title}</option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); }}
                          className="shrink-0 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Edição de Tarefa */}
        {selectedTask && (
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedTask(null)} // Fecha ao clicar no fundo
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
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

        {/* Modal de Confirmação de Exclusão */}
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

export default App
