package main

import (
	"encoding/json"
	"os"
	"errors"
)

type Task struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
}

var tasks []Task
var nextID = 1

func validateTask(t Task) error {
	if t.Title == "" {
		return errors.New("o título é obrigatório")
	}
	if t.Status != "pending" && t.Status != "done" {
		return errors.New("status inválido (use 'pending' ou 'done')")
	}
	return nil
}

func saveTasksToFile() error {
	file, err := os.Create("tasks.json")
	if err != nil {
		return err
	}
	defer file.Close()
	return json.NewEncoder(file).Encode(tasks)
}

func loadTasksFromFile() error {
	file, err := os.Open("tasks.json")
	if err != nil {
		return err
	}
	defer file.Close()
	return json.NewDecoder(file).Decode(&tasks)
}
