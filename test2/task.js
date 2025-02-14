document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("id");

    let tasks = JSON.parse(localStorage.getItem(`tasks_${taskId}`)) || [];

    renderTasks();
    updateProgress();
    renderSubtasks(taskId);

    document.getElementById("task-title").textContent = params.get("title") || "Unbekannte Aufgabe";
    document.getElementById("task-created").textContent = params.get("created") || "-";
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${taskId}`)) || [];
    const completedTask = savedTasks.find(task => task.doneAt);
    document.getElementById("task-done").textContent = completedTask ? completedTask.doneAt : "-";

    document.getElementById("add-task1-button")?.addEventListener("click", function () {
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














    function addTask(undertext) {
        const newTask = { 
            id: Date.now(), 
            undertext, 
            isDone: false, 
            doneAt: null 
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    }


















    function toggleTaskDone(taskId) {
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.isDone = !task.isDone;
            task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null;
            saveTasks();
            renderTasks();
            updateProgress();
        }
    }

















    function deleteTask(taskId) {
        tasks = tasks.filter(t => t.id != taskId);
        saveTasks();
        renderTasks();
        updateProgress();
    }














    function saveTasks() {
        localStorage.setItem(`tasks_${taskId}`, JSON.stringify(tasks));
    }

















    function renderTasks() {
        const taskList = document.getElementById("task-list1");
        if (!taskList) return;
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.setAttribute("data-id", task.id);
            if (task.isDone) listItem.classList.add("done");

            const taskText = document.createElement("span");
            taskText.textContent = task.undertext;
            listItem.appendChild(taskText);

            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.checked = task.isDone;
            checkBox.addEventListener("change", function () {
                toggleTaskDone(task.id);
            });
            listItem.appendChild(checkBox);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Löschen";
            deleteButton.addEventListener("click", function () {
                deleteTask(task.id);
            });
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

















     

    function updateProgress() {
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
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
            localStorage.setItem(`tasks_${taskId}`, JSON.stringify(tasks));
    
            
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
        document.getElementById("without").addEventListener("click", function () {
            console.log("Button 'without' wurde geklickt!");
            if (tasks.length === 0) {
                console.log("Keine Aufgaben vorhanden, setze Fortschritt auf 100%.", tasks.length);
                updateProgress(100);
           }
           saveTasks(); 
           renderTasks();
       })        
        
        saveTasks();
    }








    function saveSubtasks(taskId, subtasks) {
        localStorage.setItem(`subtasks_${taskId}`, JSON.stringify(subtasks));
    }

    function loadSubtasks(taskId) {
        return JSON.parse(localStorage.getItem(`subtasks_${taskId}`)) || [];
    }

    function renderSubtasks(taskId) {
        const subtaskList = document.getElementById("subtask-list");
        if (!subtaskList) return;
        subtaskList.innerHTML = "";
        const subtasks = loadSubtasks(taskId);
        subtasks.forEach(subtask => {
            const listItem = document.createElement("li");
            listItem.textContent = subtask.text;
            subtaskList.appendChild(listItem);
        });
    }
});








