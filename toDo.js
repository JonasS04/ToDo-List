function saveTasks() {
    const tasks = Array.from(document.querySelectorAll("#task-list li")).map(li => ({
        text: li.textContent.replace("Löschen", "").trim(),
        done: li.classList.contains("done"),
    }));

    console.log("Speichere folgende Aufgaben:", tasks); // Prüfe den Inhalt
    localStorage.setItem("todos", JSON.stringify(tasks));
}

// Aufgaben laden
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
    const taskList = document.getElementById("task-list");

    savedTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.done) {
            listItem.classList.add("done");
        }

        // Text der Aufgabe
        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

        // Event: Aufgabe erledigt markieren
        listItem.addEventListener("click", function () {
            listItem.classList.toggle("done");
            saveTasks();
        });

        // Löschen-Button
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





document.getElementById("add-task-button").addEventListener("click", function(){
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Bitte geben sie etwas ein bevor sie den Button drücken")
        return;
    }

    const taskList = document.getElementById("task-list");

    const checkbox = document.createElement("input");


    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    document.getElementById("task-list").appendChild(listItem);
    
    listItem.addEventListener("click", function(){
        listItem.classList.toggle("done");
    })


    

    listItem.textContent = taskValue;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", function() {
        taskList.removeChild(listItem);
    })

    
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);


    taskInput.value = "";
    saveTasks();
})

document.addEventListener("DOMContentLoaded", loadTasks);