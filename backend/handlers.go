package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GET /tasks
func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

// POST /tasks
func createTask(w http.ResponseWriter, r *http.Request) {
	var newTask Task
	json.NewDecoder(r.Body).Decode(&newTask)

	if err := validateTask(newTask); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newTask.ID = nextID
	nextID++
	tasks = append(tasks, newTask)
	if err := saveTasksToFile(); err != nil {
		http.Error(w, "Falha ao salvar a tarefa", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode("Tarefa criada com sucesso")
}

// PUT /tasks/{id}
func updateTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	var updated Task
	json.NewDecoder(r.Body).Decode(&updated)

	if err := validateTask(updated); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for i, t := range tasks {
		if t.ID == id {
			tasks[i].Title = updated.Title
			tasks[i].Status = updated.Status
			tasks[i].Description = updated.Description // Adicione esta linha
			if err := saveTasksToFile(); err != nil {
				http.Error(w, "Falha ao salvar a tarefa atualizada", http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(tasks[i])
			return
		}
	}
	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}

// DELETE /tasks/{id}
func deleteTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	for i, t := range tasks {
		if t.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			if err := saveTasksToFile(); err != nil {
				http.Error(w, "Não foi possível salvar as alterações após a exclusão", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}
	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}
