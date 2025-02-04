let tasks = [];

// Neue Aufgabe hinzufügen
function addTask(text) {
    const newTask = {
        id: Date.now(), // ID wird immer neu erstellt
        text: text,
        doneAt: null,
        isDone: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
}




























// Status der Aufgabe umschalten
function toggleTaskDone(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isDone = !task.isDone;
        task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null;
        saveTasks();
        renderTasks();
        updateProgress();
       
    }
}
























// Aufgabe löschen
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}




















// Aufgaben in localStorage speichern
function saveTasks() {
    localStorage.setItem("tasks1", JSON.stringify(tasks));

}

























// Aufgaben aus localStorage laden
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks1")) || [];
    tasks = storedTasks; // Globale Variable setzen
    renderTasks();
    updateProgress();
}





























// Aufgabenliste rendern
function renderTasks() {
    const taskList = document.getElementById("task-list1");
    if (!taskList) return;
    taskList.innerHTML = ""; 

    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");
        listItem.setAttribute("data-id", task.id);
        if (task.isDone) listItem.classList.add("done");

        // Text der Aufgabe
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

        // Checkbox zum Erledigen
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.isDone;
        checkBox.addEventListener("change", function () {
            toggleTaskDone(task.id);
            updateProgress();
        });
        listItem.appendChild(checkBox);

        // Löschen-Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
            updateProgress();
        });
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });


}




























// Fortschrittsbalken aktualisieren
function updateProgress() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const taskDoneField = document.getElementById("task-done");

    if (!progressBar || !progressText) return;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isDone).length;
    const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}% erledigt`;

    if (progressPercent === 100) {
        const taskDoneField = document.getElementById("task-done");
        const currentDate = new Date().toLocaleString("de-DE");
    
        taskDoneField.textContent = currentDate;
        
        
    
        tasks.forEach(task => {
            if (task.isDone && !task.doneAt) { 
                task.doneAt = currentDate;
            }
        });
        localStorage.setItem("tasks1", JSON.stringify(tasks));

        
        saveTasks();
    } else {
        const taskDoneField = document.getElementById("task-done");
        taskDoneField.textContent = ""; // Löscht das Datum in der Anzeige
    
        tasks.forEach(task => {
            if (task.isDone) {
                task.doneAt = null; // Löscht das Datum aus den Daten
            }
        });
        saveTasks();
        renderTasks();
    }
}



























































// Event Listener für Laden der Seite
document.addEventListener("DOMContentLoaded", function () {
    loadTasks(); // Nur einmal aufrufen!

    const params = new URLSearchParams(window.location.search);
    document.getElementById("task-title").textContent = params.get("title");
    document.getElementById("task-created").textContent = params.get("created");
    document.getElementById("task-done").textContent = params.get("done") || "-";


    


    const taskDoneField = document.getElementById("task-done");
    const savedTasks = JSON.parse(localStorage.getItem("tasks1")) || [];
    const completedTask = savedTasks.find(task => task.doneAt);
    if (completedTask) {
        taskDoneField.textContent = completedTask.doneAt; 
    } else {
        taskDoneField.textContent = ""; 
    }

    
    
    const addButton = document.getElementById("add-task1-button");
    if (addButton) {
        addButton.addEventListener("click", function () {
            const taskInput = document.getElementById("task-input1");
            if (!taskInput) return;

            const taskValue = taskInput.value.trim();
            if (taskValue === "") {
                alert("Bitte geben Sie eine Aufgabe ein!");
                return;
            }

            addTask(taskValue);
            taskInput.value = "";
            updateProgress();
        });
    }
});


