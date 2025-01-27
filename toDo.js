function saveTasks() {
    const tasks = Array.from(document.querySelectorAll("#task-list li")).map(li => {
        const tooltip = li.querySelector(".tooltip");
        return {
            text: li.textContent.replace("Löschen", "").trim(),
            done: li.classList.contains("done"),
            tooltip: tooltip ? tooltip.textContent : ""
        };
    });

    localStorage.setItem("todos", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
    const taskList = document.getElementById("task-list");

    taskList.innerHTML = ""; 

    savedTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.done) {
            listItem.classList.add("done");
        }

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.textContent = task.tooltip || "";
        listItem.appendChild(tooltip);

        listItem.addEventListener("click", function () {
            listItem.classList.toggle("done");

            if (listItem.classList.contains("done")) {
                const doneAt = new Date().toLocaleString("de-DE");
                tooltip.textContent = `${task.tooltip}, Erledigt am: ${doneAt}`;
            } else {
                tooltip.textContent = task.tooltip;
            }

            saveTasks();
        });

        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function () {
            taskList.removeChild(listItem);
            saveTasks();
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

    const taskList = document.getElementById("task-list");
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");


    const taskText = document.createElement("span");
    taskText.textContent = taskValue;
    listItem.appendChild(taskText);

    const createdAt = new Date().toLocaleString("de-DE");
    const tooltip = document.createElement("span");
    tooltip.classList.add("tooltip");
    tooltip.textContent = `Erstellt am: ${createdAt}`;
    listItem.appendChild(tooltip);

    listItem.addEventListener("click", function () {
        listItem.classList.toggle("done");

        if (listItem.classList.contains("done")) {
            const doneAt = new Date().toLocaleString("de-DE");
            tooltip.innerHTML = `Erstellt am: ${createdAt}<br> Erledigt am: ${doneAt}`;
        } else {
            tooltip.innerHTML = `Erstellt am: ${createdAt}`;
        }

        saveTasks();
    });

    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", function () {
        taskList.removeChild(listItem);
        saveTasks();
    });

    
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    taskInput.value = "";
    saveTasks();
});


document.getElementById("add-done-button").addEventListener("click", function () {
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach(task => {
        if (task.classList.contains("done")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
});


document.getElementById("add-all_Button").addEventListener("click", function () {
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach(task => {
        task.style.display = "flex";
    });
});


document.getElementById("add-notDone-Button").addEventListener("click", function () {
    const tasks = document.querySelectorAll("#task-list li");

    tasks.forEach(task => {
        if (task.classList.contains("done")) {
            task.style.display = "none";
        } else {
            task.style.display = "flex";
        }
    });
});


document.addEventListener("DOMContentLoaded", loadTasks);