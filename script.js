// armazenar tarefas
let tasks = [];

// carregar tarefas salvas
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

// selecionar elementos do HTML para poder controlá-los
const form = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const emptyMessage = document.querySelector("#emptyMessage");

// submit do formulário
form.addEventListener("submit", function (event) {

    event.preventDefault();

    // pegar valores do formulário
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const date = document.querySelector("#date").value;
    const priority = document.querySelector("#priority").value;

    // criar objeto da tarefa
    const task = {
        title: title,
        description: description,
        date: date,
        priority: priority,
        status: "Pendente"
    };

    // adicionar no array
    tasks.push(task);

    // salvar no navegador
    saveTasks();

    // atualizar tela
    displayTasks();

    // limpar o formulário automaticamente
    form.reset();

});

function displayTasks(taskArray = tasks) {

    taskList.innerHTML = "";

    // CORRIGIDO AQUI
    if (taskArray.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    taskArray.forEach(function (task, index) {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");

        // aplicar cor da prioridade
        if (task.priority === "Baixa") {
            taskElement.classList.add("baixa");
        }
        if (task.priority === "Média") {
            taskElement.classList.add("media");
        }
        if (task.priority === "Alta") {
            taskElement.classList.add("alta");
        }

        // RISCA se concluída
        if (task.status === "Concluída") {
            taskElement.classList.add("done");
        }

        taskElement.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Data: ${task.date}</p>
<p>Prioridade: ${task.priority}</p>
<p>Status: ${task.status}</p>

<div class="task-buttons">
<button class="complete">Concluir</button>
<button class="edit">Editar</button>
<button class="delete">Excluir</button>
</div>
`;

        // botão concluir
        taskElement.querySelector(".complete").addEventListener("click", function () {

            task.status = "Concluída";

            saveTasks();
            displayTasks();

        });

        // botão editar
        taskElement.querySelector(".edit").addEventListener("click", function () {

            document.querySelector("#title").value = task.title;
            document.querySelector("#description").value = task.description;
            document.querySelector("#date").value = task.date;
            document.querySelector("#priority").value = task.priority;

            // remove antiga
            tasks.splice(index, 1);

            saveTasks();
            displayTasks();

            //subir para o topo
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

        // botão excluir
        taskElement.querySelector(".delete").addEventListener("click", function () {

            tasks.splice(index, 1);

            saveTasks();
            displayTasks();

        });

        taskList.appendChild(taskElement);

    });

}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// mostrar tarefas ao carregar página
displayTasks();

// buscar tarefa pelo título (CORRIGIDO)
const searchInput = document.querySelector("#searchTask");

searchInput.addEventListener("input", function () {

    const termo = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(function (task) {
        return task.title.toLowerCase().includes(termo);
    });

    displayTasks(filteredTasks);

});

// voltar para todas as tarefas
const resetTasks = document.querySelector("#resetTasks");

resetTasks.addEventListener("click", function () {

    // limpa o campo de busca
    document.querySelector("#searchTask").value = "";

    // mostra todas as tarefas novamente
    displayTasks();

});