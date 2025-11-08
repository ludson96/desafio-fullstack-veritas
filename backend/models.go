package main

import "errors"

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
