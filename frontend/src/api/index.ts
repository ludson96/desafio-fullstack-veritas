import type { Task } from '../types';

const API_URL = 'http://localhost:8080';

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Falha ao buscar tarefas');
  }
  return response.json();
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar tarefa');
  }
};

export const updateTask = async (task: Task): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: task.title, status: task.status, description: task.description }),
  });
  if (!response.ok) {
    throw new Error('Falha ao atualizar tarefa');
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Falha ao excluir tarefa');
  }
};
