let tasks = []; // speichert alle Aufgaben
let lastSortedColumn = null; 
let lastSortDirection = true; 

//Neue Aufgaben hinzufügen + Einfügen ins Array
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



















// Aufgaben ins local Storage speichern
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}























// Aufgaben aus dem local Storage laden
function loadTasks() {
    const storedTasks = localStorage.getItem("tasks"); 
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks(); 
}
























// Erstellt neue Spalten und hängt sie an den Körper
function renderTasks(filter = "all") { 
    const taskTableBody = document.querySelector("#task-table tbody"); 
    taskTableBody.innerHTML = ""; 
    
    tasks
        .filter(task => { 
            if (filter === "done") return task.isDone; 
            if (filter === "not-done") return !task.isDone; 
            return true; 
        })
        .forEach(task => { 
            const row = document.createElement("tr"); 
            row.classList.toggle("done", task.isDone);
            row.addEventListener("click", () => openTaskInNewPage(task.id));

            const taskTextCell = document.createElement("td"); 
            taskTextCell.textContent = task.text; 
            row.appendChild(taskTextCell); 

            const createdAtCell = document.createElement("td"); 
            createdAtCell.textContent = task.createdAt; 
            row.appendChild(createdAtCell); 




            const doneAtCell = document.createElement("td");  
            const storedTasks = JSON.parse(localStorage.getItem("tasks1")) || [];
            console.log("Suche nach ID:", task.id);
            console.log("Verfügbare IDs im localStorage:", storedTasks.map(t => t.id));
            const storedTask = storedTasks.find(t => t.id == task.id);
 
           


            doneAtCell.textContent = storedTask && storedTask.doneAt ? storedTask.doneAt : "-";
            row.appendChild(doneAtCell);
            






            const actionsCell = document.createElement("td"); 
            actionsCell.classList.add("actions"); 
            const deleteButton = document.createElement("button"); 
            deleteButton.textContent = "Löschen"; 
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation(); // Verhindert, dass `openTaskInNewPage` aufgerufen wird
                deleteTask(task.id);
            });
            actionsCell.appendChild(deleteButton); 

            row.appendChild(actionsCell);
            taskTableBody.appendChild(row);
        });

    if (lastSortedColumn !== null) { 
        sortTable(lastSortedColumn, true);
    }
}


























// Status der Aufgabe umschalten
function toggleTaskDone(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isDone = !task.isDone;
        task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null;
        saveTasks();
        renderTasks();
    }
}



















// Aufgaben löschen
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId); 
    saveTasks(); 
    renderTasks(); 
}





















// Hinzufügen Button zum Leben erwecken plus Fehlermeldung bei keiner eingabe
document.getElementById("add-task-button").addEventListener("click", () => { 
    const taskInput = document.getElementById("task-input"); 
    const taskValue = taskInput.value.trim(); 

    if (taskValue === "") {
        alert("Bitte geben Sie eine Aufgabe ein."); 
        return;
    }

    addTask(taskValue);
    taskInput.value = ""; 
});


















// Filter Buttons werden zum leben erweckt und definiert
document.getElementById("show-all-button").addEventListener("click", () => { 
    renderTasks("all"); 
});

document.getElementById("show-done-button").addEventListener("click", () => {
    renderTasks("done"); 
});

document.getElementById("show-not-done-button").addEventListener("click", () => {
    renderTasks("not-done");
});






























let sortDirections = [false, false, false];

// führt den enthaltenden Code aus sobald das HTML Element vollständig geladen wurde
document.addEventListener("DOMContentLoaded", function () {
    loadTasks(); 
    const headers = document.querySelectorAll("#task-table th");
    headers.forEach((header, index) => {
        header.addEventListener("click", function () {
            sortTable(index);
        });
    });
});

// sorgt dafür das die einzelnen Zeilen sortiert werden
function sortTable(columnIndex, keepDirection = false) {
    const table = document.getElementById("task-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    if (!keepDirection) {
        sortDirections[columnIndex] = !sortDirections[columnIndex];
    }
    const isAscending = sortDirections[columnIndex];

    lastSortedColumn = columnIndex;
    lastSortDirection = isAscending;

    rows.sort((a, b) => {
        let aText = a.children[columnIndex].textContent.trim();
        let bText = b.children[columnIndex].textContent.trim();

        return isAscending
            ? aText.localeCompare(bText, "de", { numeric: true })
            : bText.localeCompare(aText, "de", { numeric: true });
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));

    resetArrows();
    const arrow = table.querySelectorAll("th")[columnIndex].querySelector(".arrow");
    if (arrow) {
        arrow.classList.toggle("up", isAscending);
    }
}

// setzt alle Sortierpfeile in der Tabellenüberschrift zurück
function resetArrows() {
    const arrows = document.querySelectorAll(".arrow");
    arrows.forEach(arrow => arrow.classList.remove("up"));
}



























// öffnet eine neue Seite 
function openTaskInNewPage(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskTitle = encodeURIComponent(task.text);
    const taskCreated = encodeURIComponent(task.createdAt);
    const taskDone = encodeURIComponent(task.doneAt || "-");

    const url = `task.html?title=${taskTitle}&created=${taskCreated}&done=${taskDone}`;
    console.log("Öffne URL", url);

    // Öffne jedes Task-Fenster mit einem eindeutigen Namen basierend auf der taskId
    window.open(url, `_blank_${taskId}`, "noopener,noreferrer");
}




