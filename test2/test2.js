let tasks = []; // speichert alle Aufgaben
let lastSortedColumn = null; // speichert die zuletzt sortierte Spalte
let lastSortDirection = true; // speichert ob die letzte Sortierung aufsteigend oder absteigend war

function addTask(text) {
    const newTask = {
        id: Date.now(),
        text: text,
        createdAt: new Date().toLocaleString("de-DE"),
        doneAt: null,
        isDone: false
    };
    tasks.push(newTask); // wird ins array gespeichert
    saveTasks(); // speichert Array im locale Storage
    renderTasks(); // zeigt die Aktualisierte Aufgabenliste an
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();
}

function renderTasks(filter = "all") { // filter kann all,done oder not-done sein 
    const taskTableBody = document.querySelector("#task-table tbody"); // wählt den Tabellenkörper aus
    taskTableBody.innerHTML = "";  // löscht den aktuellen Tabelleninhalt

    tasks
        .filter(task => { 
            if (filter === "done") return task.isDone; // zeigt nur die Erledigten Aufgaben an
            if (filter === "not-done") return !task.isDone; // zeigt nur die Unerledigten Aufgaben an
            return true; // Zeigt alle Aufgaben an
        })
        .forEach(task => { // Nachdem Filter wird für jede gefiterte Aufgabe 
            const row = document.createElement("tr"); // ein neues tr Elenent erstellt
            row.classList.toggle("done", task.isDone); // Falls erledigt bekommt sie die Klasse done
            row.addEventListener("click", () => openTaskInNewPage(task.id));
                
         

            const taskTextCell = document.createElement("td"); // Erstellt eine zeile
            taskTextCell.textContent = task.text; // gibt den input Text als Inhalt
            row.appendChild(taskTextCell); // hängt sie an die Zelle
   

            const createdAtCell = document.createElement("td"); // Erstellt eine neue zeile
            createdAtCell.textContent = task.createdAt; //gibt das Erstellungsdatum als Inhalt an
            row.appendChild(createdAtCell); // hängt sie an die Zelle

            const doneAtCell = document.createElement("td");  // Erstellt eine neue Zeile
            doneAtCell.textContent = task.doneAt || "-"; // gibt das Erledigungsdatum als Inhalt an oder -
            row.appendChild(doneAtCell); // hängt sie an die Zelle

            const actionsCell = document.createElement("td"); // Erstellt eine neue Zeile
            actionsCell.classList.add("actions"); // gibt eine Klasse für actionsCell
            const doneButton = document.createElement("button"); // Erstellt einen Button
            doneButton.textContent = task.isDone ? "Rückgängig" : "Erledigt"; // gib den Text Inhalt des Buttons an
            doneButton.addEventListener("click", () => toggleTaskDone(task.id)); // man gibt dem Button eine Klick funktion und zwar das er toggleTaskDone aufrufen soll wenn Klicl
            actionsCell.appendChild(doneButton);  // hängt den Button an die neu erstellte Zeile an
            const deleteButton = document.createElement("button"); // Erstellt einen neuen Button
            deleteButton.textContent = "Löschen"; // gibt den text Inhalt des Buttons an
            deleteButton.addEventListener("click", () => deleteTask(task.id)); // gibt dem Button eine Klick funktion und zwar soll er beim Klick zu deketeTask springen
            actionsCell.appendChild(deleteButton); // hängt deb Lösch Button an die neue Zeile an

            row.appendChild(actionsCell); // hängt die Zeile an die Zelle an
            taskTableBody.appendChild(row); // hängt die komplette Zeile an die Tabelle an
        });

    
    if (lastSortedColumn !== null) { 
        sortTable(lastSortedColumn, true);
    }
}

function toggleTaskDone(taskId) { 
    const task = tasks.find(t => t.id === taskId); // findet die Aufgabe mit der übergebenen taskID
    if (task) { 
        task.isDone = !task.isDone; //  ändert den Status (isDone)
        task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null; // falls erledigt wird doneAt mit aktuellem Datum gefüllt sonst auf null gesetzt
        saveTasks(); // speichert Änderungen
        renderTasks(); // aktualisiert die Anzeige mit den Änderungen
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId); // entfernt die Aufgaben mit taskID und tasks
    saveTasks(); // speichert die Liste 
    renderTasks(); // aktualisiert die Anzeige
}

document.getElementById("add-task-button").addEventListener("click", () => { // Klick Funktion für Button zum Hinzufügen
    const taskInput = document.getElementById("task-input"); // Hollt sich den Input aus dem Eingabefeld
    const taskValue = taskInput.value.trim(); // entfernt alle Lerzeichen

    if (taskValue === "") {
        alert("Bitte geben Sie eine Aufgabe ein."); // wenn input Leer ist wird Warnung ausgesprochen
        return;
    }

    addTask(taskValue);
    taskInput.value = ""; // leert das Eingabefeld
});

