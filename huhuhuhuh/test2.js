let tasks = [];
let lastSortedColumn = null;
let lastSortDirection = true;























function addTask(text) {
    
    const newTask = {
        id: Date.now(),
        text: text,
        createdAt: new Date().toLocaleString("de-DE"),
        doneAt: null,
        isDone: false,
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}




// Seite lädt: Checkboxen rendern
document.addEventListener("DOMContentLoaded", renderCheckboxes);















let tasks1 = JSON.parse(localStorage.getItem("Tags")) || [];

function addTags(name, color) {
    const newTag = {
        id: Date.now(),
        name: name,
        color: color
    };

    tasks1.push(newTag);
    localStorage.setItem("Tags", JSON.stringify(tasks1)); // Tags im localStorage speichern
    displayTags(); // Tags anzeigen
}




























function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


































function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
    renderTasks();
}










































function renderTasks(filter = "all", allowedIds = []) {
    const taskTableBody = document.querySelector("#task-table tbody");
    taskTableBody.innerHTML = "";

    // IDs aus localStorage holen und sicherstellen, dass es ein Array ist
    let whichToDos = JSON.parse(localStorage.getItem("Gespeicherte ids zum ausgeben")) || [];
    if (!Array.isArray(whichToDos)) {
        console.log("whichToDos war kein Array, wird konvertiert!");
        whichToDos = [whichToDos];
    }

    console.log("Gefilterte Task-IDs:", whichToDos);

    tasks
        .filter(task => {
            // Prüfen, ob die Task-ID in der erlaubten Liste enthalten ist
            if (whichToDos.length > 0) {
                return whichToDos.includes(String(task.id));  // Konvertiere task.id zu einem String
            }
            return true;
        })
        .filter(task => {
            if (filter === "done") return task.isDone;
            if (filter === "not-done") return !task.isDone;
            return true;
        })
        .forEach(task => {
            const row = document.createElement("tr");
            row.classList.toggle("done", task.isDone);

            const taskTextCell = document.createElement("td");
            taskTextCell.textContent = task.text;
            taskTextCell.addEventListener("click", () => openTaskInNewPage(task.id));
            row.appendChild(taskTextCell);

            const createdAtCell = document.createElement("td");
            createdAtCell.textContent = task.createdAt;
            createdAtCell.addEventListener("click", () => openTaskInNewPage(task.id));
            row.appendChild(createdAtCell);

            const doneAtCell = document.createElement("td");
            const allSubtasksDone = task.subtasks && task.subtasks.every(subtask => subtask.isDone);
            const progressPercent = task.subtasks ? Math.round((task.subtasks.filter(t => t.isDone).length / task.subtasks.length) * 100) : 0;
            if (progressPercent === 100 && allSubtasksDone) {
                doneAtCell.textContent = task.doneAt || new Date().toLocaleString("de-DE"); 
                task.isDone = true;
                saveTasks();
            } else {
                doneAtCell.textContent = "-";
                task.isDone = false;
                saveTasks();
            }
            doneAtCell.addEventListener("click", () => openTaskInNewPage(task.id));
            row.appendChild(doneAtCell);

            const actionsCell = document.createElement("td");
            actionsCell.classList.add("actions");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Löschen";
            deleteButton.classList.add("deleteButton")
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteTask(task.id);
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            const tagCell = document.createElement("td");
            tagCell.classList.add("tagCell");

            const tagButton = document.createElement("span");
            tagButton.classList.add("tagButton");
            tagButton.textContent = "+";        
            tagCell.appendChild(tagButton);

            tagButton.addEventListener("click", function (event) {
                event.stopPropagation();
                document.getElementById("tagContainer").classList.add("showTag");
            
                document.getElementById("tagContainer").setAttribute("data-task-id", task.id);
                console.log("Tag-Button geklickt bei Task-ID:", task.id);
            
                const giveMeStorage = JSON.parse(localStorage.getItem("Diese tags wurden ausgewählt")) || {};
                console.log("Gespeicherte Tags", giveMeStorage);
            
                const giveMeTag = JSON.parse(localStorage.getItem("Tags")) || [];
                console.log("Verfügbare Tags", giveMeTag);
            
                if (!giveMeStorage[task.id]) {
                    console.log("Keine Tags für diese Task-ID gefunden.");
                    tagButton.textContent = "Keine Tags";
                    return;
                }
            
                const selectedTagIds = giveMeStorage[task.id]; 
                console.log("Gefundene Tag-IDs für Task:", selectedTagIds);
            
                // Tags filtern, die zur Task-ID gehören
                const compareTags = giveMeTag.filter(search => selectedTagIds.includes(String(search.id)));
                console.log("Gefilterte Tags:", compareTags);
            
                const filterName = compareTags.map(tag => tag.name);
                console.log("Gefiltert nach Name:", filterName);
            
                tagButton.textContent = filterName.length > 0 ? filterName.join(", ") : "Keine Tags";
                

            });

            row.appendChild(tagCell);
            taskTableBody.appendChild(row);
        });

    if (lastSortedColumn !== null) {
        sortTable(lastSortedColumn, true);
    }
}











































