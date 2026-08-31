# 🏢 Desafio Técnico `VERITAS CONSULTORIA EMPRESARIAL`

> **TaskFlow Workspace**: Uma aplicação full stack moderna e profissional para gestão visual de tarefas e projetos com fluxos Kanban e Lista/Tabela, construída com Go, React, TypeScript e Tailwind CSS.

Projeto desenvolvido como parte do processo seletivo para a vaga de `Estágio em TI`.

## 📝 Sobre o Projeto

O **TaskFlow** é uma aplicação completa de produtividade e gerenciamento de tarefas estruturada em formato de **Workspace SaaS**. A aplicação permite que equipes e indivíduos organizem seu fluxo de trabalho através de visualizações complementares (**Quadro Kanban** e **Tabela / Lista**), com métricas em tempo real, filtros instantâneos, categorização e níveis de prioridade.

- **Backend:** Desenvolvido em **Go (Golang)** com arquitetura RESTful limpa e modularizada, utilizando o roteador `gorilla/mux`, controle de CORS com `rs/cors`, validações e persistência de dados em arquivo `tasks.json`, acompanhado de suíte de testes unitários automatizados.
- **Frontend:** Single Page Application (SPA) construída com **React 19**, **TypeScript** e **Vite**, estilizada com **Tailwind CSS** (design dark sólido moderno, cores contrastantes `#4F46E5` e sem dependência de gradientes artificiais) e a biblioteca **@dnd-kit** para interações fluidas e acessíveis de arrastar e soltar (drag-and-drop).

## 🖼️ Tela (Preview)

```
+-------------------------------------------------------------------------------------------------------+
|  TaskFlow  |  🔍 Buscar tarefas... (/)              [Prioridade ▾] [Categoria ▾]  [+ Criar Tarefa (N)] |
+------------+------------------------------------------------------------------------------------------+
|  VISÕES    |  [ Total: 12 ]       [ A Fazer: 4 ]       [ Em Andamento: 5 ]       [ Conclusão: 65% ]   |
|  📌 Kanban |                                                                                          |
|  📋 Lista  |  +--------------------+  +--------------------+  +--------------------+                  |
|            |  | A FAZER        (4) |  | EM PROGRESSO   (5) |  | CONCLUÍDAS     (3) |                  |
|  STATUS    |  +--------------------+  +--------------------+  +--------------------+                  |
|  • Todas   |  | [Frontend] [Alta]  |  | [Backend]  [Média] |  | [Design]   [Baixa] |                  |
|  • A Fazer |  | Criar nova rota    |  | Refatorar handlers |  | Protótipo UI Figma |                  |
|  • Em Prog |  |                    |  |                    |  |                    |                  |
|  • Concl.  |  +--------------------+  +--------------------+  +--------------------+                  |
+-------------------------------------------------------------------------------------------------------+
```

## ✨ Funcionalidades

- **🗂️ Workspace com Dupla Visualização:**
  - **Quadro Kanban Interativo:** 3 colunas com identificação por cores sólidas (*A Fazer*, *Em Progresso* e *Concluídas*), permitindo mover tarefas livremente via arrastar e soltar (Drag & Drop) com ordenação interna.
  - **Tabela / Lista Estruturada:** Visualização executiva em formato de linhas com alteração de status imediata via *dropdown*, facilitando a edição rápida de múltiplos itens.
- **📊 Mini-Dashboard de Métricas (KPIs):**
  - Indicadores em tempo real de *Total de Tarefas*, *A Fazer*, *Em Andamento* e barra de *Taxa de Conclusão (%)*.
- **🔍 Busca e Filtros em Tempo Real:**
  - Busca instantânea por título, descrição ou categoria.
  - Filtro por **Status** (ao selecionar um status na sidebar, a aplicação isola e destaca a coluna selecionada).
  - Filtros contextuais por **Prioridade** (*Alta*, *Média*, *Baixa*) e **Categoria** (*Frontend*, *Backend*, *Design*, *Bug*, *Melhoria*, *Geral*).
- **🏷️ Metadados Ricos nos Cards:**
  - Tags de categorias temáticas e badges de prioridade coloridas com alto contraste.
  - Prévia de descrições e botão de exclusão contextual no *hover*.
- **⌨️ Atalhos de Teclado:**
  - Pressione `/` para focar imediatamente no campo de busca.
  - Pressione `N` para abrir o modal de criação de nova tarefa.
