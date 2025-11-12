package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gorilla/mux"
)

// Função auxiliar para resetar o estado para cada teste
func setup() {
	tasks = []Task{}
	nextID = 1
}

// Função auxiliar para limpar após os testes
func teardown() {
	os.Remove("tasks.json")
}

func TestGetTasks(t *testing.T) {
	setup()
	defer teardown()

	// Pré-popula com uma tarefa
	tasks = append(tasks, Task{ID: 1, Title: "Tarefa de Teste 1", Status: "a fazer"})

	req, err := http.NewRequest("GET", "/tasks", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getTasks)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler retornou o código de status errado: obteve %v, queria %v", status, http.StatusOK)
	}

	// Verifica se o corpo é um JSON válido e contém nossa tarefa
	var returnedTasks []Task
	if err := json.Unmarshal(rr.Body.Bytes(), &returnedTasks); err != nil {
		t.Fatalf("não foi possível decodificar o corpo da resposta: %v", err)
	}

	if len(returnedTasks) != 1 {
		t.Errorf("esperava 1 tarefa, obteve %d", len(returnedTasks))
	}

	if returnedTasks[0].Title != "Tarefa de Teste 1" {
		t.Errorf("título da tarefa inesperado: obteve %s, queria %s", returnedTasks[0].Title, "Tarefa de Teste 1")
	}
}

func TestCreateTask(t *testing.T) {
	setup()
	defer teardown()

	taskJSON := `{"title": "Nova Tarefa de Teste", "status": "a fazer"}`
	req, err := http.NewRequest("POST", "/tasks", bytes.NewBufferString(taskJSON))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(createTask)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler retornou o código de status errado: obteve %v, queria %v", status, http.StatusCreated)
	}

	if len(tasks) != 1 {
		t.Fatalf("esperava 1 tarefa no armazenamento, obteve %d", len(tasks))
	}

	if tasks[0].Title != "Nova Tarefa de Teste" {
		t.Errorf("título da tarefa incorreto: obteve %s, queria %s", tasks[0].Title, "Nova Tarefa de Teste")
	}

	if tasks[0].ID != 1 {
		t.Errorf("ID da tarefa deveria ser 1, obteve %d", tasks[0].ID)
	}
}

func TestCreateTask_Invalid(t *testing.T) {
	setup()
	defer teardown()

	// Testa com título vazio
	taskJSON := `{"title": "", "status": "a fazer"}`
	req, err := http.NewRequest("POST", "/tasks", bytes.NewBufferString(taskJSON))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(createTask)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler retornou o código de status errado para título vazio: obteve %v, queria %v", status, http.StatusBadRequest)
	}

	// Testa com status inválido
	taskJSON = `{"title": "Um bom título", "status": "status_invalido"}`
	req, _ = http.NewRequest("POST", "/tasks", bytes.NewBufferString(taskJSON))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler retornou o código de status errado para status inválido: obteve %v, queria %v", status, http.StatusBadRequest)
	}
}


func TestUpdateTask(t *testing.T) {
	setup()
	defer teardown()

	// Pré-popula com uma tarefa
	tasks = append(tasks, Task{ID: 1, Title: "Título Original", Status: "a fazer"})

	updatedTaskJSON := `{"title": "Título Atualizado", "status": "em progresso"}`
	req, err := http.NewRequest("PUT", "/tasks/1", bytes.NewBufferString(updatedTaskJSON))
	if err != nil {
		t.Fatal(err)
	}

	// Precisamos de um roteador para passar o parâmetro de URL {id}
	router := mux.NewRouter()
	router.HandleFunc("/tasks/{id}", updateTask)
	
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler retornou o código de status errado: obteve %v, queria %v", status, http.StatusOK)
	}

	if tasks[0].Title != "Título Atualizado" {
		t.Errorf("título da tarefa não foi atualizado: obteve %s, queria %s", tasks[0].Title, "Título Atualizado")
	}

	if tasks[0].Status != "em progresso" {
		t.Errorf("status da tarefa não foi atualizado: obteve %s, queria %s", tasks[0].Status, "em progresso")
	}
}

func TestDeleteTask(t *testing.T) {
	setup()
	defer teardown()

	// Pré-popula com tarefas
	tasks = append(tasks, Task{ID: 1, Title: "A ser deletada", Status: "a fazer"})
	tasks = append(tasks, Task{ID: 2, Title: "A ser mantida", Status: "a fazer"})
	nextID = 3

	req, err := http.NewRequest("DELETE", "/tasks/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/tasks/{id}", deleteTask)
	
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusNoContent {
		t.Errorf("handler retornou o código de status errado: obteve %v, queria %v", status, http.StatusNoContent)
	}

	if len(tasks) != 1 {
		t.Fatalf("esperava que 1 tarefa restasse, obteve %d", len(tasks))
	}

	if tasks[0].ID != 2 {
		t.Errorf("a tarefa errada foi deletada ou a lista está incorreta")
	}
}

func TestDeleteTask_NotFound(t *testing.T) {
	setup()
	defer teardown()

	req, err := http.NewRequest("DELETE", "/tasks/99", nil) // 99 não existe
	if err != nil {
		t.Fatal(err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/tasks/{id}", deleteTask)
	
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusNotFound {
		t.Errorf("handler retornou o código de status errado: obteve %v, queria %v", status, http.StatusNotFound)
	}
}