function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}












































let sortDirections = [false, false, false]; // Um die Sortierrichtung zu speichern

document.addEventListener("DOMContentLoaded", function () {
    loadTasks(); // Hier ist davon auszugehen, dass du Aufgaben lädst (falls nötig)
    const headers = document.querySelectorAll("#task-table th");
    headers.forEach((header, index) => {
        header.addEventListener("click", function () {
            sortTable(index);
        });
    });
});

// Sortiert die Tabelle basierend auf der gewählten Spalte
function sortTable(columnIndex, keepDirection = false) {
    const table = document.getElementById("task-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    if (!keepDirection) {
        sortDirections[columnIndex] = !sortDirections[columnIndex];
    }
    const isAscending = sortDirections[columnIndex];

    rows.sort((a, b) => {
        let aText = a.children[columnIndex].textContent.trim();
        let bText = b.children[columnIndex].textContent.trim();

        return isAscending
            ? aText.localeCompare(bText, "de", { numeric: true })
            : bText.localeCompare(aText, "de", { numeric: true });
    });

    tbody.innerHTML = "";  // Löscht die Zeilen
    rows.forEach(row => tbody.appendChild(row));  // Fügt sie sortiert wieder hinzu

    resetHeaders(); // Entfernt die Markierung von allen Headern
    const header = table.querySelectorAll("th")[columnIndex];
    header.classList.add("active-header"); // Markiert den aktiven Header

    resetArrows(); // Setzt alle Pfeile zurück
    const arrow = header.querySelector(`.arrow${columnIndex + 1}`);
    if (arrow) {
        // Wechselt zwischen aufsteigend und absteigend
        if (isAscending) {
            arrow.classList.add("up"); // Pfeil nach oben (grün)
            arrow.classList.remove("down");
        } else {
            arrow.classList.add("down"); // Pfeil nach unten (rot)
            arrow.classList.remove("up");
        }
    }
}

// Setzt alle Header zurück
function resetHeaders() {
    const headers = document.querySelectorAll("#task-table th");
    headers.forEach(header => {
        header.classList.remove("active-header");
    });
}

// Setzt die Pfeile zurück
function resetArrows() {
    const arrows = document.querySelectorAll(".arrow1, .arrow2, .arrow3");  // Pfeile ansprechen
    arrows.forEach(arrow => {
        arrow.classList.remove("up", "down"); // Entfernt die Klassen für Pfeile
    });
}
















































// Um Haupt Aufgaben hinzuzufügen
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






