document.getElementById("show-all-button").addEventListener("click", () => { // Gibt Filter Button Klick Funbktion
    renderTasks("all"); // alle anzeigen durch den Filter
});

document.getElementById("show-done-button").addEventListener("click", () => {
    renderTasks("done"); // nur done Anzeigen durch den Filter
});

document.getElementById("show-not-done-button").addEventListener("click", () => {
    renderTasks("not-done"); // nur nicht done Anzeigen durch den Filter

});




let sortDirections = [false, false, false];

document.addEventListener("DOMContentLoaded", function () {
    const headers = document.querySelectorAll("#task-table th");
    headers.forEach((header, index) => {
        header.addEventListener("click", function () {
            sortTable(index);
        });
    });
});

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
    if (isAscending) {
        arrow.classList.add("up");
    } else {
        arrow.classList.remove("up");
    }
}

function resetArrows() {
    const arrows = document.querySelectorAll(".arrow");
    arrows.forEach(arrow => arrow.classList.remove("up"));
}


function openTaskInNewPage(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html lang="de">
        <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Aufgabendetails</title>
         <style>
             body { font-family: Arial, sans-serif; padding: 20px; }
             h1 { color: darkblue; }
             h2 {color: blue;}
             p { font-size: 18px; }
             #task-input1 {
               width: 300px; 
               padding: 10px; 
               margin: 10px 0; 
               border: 2px solid #ccc; 
               border-radius: 5px; 
               font-size: 16px; 
             }
             #add-task-button {
              background-color: whitesmoke; 
              color: grey; 
              border: none;
              height: 40px;
              width: 163px;
              border-radius: 5px; 
              padding: 10px 20px;
              font-size: 16px; 
              cursor: pointer;
             }
             #add-task-button:hover {
              background-color: red;
              color: white;
             }  
         </style>
        </head>
        <body>
         <div class="container">
             <h1>Aufgabendetails zu:</h1>
             <h2>${task.text}</h2>
             <input type="text" id="task-input1" placeholder="Neue Aufgabe hinzufügen...">
             <button id="add-task-button">Hinzufügen</button>
             <div class="progress-bar">
                 <div id="progress" class="progress"></div>
             </div>    
             <ul id="task-list1"></ul>

             <p><strong>Erstellt am:</strong> ${task.createdAt}</p>
             <p><strong>Erledigt am:</strong> ${task.doneAt || "-"}</p>
             <button onclick="window.close()">Schließen</button>
         </div>    

         <script>
             let tasks1 = [];


             function addTask1(text) {
                 const newTask1 = {
                     id: Date.now(), 
                     text: text,
                     createdAt: new Date().toLocaleString("de-DE"),
                     doneAt: null,
                     isDone: false
                  };
                  tasks1.push(newTask1);
                  saveTasks1();
                  renderTasks1();
               }

             function toggleTaskDone1(taskId) {
                 const task = tasks1.find(t => t.id === taskId);
                 if (task) {
                     task.isDone = !task.isDone;
                     task.doneAt = task.isDone ? new Date().toLocaleString("de-DE") : null;
                     saveTasks1();
                     renderTasks1();
                   }
              }


             function deleteTask1(taskId) {
                 tasks1 = tasks1.filter(t => t.id !== taskId);
                 saveTasks1();
                 renderTasks1();
               }


             function saveTasks1() {
                 localStorage.setItem("tasks1", JSON.stringify(tasks1));
               }


             function loadTasks1() {
                 tasks1 = JSON.parse(localStorage.getItem("tasks1")) || [];
                 renderTasks1();
               }


             function renderTasks1() {
                  const taskList1 = document.getElementById("task-list1");
                  taskList1.innerHTML = ""; 

                 tasks1.forEach(task => {
                     const listItem1 = document.createElement("li");
                     listItem1.classList.add("task-item");
                     listItem1.textContent = task.text;
                     listItem1.setAttribute("data-id", task.id);
                     if (task.isDone) listItem1.classList.add("done");


                     listItem1.addEventListener("click", function () {
                     toggleTaskDone1(task.id);
                     });

                     const deleteButton1 = document.createElement("button");
                     deleteButton1.textContent = "Löschen";
                     deleteButton1.addEventListener("click", function () {
                     deleteTask1(task.id);
                     });
                     listItem1.appendChild(deleteButton1);

                     taskList1.appendChild(listItem1);
                     });
               }

             document.getElementById("add-task-button").addEventListener("click", function () {
                   const taskInput1 = document.getElementById("task-input1");
                   const taskValue1 = taskInput1.value.trim();

                   if (taskValue1 === "") {
                      alert("Bitte geben Sie etwas ein, bevor Sie den Button drücken");
                      return;
               }

             addTask1(taskValue1);
             taskInput1.value = "";
});

document.addEventListener("DOMContentLoaded", loadTasks1);

         </script>
        </body> 
        </html>
    `);
    newWindow.document.close();

    saveTasks();
    renderTasks();
}

document.addEventListener("DOMContentLoaded", loadTasks);