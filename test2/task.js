document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const taskId = Number(params.get("id")); // ID als Zahl speichern
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Hauptliste laden
    let task = tasks.find(t => t.id === taskId); // Die aktuelle Aufgabe finden

    document.getElementById("task-title").textContent = task.text;
    document.getElementById("task-created").textContent = task.createdAt;
    document.getElementById("task-done").textContent = task.doneAt || "-";

    renderTasks();
    updateProgress();

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

    // Funktion zum Hinzufügen eines Subtasks
    function addTask(undertext) {
        const newTask = { 
            id: Date.now(), 
            undertext, 
            isDone: false, 
            doneAt: null 
        };

        // Stelle sicher, dass subtask als leeres Array existiert
        task.subtasks = task.subtasks || [];
        task.subtasks.push(newTask); // Neue Subtask wird zu `subtasks` hinzugefügt
        saveTasks();
        renderTasks();
    }

    // Funktion zum Markieren von Subtasks als erledigt
    function toggleTaskDone(taskId) {
        const subtask = task.subtasks.find(t => t.id === taskId);
        if (subtask) {
            subtask.isDone = !subtask.isDone;
            
            // Wenn der Subtask erledigt wird, setzen wir das doneAt auf das aktuelle Datum
            if (subtask.isDone) {
                subtask.doneAt = new Date().toLocaleString("de-DE");
            } else {
                // Wenn der Subtask wieder auf "nicht erledigt" gesetzt wird, setzen wir doneAt auf null
                subtask.doneAt = null;
            }
            

            // Nachdem der Subtask aktualisiert wurde, muss die Hauptaufgabe ebenfalls ihr doneAt-Datum anpassen
            updateMainTaskDoneAt();

            saveTasks();
            renderTasks();
            updateProgress();
        }
    }

    // Funktion zum Löschen eines Subtasks
    function deleteTask(taskId) {
        task.subtasks = task.subtasks.filter(t => t.id !== taskId);
        // Nachdem der Subtask gelöscht wurde, muss die Hauptaufgabe ebenfalls ihr doneAt-Datum anpassen
        updateMainTaskDoneAt();
        saveTasks();
        renderTasks();
        updateProgress();
    }

    // Funktion zum Aktualisieren des doneAt der Hauptaufgabe basierend auf den Subtasks
    function updateMainTaskDoneAt() {
        const allSubtasksDone = task.subtasks.every(subtask => subtask.isDone); // Überprüfen, ob alle Subtasks erledigt sind
        if (allSubtasksDone) {
            task.doneAt = new Date().toLocaleString("de-DE"); // Setzen des doneAt auf das aktuelle Datum, wenn alle Subtasks erledigt sind
        } else {
            task.doneAt = null; // Wenn nicht alle Subtasks erledigt sind, setze das doneAt auf null
        }
        saveTasks()
        document.getElementById("task-done").textContent = task.doneAt || "-"; // 🔥 UI direkt aktualisieren

    }

    // Speichern der Aufgaben in localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        window.dispatchEvent(new Event("storage")); // 🔥 Speicher-Update auslösen
    }

    // Funktion zum Rendern der Aufgaben und Subtasks
    function renderTasks() {
        const taskList = document.getElementById("task-list1");
        if (!taskList) return;
        taskList.innerHTML = "";

        if (!task.subtasks) return;

        task.subtasks.forEach(subtask => {
            const listItem = document.createElement("li");
            listItem.classList.add("li");
            listItem.setAttribute("data-id", subtask.id);
            if (subtask.isDone) listItem.classList.add("done");


            const checkBox = document.createElement("input");
            checkBox.classList.add("checkbox");
            checkBox.type = "checkbox";
            checkBox.checked = subtask.isDone;
            checkBox.addEventListener("change", function () {
                toggleTaskDone(subtask.id);
            });
            listItem.appendChild(checkBox);

            const taskText = document.createElement("span");
            taskText.classList.add("text")
            taskText.textContent = subtask.undertext;
            listItem.appendChild(taskText);


            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteButton");
            deleteButton.textContent = "Löschen";
            deleteButton.addEventListener("click", function () {
                deleteTask(subtask.id);
            });
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        });
    }

    // Funktion zur Aktualisierung des Fortschritts
    function updateProgress() {
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        if (!progressBar || !progressText) return;
    
        const totalTasks = task.subtasks ? task.subtasks.length : 0;
        const completedTasks = task.subtasks ? task.subtasks.filter(t => t.isDone).length : 0;
        let progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${progressPercent}% erledigt`;
    
        // Wenn der Fortschritt 100% ist und das doneAt noch nicht gesetzt ist
        if (progressPercent === 100 && !task.doneAt) { 
            task.doneAt = new Date().toLocaleString("de-DE"); // Nur einmal setzen
            document.getElementById("task-done").textContent = task.doneAt;
        } else if (progressPercent < 100) {
            document.getElementById("task-done").textContent = "-"; // Wenn der Fortschritt unter 100% ist, zeigt es "-"
        }
    
        const without = document.getElementById("without");
        without.addEventListener("click", function () {
            // Setzt alle Subtasks auf "erledigt"
            if (task.subtasks) {
                task.subtasks.forEach(subtask => subtask.isDone = true);
            }
            
    
            // Setzt den Fortschritt auf 100%
            progressPercent = 100;
            progressBar.style.width = "100%";
            progressText.textContent = "100% erledigt";
    
            // Setzt das Datum auf jetzt
            task.doneAt = new Date().toLocaleString("de-DE");
            document.getElementById("task-done").textContent = task.doneAt;
    
            saveTasks(); // Speichert die geänderten Werte

        });
    
        saveTasks();
    }

    // Diese Funktion sorgt dafür, dass Änderungen im localStorage sofort in der UI reflektiert werden
    window.addEventListener("storage", function (event) {
        if (event.key === "tasks") {
            loadTasks(); // Wenn die Aufgaben im localStorage aktualisiert werden, werden sie neu geladen
        }
    });

    // Laden der Aufgaben aus dem localStorage
    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        task = tasks.find(t => t.id === taskId); // Das spezifische Task-Objekt nachladen
        renderTasks();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menu-button");
    const sidebar = document.getElementById("sidebar");
    const closeButton = document.getElementById("close-button");

    // Sidebar beim Hovern über den Button öffnen
    menuButton.addEventListener("mouseenter", () => {
        sidebar.classList.add("show");
    });

    // Sidebar bleibt offen, bis man sie mit dem Schließen-Button schließt
    closeButton.addEventListener("click", () => {
        sidebar.classList.remove("show");
    });

    sidebar.addEventListener("mouseleave", () => {
        sidebar.classList.remove("show")
    })
});







const switch1 = document.getElementById("switch");

switch1.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.removeItem("darkMode"); // Entfernt den Eintrag
    }
});




const switchDarlMode = localStorage.getItem("darkMode")
if  (switchDarlMode) {
    document.body.classList.toggle("dark-mode");
}





