# 🏢 Desafio Técnico `VERITAS CONSULTORIA EMPRESARIAL`

Projeto desenvolvido como parte do processo seletivo para a vaga de `Estágio em TI`.

## 📝 Sobre o Projeto

Esta é uma aplicação full stack de um quadro Kanban. A aplicação permite aos usuários gerenciar tarefas em três colunas: "A Fazer", "Em Progresso" e "Concluídas". As tarefas podem ser criadas, editadas, excluídas e movidas entre as colunas através de uma interface de arrastar e soltar (drag-and-drop).

O backend é construído em **Go** e expõe uma API REST para gerenciar as tarefas, persistindo os dados em um arquivo `tasks.json`. O frontend é uma aplicação de página única (SPA) construída com **React**, **TypeScript** e **Vite**, utilizando **Tailwind CSS** para estilização e a biblioteca **dnd-kit** para a funcionalidade de arrastar e soltar.

## ✨ Funcionalidades

- **Visualização de Tarefas:** Tarefas exibidas em suas respectivas colunas de status.
- **Criação de Tarefas:** Adicione novas tarefas diretamente na coluna "A Fazer".
- **Arrastar e Soltar:** Mova tarefas entre as colunas para atualizar seu status.
- **Edição de Tarefas:** Clique em uma tarefa para abrir um modal e editar seu título e descrição.
- **Exclusão de Tarefas:** Remova tarefas do quadro com uma caixa de diálogo de confirmação.
- **Persistência de Dados:** As tarefas e suas posições são salvas no backend.

## 🛠️ Tecnologias Utilizadas

| Categoria      | Tecnologia                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**    | [![Go][Go-logo]][Go-url] [![Gorilla/Mux][Gorilla-Mux-logo]][Gorilla-Mux-url]                                                                                            |
| **Frontend**   | [![React][React-logo]][React-url] [![TypeScript][TypeScript-logo]][TypeScript-url] [![Vite][Vite-logo]][Vite-url] [![Tailwind-CSS][Tailwind-CSS-logo]][Tailwind-CSS-url] |
| **Ferramentas**| [![Git][Git-logo]][Git-url] [![ESLint][ESLint-logo]][ESLint-url]                                                                                                        |

## 💡 Decisões Técnicas

### Backend

- **Persistência com `tasks.json`**: Para este desafio, a utilização de um arquivo JSON como banco de dados foi uma decisão pragmática. Ela cumpre os requisitos do projeto sem a necessidade de configurar e gerenciar um banco de dados externo, mantendo a arquitetura leve e focada na lógica da API.
- **`gorilla/mux`**: Selecionado como roteador por ser uma solução poderosa e flexível no ecossistema Go, facilitando a definição de rotas e a extração de parâmetros (como o `{id}` da tarefa).

### Frontend

- **React com TypeScript**: A combinação oferece uma base sólida para a construção de interfaces de usuário, com a segurança de tipos do TypeScript prevenindo erros comuns e melhorando a manutenibilidade do código.
- **Vite**: Escolhido como ferramenta de build por sua incrível velocidade de desenvolvimento (HMR - Hot Module Replacement) e processo de build otimizado, proporcionando uma experiência de desenvolvimento superior.
- **`dnd-kit`**: Uma biblioteca moderna e acessível para a funcionalidade de arrastar e soltar. Foi escolhida por ser leve, performática e altamente customizável, ideal para a principal interação do quadro Kanban.
- **Tailwind CSS**: Utilizado para agilizar o desenvolvimento da interface com uma abordagem *utility-first*, permitindo a criação de um design consistente e responsivo sem a necessidade de escrever CSS customizado.

## 📈 Limitações e Melhorias Futuras

Embora o projeto atenda aos requisitos propostos, existem várias oportunidades de melhoria:

- **Banco de Dados Robusto**: Substituir o arquivo `tasks.json` por uma solução de banco de dados mais escalável, como **SQLite** (para manter a simplicidade) ou **PostgreSQL**, resolveria problemas de concorrência e garantiria maior integridade dos dados.
- **Testes Automatizados**: Implementar uma suíte de testes tanto no backend (testes de unidade para os *handlers* e de integração para os *endpoints*) quanto no frontend (testes de componentes e E2E com ferramentas como Cypress) para garantir a estabilidade da aplicação.
- **Autenticação e Autorização**: Adicionar um sistema de usuários, permitindo que cada usuário tenha seus próprios quadros e tarefas. Isso envolveria a implementação de registro, login e gerenciamento de sessões (ex: com JWT).
- **Atualizações Otimistas na UI**: Para uma experiência de usuário mais fluida, as ações (como mover ou deletar uma tarefa) poderiam ser refletidas na interface instantaneamente (*optimistic updates*), com um mecanismo para reverter a ação em caso de falha na API.
- **Funcionalidades Adicionais**: Expandir o Kanban com recursos como:
  - Prazos para tarefas.
  - Atribuição de responsáveis.
  - Adição de etiquetas (tags) coloridas.
  - Funcionalidade de busca e filtro de tarefas.

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para executar o backend e o frontend em seu ambiente local.

### ⚙️ Backend (Go)

1. **Pré-requisitos:**
    - É necessário ter o [Go](https://go.dev/doc/install) (versão 1.22 ou superior) instalado.

2. **Navegue até o diretório do backend:**

    ```bash
    cd backend
    ```

3. **Instale as dependências:**
    Este comando irá baixar os pacotes necessários (`gorilla/mux` e `rs/cors`).

    ```bash
    go mod tidy
    ```

4. **Execute o servidor:**

    ```bash
    go run .
    ```

O servidor backend estará em execução na porta `8080`.

5. **Execute os testes:**
    Para rodar os testes automatizados do backend, execute o seguinte comando no diretório `backend`:

    ```bash
    go test -v ./...
    ```

### ⚛️ Frontend (React + Vite)

1. **Pré-requisitos:**
    - É necessário ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) instalado.

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

O comando iniciará o servidor de desenvolvimento do Vite e abrirá a aplicação automaticamente no seu navegador.

> **Nota:** O backend deve estar em execução para que o frontend possa buscar e gerenciar as tarefas.

## 🌐 API Endpoints

O backend fornece os seguintes endpoints para manipulação das tarefas:

| Método | Rota           | Descrição                                       |
| ------ | -------------- | ------------------------------------------------- |
| `GET`  | `/tasks`       | Retorna a lista de todas as tarefas.              |
| `POST` | `/tasks`       | Cria uma nova tarefa.                             |
| `PUT`  | `/tasks/{id}`  | Atualiza o título, descrição ou status de uma tarefa. |
| `DELETE`| `/tasks/{id}`  | Exclui uma tarefa específica.                     |

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