- **📝 Modais Completos de Criação e Edição:**
  - Modal com validação de dados para cadastrar ou atualizar título, status, prioridade, categoria e descrição.
- **🗑️ Exclusão Segura:**
  - Diálogo de confirmação antes de remover qualquer item permanentemente.
- **💾 Persistência de Dados & Testes:**
  - Sincronização automática com a API em Go e armazenamento local seguro no arquivo `tasks.json`.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Backend** | [![Go][Go-logo]][Go-url] [![Gorilla/Mux][Gorilla-Mux-logo]][Gorilla-Mux-url] |
| **Frontend** | [![React][React-logo]][React-url] [![TypeScript][TypeScript-logo]][TypeScript-url] [![Vite][Vite-logo]][Vite-url] [![Tailwind-CSS][Tailwind-CSS-logo]][Tailwind-CSS-url] |
| **Interatividade** | [![dnd-kit](https://img.shields.io/badge/@dnd--kit-Core%20%26%20Sortable-indigo?style=for-the-badge)](https://dndkit.com/) |
| **Qualidade & Dev** | [![Git][Git-logo]][Git-url] [![ESLint][ESLint-logo]][ESLint-url] |

## 💡 Decisões Técnicas

### Backend (Go)
- **Modularização Limpa (`models.go`, `handlers.go`, `main.go`)**: Separação clara entre definição de tipos/estruturas de dados, manipuladores HTTP e inicialização do servidor.
- **Persistência com `tasks.json`**: Decisão prática e autossuficiente para persistência de dados em arquivos sem exigir a instalação ou configuração de bancos de dados externos.
- **`gorilla/mux` & `rs/cors`**: Roteador flexível e robusto com suporte a parâmetros de rota e middleware configurado para permitir comunicação entre diferentes origens locais.
- **Testes Unitários Automatizados (`handlers_test.go`)**: Cobertura de testes cobrindo todos os métodos (`GET`, `POST`, `PUT`, `DELETE` e casos de erro/validação).

### Frontend (React + TypeScript)
- **Design System Dark Sólido (`#4F46E5` & Tons Escuros Sólidos)**: Focado em contraste, clareza e alta legibilidade, evitando efeitos artificiais ou gradientes exagerados (*AI Slop*).
- **Gerenciamento de Estado Reactivo**: Otimização com `useMemo` para filtros instantâneos e contagens sem requisições excessivas.
- **`@dnd-kit` (Core & Sortable)**: Solução moderna com `PointerSensor` e limites de ativação que evitam conflitos entre cliques nos botões e o início do arraste.

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para executar o backend e o frontend em seu ambiente local.

### ⚙️ 1. Backend (Go)

1. **Pré-requisitos:**
   - Ter o [Go](https://go.dev/doc/install) (versão 1.22 ou superior) instalado.

2. **Navegue até o diretório do backend:**
   ```bash
   cd backend
   ```

3. **Instale as dependências:**
   ```bash
   go mod tidy
   ```

4. **Execute o servidor:**
   ```bash
   go run .
   ```
   O servidor backend estará disponível em `http://localhost:8080`.

5. **Executar os testes automatizados:**
   ```bash
   go test -v ./...
   ```

### ⚛️ 2. Frontend (React + Vite)

1. **Pré-requisitos:**
   - Ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado.

2. **Navegue até o diretório do frontend:**
   ```bash
   cd frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação abrirá no seu navegador padrão (geralmente em `http://localhost:5173`).

> ℹ️ **Nota:** Certifique-se de que o backend esteja em execução para que o frontend consiga carregar e sincronizar as tarefas.

## 🌐 API Endpoints

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/tasks` | Retorna a lista de todas as tarefas cadastradas. |
| `POST` | `/tasks` | Cria uma nova tarefa com título, status, prioridade e categoria. |
| `PUT` | `/tasks/{id}` | Atualiza os campos e o status de uma tarefa existente. |
| `DELETE`| `/tasks/{id}` | Exclui permanentemente uma tarefa por ID. |

[Go-logo]: https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white
[Go-url]: https://go.dev/
[Gorilla-Mux-logo]: https://img.shields.io/badge/Gorilla_Mux-000000?style=for-the-badge
[Gorilla-Mux-url]: https://github.com/gorilla/mux
[React-logo]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org
[TypeScript-logo]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite-logo]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/
[Tailwind-CSS-logo]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-CSS-url]: https://tailwindcss.com/
[Git-logo]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Git-url]: https://git-scm.com
[ESLint-logo]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