/*let taskAndTag = JSON.parse(localStorage.getItem("taskAndTag")) || [];

const saveTag = document.getElementById("saveTag");

saveTag.addEventListener("click", function () {
    const taskInput2 = document.getElementById("tagInput");
    let taskValue2 = taskInput2.value.trim();

    if (taskValue2 === "") {
        alert("Bitte geben Sie einen Tag ein.");
        return;
    }

    const storedTags = JSON.parse(localStorage.getItem("Tags")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    console.log("Tags aus localStorage:", storedTags);
    console.log("Gesuchter Tag:", taskValue2);

    const foundTag = storedTags.find(tag => 
        typeof tag.name === "string" && tag.name.trim().toLowerCase() === taskValue2
    );
    if (!foundTag) {
        alert("Tag nicht gefunden");
        return;
    }
    alert("Tag existiert");


    if (tasks.length === 0) {
        alert("Keine Aufgaben vorhanden.");
        return;
    }

    const selectedTaskId = tasks[0].id; 

    
    const exists = taskAndTag.some(entry => entry.taskId === selectedTaskId && entry.tagId === foundTag.id);

    if (exists) {
        alert("Dieses Tag wurde der Aufgabe bereits zugewiesen.");
        return;
    }

    
    taskAndTag.push({
        taskId: selectedTaskId,
        tagId: foundTag.id
    });

    localStorage.setItem("taskAndTag", JSON.stringify(taskAndTag));

    console.log("Gespeicherte Verknüpfungen:", taskAndTag);
});
*/







//Tags für Hauptaufgaben zuweißen
const checkboxContainer = document.getElementById("checkboxContainer");
const selectedToppingsDisplay = document.getElementById("selectedToppings");

// Funktion zum Laden und Anzeigen der Checkboxen
function renderCheckboxes() {
    checkboxContainer.innerHTML = ""; // Vorherige entfernen

    const tags = JSON.parse(localStorage.getItem("Tags")) || [];
    //console.log("Tags aus localStorage:", tags); // Debugging

    tags.forEach(tag => {
        let label = document.createElement("label");
        
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag.id;
        checkbox.classList.add("tag-checkbox");
        checkbox.addEventListener("change", updateSelection);

        let colorBox = document.createElement("span");
        colorBox.style.display = "inline-block";
        colorBox.style.width = "12px";
        colorBox.style.height = "12px";
        colorBox.style.backgroundColor = tag.color || "#ffffff"; 
        colorBox.style.marginRight = "5px";
        colorBox.style.border = "1px solid #000"; 

        label.appendChild(checkbox);
        label.appendChild(colorBox);
        label.appendChild(document.createTextNode(tag.name));

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(document.createElement("br"));

      
    });
}



// Auswahl der Checkboxen speichern
function updateSelection() {
    
        const selectedOptions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                                    .map(checkbox => checkbox.value);
        
        console.log("Diese id wurde ausgewählt", selectedOptions);
    
        const tagContainer = document.getElementById("tagContainer");
        const aktuelleTaskId = tagContainer.getAttribute("data-task-id");
    
        if (!aktuelleTaskId) {
            console.error("Keine Task-ID gefunden!");
            return;
        }
    
        // Bestehende Tags holen oder leeres Objekt nutzen
        let gespeicherteTags = JSON.parse(localStorage.getItem("Diese tags wurden ausgewählt")) || {};
    
        // Die ausgewählten Tags für die aktuelle Task-ID speichern
        gespeicherteTags[aktuelleTaskId] = selectedOptions;
    
        // Speichern
        localStorage.setItem("Diese tags wurden ausgewählt", JSON.stringify(gespeicherteTags));
    
        console.log("Aktualisierte Tags für Task-ID", aktuelleTaskId, ":", selectedOptions);
    

    if (!aktuelleTaskId) {
        console.error("Keine Task-ID gefunden!");
        return;
    }

    // Bestehende Tags holen oder leeres Array nutzen
    let savedTags = JSON.parse(localStorage.getItem("Ausgewählte Tags")) || [];

    // Entferne alte Einträge für diese Task-ID
    savedTags = savedTags.filter(entry => entry.id !== aktuelleTaskId);

    // Füge neue Einträge hinzu
    selectedOptions.forEach(tag => {
        if (!savedTags.some(entry => entry.taskId === aktuelleTaskId && entry.tagId === tag)) {
            savedTags.push({ taskId: aktuelleTaskId, tagId: tag });
        }
    });

    // Speichern
    localStorage.setItem("Ausgewählte Tags", JSON.stringify(savedTags));

    console.log("Aktualisierte Tags für Task:", savedTags);

}




