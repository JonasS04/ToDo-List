let tasks = [];



function addTask(text) {
    const newTask = {
        id: Date.now(), 
        text: text,
        createdAt: new Date().toLocaleString("de-DE"),
        doneAt: null,
        isDone: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}


function toggleTaskDone(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isDone = !task.isDone;
        task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null;
        saveTasks();
        renderTasks();
    }
}


function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
}


function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; 

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");
        listItem.setAttribute("data-id", task.id);
        if (task.isDone) listItem.classList.add("done");

      
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

   
        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.innerHTML = `Erstellt am: ${task.createdAt}<br>${
            task.doneAt ? `Erledigt am: ${task.doneAt}` : ""
        }`;
        listItem.appendChild(tooltip);

        listItem.addEventListener("click", function () {
            toggleTaskDone(task.id);
        });

        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}


document.getElementById("add-task-button").addEventListener("click", function () {
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Bitte geben Sie etwas ein, bevor Sie den Button drücken");
        return;
    }

    addTask(taskValue);
    taskInput.value = "";
});

document.getElementById("add-all_Button").addEventListener("click", function () {
    tasks.forEach(task => {
        document.querySelector(`[data-id="${task.id}"]`).style.display = "flex";
    });
});

document.getElementById("add-done-button").addEventListener("click", function () {
    tasks.forEach(task => {
        const element = document.querySelector(`[data-id="${task.id}"]`);
        if (task.isDone) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});

document.getElementById("add-notDone-Button").addEventListener("click", function () {
    tasks.forEach(task => {
        const element = document.querySelector(`[data-id="${task.id}"]`);
        if (!task.isDone) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});

// Aufgaben beim Laden der Seite wiederherstellen
document.addEventListener("DOMContentLoaded", loadTasks);