renderCheckboxes();











function addTag(name, color) {
    const tags = JSON.parse(localStorage.getItem("Tags")) || [];

    if (tags.some(tag => tag.name === name)) {
        alert("Tag existiert bereits!");
        return;
    }

    tags.push({ name, color });
    localStorage.setItem("Tags", JSON.stringify(tags));
    console.log("Neuer Tag hinzugefügt:", tags);

    renderCheckboxes();

}
// Button um Tags zu erstellen
document.getElementById("add-tags-button").addEventListener("click", () => {
    const taskInput1 = document.getElementById("task-input-tags");
    const taskValue1 = taskInput1.value.trim();
    const colorPicker = document.getElementById("color-picker");
    const selectedColor = colorPicker.value; // Die ausgewählte Farbe aus dem Farb-Picker

    if (taskValue1 === "") {
        alert("Bitte geben Sie eine Aufgabe ein.");
        return;
    }
    // Das Tag wird mit dem eingegebenen Namen und der ausgewählten Farbe hinzugefügt
    addTags(taskValue1, selectedColor);
    taskInput1.value = ""; // Eingabefeld für den Namen zurücksetzen
    colorPicker.value = "#ffffff"; // Den Farb-Picker zurücksetzen (Standardfarbe)
});












function displayTags() {
    const tagList = document.getElementById("tagList");
    tagList.innerHTML = ""; 
    
    let listTag = JSON.parse(localStorage.getItem("Tags")) || [];
    console.log(listTag);

    listTag.forEach((tag, index) => { 
        const li = document.createElement("li");
        li.textContent = tag.name;
        li.style.backgroundColor = tag.color;

        const deleteButtonTags = document.createElement("button");
        deleteButtonTags.textContent = "Löschen";
        deleteButtonTags.classList.add("deleteButtonTags");

        deleteButtonTags.addEventListener("click", function () {
            listTag.splice(index, 1); 
            localStorage.setItem("Tags", JSON.stringify(listTag)); 
            displayTags(); 
        });

        li.appendChild(deleteButtonTags);
        tagList.appendChild(li);
    });
}
document.addEventListener("DOMContentLoaded", displayTags);






function displayTagsFilter() {
    const tagList1 = document.getElementById("tagListFiltern");
    tagList1.innerHTML = ""; // Liste leeren

    let listTag1 = JSON.parse(localStorage.getItem("Tags")) || [];
    console.log("Geladene Tags:", listTag1);

    listTag1.forEach(tag => { 
        const li1 = document.createElement("li");
        li1.textContent = tag.name;
        li1.style.backgroundColor = tag.color;
        li1.id = tag.id;
    

        tagList1.appendChild(li1);

        li1.addEventListener("click", function () {
            const filterTags = JSON.parse(localStorage.getItem("Ausgewählte Tags")) || [];
            console.log("Ausgewählte Tags", filterTags);
            console.log("Geklicktes Element", tag.id);
        
            const storedTaskIds = JSON.parse(localStorage.getItem("Gespeicherte ids zum ausgeben")) || [];
        
            // Prüfen, ob dieser Tag bereits aktiv gefiltert ist
            const matchingTag = filterTags.filter(task => String(task.tagId) === String(tag.id));
        
            if (matchingTag.length > 0) {
                const taskIds = matchingTag.map(task => task.taskId); // Alle taskIds extrahieren
                console.log("Task-IDs:", taskIds);
        
                if (JSON.stringify(storedTaskIds) === JSON.stringify(taskIds)) {
                    // Wenn der Filter bereits gesetzt ist -> Zurücksetzen
                    console.log("Filter wird entfernt");
                    localStorage.removeItem("Gespeicherte ids zum ausgeben");
                    document.getElementById("show-filter-button").classList.remove("active");
                    renderTasks(); // Standardansicht ohne Filter
                    return;
                }
        
                // Filter setzen
                console.log("Filter wird gesetzt");
                localStorage.setItem("Gespeicherte ids zum ausgeben", JSON.stringify(taskIds));
                document.getElementById("show-filter-button").classList.add("active");
                document.getElementById("show-all-button").classList.remove("active");
                document.getElementById("show-done-button").classList.remove("active");
                document.getElementById("show-not-done-button").classList.remove("active");
        
                renderTasks(); // Gefilterte Aufgaben anzeigen
            } else {
                console.log("Kein passendes Objekt gefunden.");
            }
        });
    });

    const showAllToDo = document.getElementById("showAllToDo")
    showAllToDo.addEventListener("click", function (){
        localStorage.removeItem("Gespeicherte ids zum ausgeben")
        document.getElementById("show-all-button").classList.toggle("active");
        document.getElementById("show-filter-button").classList.remove("active");
        renderTasks("all")
    })

}
document.addEventListener("DOMContentLoaded", displayTagsFilter);
















// Menübalken anzeigen zu lassen
document.getElementById("addTag").addEventListener("click", function () {
    document.getElementById("popup").classList.add("show3"); // Popup anzeigen
});

// Schließen des Menübalken bei Klick auf das "X"
document.querySelector(".close4").addEventListener("click", function () {
    document.getElementById("popup").classList.remove("show3"); // Popup ausblenden
});






document.getElementById("addTag1").addEventListener("click", function () {
    document.getElementById("tagErstellen").classList.add("show1"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
});
document.querySelector(".close2").addEventListener("click", function () {
    document.getElementById("tagErstellen").classList.remove("show1"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
});


document.getElementById("addTag2").addEventListener("click", function () {
    document.getElementById("tagBearbeiten").classList.add("show2"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
});
document.querySelector(".close3").addEventListener("click", function () {
    document.getElementById("tagBearbeiten").classList.remove("show2"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
});



document.querySelector(".close6").addEventListener("click", function () {
    document.getElementById("tagContainer").classList.remove("showTag"); // Popup ausblenden
});


document.getElementById("addTag3").addEventListener("click", function () {
    document.getElementById("tagFiltern").classList.add("show10"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
});
document.querySelector(".close10").addEventListener("click", function () {
    document.getElementById("tagFiltern").classList.remove("show10"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
});


document.getElementById("show-filter-button").addEventListener("click", function(){
    document.getElementById("tagFiltern").classList.add("show10"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
    document.getElementById("show-filter-button").classList.toggle("active");
    document.getElementById("show-done-button").classList.remove("active");
    document.getElementById("show-not-done-button").classList.remove("active");
    document.getElementById("show-all-button").classList.remove("active");
})
























document.getElementById("show-all-button").addEventListener("click", () => {
    const button = document.getElementById("show-all-button");
    const isActive = button.classList.contains("active");

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-done-button").classList.remove("active");
        document.getElementById("show-not-done-button").classList.remove("active");
        document.getElementById("show-filter-button").classList.remove("active");

        renderTasks("all");
    }
});

document.getElementById("show-done-button").addEventListener("click", () => {
    const button = document.getElementById("show-done-button");
    const isActive = button.classList.contains("active");

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("show-not-done-button").classList.remove("active");
        document.getElementById("show-all-button").classList.remove("active");

        renderTasks("done");
    }
});

document.getElementById("show-not-done-button").addEventListener("click", () => {
    const button = document.getElementById("show-not-done-button");
    const isActive = button.classList.contains("active");

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-done-button").classList.remove("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("show-all-button").classList.remove("active");

        renderTasks("not-done");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    loadTasks();

    window.addEventListener("storage", () => {
        loadTasks();
    });
});








































function openTaskInNewPage(taskId) {
    window.open(`task.html?id=${taskId}`, `_blank_${taskId}`, "noopener,noreferrer");
}









































window.addEventListener("storage", function (event) {
    if (event.key === "tasks") {
        loadTasks(); // Aktualisiert die Aufgaben in der Tabelle
    }
});

























const switch1 = document.getElementById("switch");

  switch1.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", "enabled")
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