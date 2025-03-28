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










































function renderTasks(filter = "all") {
    const taskTableBody = document.querySelector("#task-table tbody");
    taskTableBody.innerHTML = "";

    // IDs aus localStorage holen und sicherstellen, dass es ein Array ist
    let whichToDos = JSON.parse(localStorage.getItem("Gespeicherte ids zum ausgeben")) || [];
    if (!Array.isArray(whichToDos)) {
        console.log("whichToDos war kein Array, wird konvertiert!");
        whichToDos = [whichToDos];
    }
    console.log("Gefilterte Task-IDs:", whichToDos);

    let whichToDos1 = JSON.parse(localStorage.getItem("FilteredTaskIDs")) || [];
    if (!Array.isArray(whichToDos1)) {
        console.log("whichToDos war kein Array, wird konvertiert!");
        whichToDos1 = [whichToDos1];
    }
    console.log("Gefilterte Task-IDs für Prio:", whichToDos1);

    let whichToDos2 = JSON.parse(localStorage.getItem("Gefunden")) || [];
    console.log("SO mal schauen", whichToDos2)
    if (!Array.isArray(whichToDos2)) {
        console.log("whichToDos war kein Array, wird konvertiert!");
        whichToDos2 = [whichToDos2];
    }
    console.log("Gefilterte Task-IDs für Suche 222222222:", whichToDos2);
    


    
    tasks
        .filter(task => {
            // Prüfen, ob die Task-ID in der erlaubten Liste enthalten ist
            if (whichToDos.length > 0) {
                return whichToDos.includes(String(task.id));  // Sicherstellen, dass beide Strings sind
            }
            return true;
        })
         .filter(task => {
            // Prüfen, ob die Task-ID in der erlaubten Liste enthalten ist
            if (whichToDos1.length > 0) {
                return whichToDos1.includes(String(task.id));  // Sicherstellen, dass beide Strings sind
            }
            return true;
        })

        .filter(task => {
            // Prüfen, ob die Task-ID in der erlaubten Liste enthalten ist
            if (whichToDos2.length > 0) {
                return whichToDos2.includes(String(task.id));  // Sicherstellen, dass beide Strings sind
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
            actionsCell.textContent = "+";
            actionsCell.classList.add("actions");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Löschen";
            deleteButton.classList.add("deleteButton")

            const bearbeitenButton = document.createElement("button");
            bearbeitenButton.textContent = "Bearbeiten"
            bearbeitenButton.classList.add("bearebiten");

            const infoButton = document.createElement("button")
            infoButton.textContent = "Informationen"
            infoButton.classList.add("info")

            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteTask(task.id);
            });

            const informationDays = document.createElement("li")
            informationDays.classList.add("fälligkeitDate")
            

            bearbeitenButton.addEventListener("click", function () {
                const bearbeitenContainer = document.getElementById("bearbeitenContainer");
                const infoContainer = document.getElementById("infoContainer");
                bearbeitenContainer.classList.add("showTag");
                infoContainer.classList.remove("showTag");
                bearbeitenContainer.setAttribute("data-task-id", task.id);
                console.log("Bearbeiten-Button geklickt bei Task-ID:", task.id);
            
                // Daten aus localStorage abrufen
                let storedDates = JSON.parse(localStorage.getItem("taskDates")) || {};
                let storedNotes = JSON.parse(localStorage.getItem("taskNotes")) || {};
                let storedPriorities = JSON.parse(localStorage.getItem("taskPriorities")) || {};
            
                // Eingabefelder abrufen
                const dateText = document.getElementById("dateId");
                const output = document.getElementById("dateText");
                const noteText = document.getElementById("noteId");
                const outputText = document.getElementById("noteText");
                const optionPrio = document.getElementById("options");
            
                const taskId = task.id;
            
                // Falls bereits ein Datum gespeichert ist, setze es in das Input-Feld
                if (storedDates[taskId]) {
                    dateText.value = storedDates[taskId].date.replace(" ", "T");
                    output.textContent = "Gespeichertes Fälligkeitsdatum: " + storedDates[taskId].date;
                } else {
                    dateText.value = "";
                    output.textContent = "";
                }
            
                // Falls eine Notiz gespeichert ist, zeige sie an
                if (storedNotes[taskId]) {
                    noteText.value = storedNotes[taskId].note;
                    outputText.textContent = storedNotes[taskId].note;
                } else {
                    noteText.value = "";
                    outputText.textContent = "";
                }
            
                // Falls eine Priorität gespeichert ist, setze sie als ausgewählte Option
                if (storedPriorities[taskId]) {
                    for (let i = 0; i < optionPrio.options.length; i++) {
                        if (optionPrio.options[i].text === storedPriorities[taskId].priority) {
                            optionPrio.selectedIndex = i;
                            break;
                        }
                    }
                } else {
                    optionPrio.selectedIndex = 0;
                }
            
                // Fälligkeitsdatum speichern
                dateText.addEventListener("input", function () {
                    const formattedDate = dateText.value.replace("T", " ");
                    output.textContent = "Ausgewähltes Datum und Uhrzeit: " + formattedDate;
                    console.log("Ihre ausgewählte Fälligkeit:", formattedDate);
            
                    storedDates[taskId] = { id: taskId, date: formattedDate };
                    localStorage.setItem("taskDates", JSON.stringify(storedDates));
                });
            
                // Notiz speichern
                document.getElementById("checkNote").addEventListener("click", function () {
                    const noteValue = noteText.value.trim();
                    if (noteValue) {
                        console.log("Gespeicherte Notiz:", noteValue);
                        outputText.textContent = noteValue;
            
                        storedNotes[taskId] = { id: taskId, note: noteValue };
                        localStorage.setItem("taskNotes", JSON.stringify(storedNotes));
            
                        noteText.value = ""; // Eingabefeld zurücksetzen
                    }
                });
            
                // Priorität speichern
                optionPrio.addEventListener("change", function () {
                    const selectedText = optionPrio.options[optionPrio.selectedIndex].text;
                    console.log("Neue Priorität gespeichert:", selectedText);
            
                    storedPriorities[taskId] = { id: taskId, priority: selectedText };
                    localStorage.setItem("taskPriorities", JSON.stringify(storedPriorities));
                });
            });

            function setAlarm(time) {
                const now = new Date();
                const alarmTime = new Date(filterNamefromDate.replace(" ", "T")); // In Date-Objekt umwandeln
                const timeDiff = alarmTime - now; // Zeitdifferenz berechnen
            
                if (timeDiff > 0) {
                    setTimeout(() => {
                        alert("⏰ Alarm! Die Zeit ist gekommen: " + time);
                    }, timeDiff);
                    console.log("Alarm gestellt für:", time);
                } else {
                    console.log("❌ Die Zeit liegt in der Vergangenheit!");
                }
            }

            infoButton.addEventListener("click", function () {
                const infoContainer = document.getElementById("infoContainer");
                const bearbeitenContainer = document.getElementById("bearbeitenContainer");
                infoContainer.classList.add("showTag");
                bearbeitenContainer.classList.remove("showTag");
                infoContainer.setAttribute("data-task-id", task.id);
                console.log("Info-Button geklickt bei Task-ID:", task.id);
            
                const bringDates = JSON.parse(localStorage.getItem("taskDates")) || {};
                const bringNotes = JSON.parse(localStorage.getItem("taskNotes")) || {};
                const bringPrio = JSON.parse(localStorage.getItem("taskPriorities")) || {};
            
                console.log("Fälligkeiten:", bringDates);
                console.log("Notizen:", bringNotes);
                console.log("Prioritäten:", bringPrio);
            
                let filterNameFromPrio = bringPrio[task.id]?.priority || null;
                let filterNamefromNotes = bringNotes[task.id]?.note || null;
                let filterNamefromDate = bringDates[task.id]?.date || null;
            
                const dateUl = document.getElementById("dateUl");
                const noteUl = document.getElementById("noteUl");
                const prioUl = document.getElementById("prioUl");
                dateUl.innerHTML = "";
                noteUl.innerHTML = "";
                prioUl.innerHTML = "";
                
            
                function deleteTaskEntry(storageKey, taskId) {
                    let storedData = JSON.parse(localStorage.getItem(storageKey)) || {};
                    if (storedData[taskId]) {
                        delete storedData[taskId];
                        localStorage.setItem(storageKey, JSON.stringify(storedData));
                        console.log(`Eintrag mit ID ${taskId} aus ${storageKey} gelöscht.`);
                    }
                }
            
                if (filterNamefromDate) {
                    const dateLi = document.createElement("li");
                    dateLi.classList.add("dateLiElement");
                    dateLi.textContent = filterNamefromDate;

                    const deleteButtonDate = document.createElement("button");
                    deleteButtonDate.textContent = "Löschen";
                    deleteButtonDate.classList.add("deleteButtonDate");

                    deleteButtonDate.addEventListener("click", function () {
                     const taskId = document.getElementById("infoContainer").getAttribute("data-task-id"); // Task-ID aus infoContainer holen
                     console.log("Lösch-Button geklickt bei Task-ID:", taskId);
                     dateLi.remove()
                     informationDays.remove()
                 
                     deleteTaskEntry("taskDates", taskId); // Löscht die ID aus taskDates
                     
                 
                   
                    
                     });

                     const informationButtonForli = document.createElement("button")
                     informationButtonForli.textContent = "⏰ aktivieren"
                     informationButtonForli.classList.add("buttonForli")

                     informationButtonForli.addEventListener("click",function(){
                         console.log("Diese id müssen wir die Passende Hauptausfgabe finden", task.id)

                         const hollenFromMainId = JSON.parse(localStorage.getItem("tasks"))
                         console.log("Dies ist korrekt", hollenFromMainId)

                         const filterMainId = hollenFromMainId.filter(map => map.id === task.id)
                         console.log("Mal sehen was gefuden wurde", filterMainId)

                         const filterOnMainIdFilter = filterMainId.map(name => name.text)
                         console.log("Ergebnis", filterOnMainIdFilter)

                         const craeteDateForTimer =document.createElement("li")
                         craeteDateForTimer.classList.add("createDateForTimer")
                         craeteDateForTimer.textContent = "1 Tag vorher"
                         craeteDateForTimer.addEventListener("click", function(){
                             console.log("Mit welchen Datum muss man rechnen", filterNamefromDate)
                             const dateObj = new Date(filterNamefromDate.replace(" ", "T")); // In Date-Objekt umwandeln

                            dateObj.setDate(dateObj.getDate() - 1); // 1 Tag abziehen

                           
                             const formattedDate = dateObj.toISOString().slice(0, 16).replace("T", " ");
                             console.log(formattedDate); 
                          
                             let existingData = JSON.parse(localStorage.getItem("ErinnerungsDate")) || {};

                             existingData[task.id] = {
                                 ToDoName: filterOnMainIdFilter,
                                 date: formattedDate
                              };


                            localStorage.setItem("ErinnerungsDate", JSON.stringify(existingData));
                             alert("Sie werden am " + formattedDate + " an folgende To-Do erinnert " + filterOnMainIdFilter);
                         })
                         dateUl.appendChild(craeteDateForTimer)

                         

                         
                         const craeteDateForTimer1 = document.createElement("li")
                         craeteDateForTimer1.classList.add("createDateForTimer")
                         craeteDateForTimer1.textContent = "12 Stunden vorher"
                         craeteDateForTimer1.addEventListener("click", function(){
                              console.log("Mit welchen Datum muss man rechnen", filterNamefromDate)
                             const dateObj = new Date(filterNamefromDate.replace(" ", "T")); // In Date-Objekt umwandeln

                             dateObj.setHours(dateObj.getHours() - 12); // 12 Stunden abziehen

                           
                             const formattedDate = dateObj.toISOString().slice(0, 16).replace("T", " ");
                             console.log(formattedDate); 
                   

                             // 1️⃣ Vorhandene Daten aus dem localStorage holen (falls vorhanden)
                            let existingData = JSON.parse(localStorage.getItem("ErinnerungsDate")) || {};

                           existingData[task.id] = {
                               ToDoName: filterOnMainIdFilter,
                               date: formattedDate
                            };

                          localStorage.setItem("ErinnerungsDate", JSON.stringify(existingData));

                           
                          alert("Sie werden am " + formattedDate + " an folgende To-Do erinnert " + filterOnMainIdFilter);
                         })
                         dateUl.appendChild(craeteDateForTimer1)

                         const craeteDateForTimer2 =document.createElement("li")
                         craeteDateForTimer2.classList.add("createDateForTimer")
                         craeteDateForTimer2.textContent = "1 Stunde vorher"
                         craeteDateForTimer2.addEventListener("click", function(){
                             console.log("Mit welchen Datum muss man rechnen", filterNamefromDate)
                             const dateObj = new Date(filterNamefromDate.replace(" ", "T")); // In Date-Objekt umwandeln

                             dateObj.setHours(dateObj.getHours() - 0); // 12 Stunden abziehen

                           
                             const formattedDate = dateObj.toISOString().slice(0, 16).replace("T", " ");
                             console.log(formattedDate); 

                             let existingData = JSON.parse(localStorage.getItem("ErinnerungsDate")) || {};

                             existingData[task.id] = {
                                 ToDoName: filterOnMainIdFilter,
                                 date: formattedDate
                              };


                            localStorage.setItem("ErinnerungsDate", JSON.stringify(existingData));
                             alert("Sie werden am " + formattedDate + " an folgende To-Do erinnert " + filterOnMainIdFilter);
                         })
                         dateUl.appendChild(craeteDateForTimer2)

                        
                     })

                     informationDays.appendChild(informationButtonForli)
                
 
                    dateLi.appendChild(deleteButtonDate);
                    dateUl.appendChild(dateLi);
                    dateUl.appendChild(informationDays)
                }
            
                if (filterNamefromNotes) {
                    const noteLi = document.createElement("li");
                    noteLi.classList.add("noteLiElement");
                    noteLi.textContent = filterNamefromNotes;
            
                    const deleteButtonNote = document.createElement("button");
                    deleteButtonNote.textContent = "Löschen";
                    deleteButtonNote.classList.add("deleteButtonNote");
            
                    deleteButtonNote.addEventListener("click", function () {
                        const taskId = infoContainer.getAttribute("data-task-id");
                        console.log("Lösch-Button geklickt bei Task-ID:", taskId);
                        noteLi.remove();
                        deleteTaskEntry("taskNotes", taskId);
                    });
            
                    noteLi.appendChild(deleteButtonNote);
                    noteUl.appendChild(noteLi);
                }
            
                if (filterNameFromPrio) {
                    const prioLi = document.createElement("li");
                    prioLi.classList.add("prioLiElement");
                    prioLi.textContent = filterNameFromPrio;
            
                    if (filterNameFromPrio === "Hoch") prioLi.style.backgroundColor = "red";
                    if (filterNameFromPrio === "Mittel") prioLi.style.backgroundColor = "orange";
                    if (filterNameFromPrio === "Schwach") prioLi.style.backgroundColor = "green";
            
                    const deleteButtonPrio = document.createElement("button");
                    deleteButtonPrio.textContent = "Löschen";
                    deleteButtonPrio.classList.add("deleteButtonPrio");
            
                    deleteButtonPrio.addEventListener("click", function () {
                        const taskId = infoContainer.getAttribute("data-task-id");
                        console.log("Lösch-Button geklickt bei Task-ID:", taskId);
                        prioLi.remove();
                        deleteTaskEntry("taskPriorities", taskId);
                    });
            
                    prioLi.appendChild(deleteButtonPrio);
                    prioUl.appendChild(prioLi);
                }
            });

          

           

            const bringDates = JSON.parse(localStorage.getItem("taskDates")) || {};
            let filterNamefromDate = bringDates[task.id] ? bringDates[task.id].date : null;

            function getFormattedDateTime() {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const day = String(now.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            }

            function calculateRemainingDays(dueDate) {
                const today = new Date(getFormattedDateTime()); 
                const due = new Date(dueDate);
                const diffInMs = due - today; 
                return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
            }

            function updateDateStatus() {
                if (filterNamefromDate) {
                    const remainingDays = calculateRemainingDays(filterNamefromDate);
                    if (remainingDays <= 0) {  
                        row.classList.add("zero");  
                        doneAtCell.textContent = "Abgelaufen";
                    } else {
                        row.classList.remove("zero");
                        informationDays.textContent = `Noch ${remainingDays} Tage`;
                    }
                }
            }
            updateDateStatus(); 

            actionsCell.addEventListener("mouseover", function (){
                actionsCell.textContent =""
                actionsCell.appendChild(deleteButton);
                actionsCell.appendChild(bearbeitenButton);
                actionsCell.appendChild(infoButton)
             
            })
            actionsCell.addEventListener("mouseleave", function (){
                actionsCell.textContent = "+"
            })
            
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
            
            });

            row.appendChild(tagCell);
            taskTableBody.appendChild(row);

            const giveMeStorage = JSON.parse(localStorage.getItem("Diese tags wurden ausgewählt")) || {};
            console.log("Gespeicherte Tags", giveMeStorage);
            
            const giveMeTag = JSON.parse(localStorage.getItem("Tags")) || [];
            console.log("Verfügbare Tags", giveMeTag);
            
            if (!giveMeStorage[task.id]) {
                console.log("Keine Tags für diese Task-ID gefunden.");
                tagButton.textContent = "+";
                return;
            }
            
            const selectedTagIds = giveMeStorage[task.id]; 
            console.log("Gefundene Tag-IDs für Task:", selectedTagIds);
            
                // Tags filtern, die zur Task-ID gehören
            const compareTags = giveMeTag.filter(search => selectedTagIds.includes(String(search.id)));
            console.log("Gefilterte Tags:", compareTags);
            
            const filterName = compareTags.map(tag => tag.name);
            console.log("Gefiltert nach Name:", filterName);
            
            tagButton.textContent = filterName.length > 0 ? filterName.join(", ") : "+";
        });

       

        function getFormattedCurrentTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
        
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        
        const targetTime = JSON.parse(localStorage.getItem("ErinnerungsDate")) || {};
        console.log("Also das ist das richtige Darum", targetTime);
        
        // Alle gespeicherten Daten extrahieren
        const filterTargetTime = Object.values(targetTime).map(task => task.date);
        const filterTargetName = Object.values(targetTime).map(task => task.ToDoName);
        const taskIds = Object.keys(targetTime); // IDs speichern, um sie später zu löschen
        
        console.log("Gespeicherte Erinnerungen:", filterTargetTime);
        console.log("Zugehörige ToDos:", filterTargetName);
        
        const checkTime = setInterval(() => {
            const currentTime = getFormattedCurrentTime(); // Aktuelle Zeit holen
            console.log("Aktuelle Zeit:", currentTime);
        
            // Prüfen, ob die aktuelle Zeit in den gespeicherten Erinnerungen vorkommt
            const index = filterTargetTime.indexOf(currentTime);
            
            if (index !== -1) { // Falls ein Treffer gefunden wurde
                alert(`⏰ Erinnerung an Ihre ToDo: ${filterTargetName[index]}`);
                console.log("✅ Alarm wurde ausgelöst für:", filterTargetName[index]);
        
                // 1️⃣ Die ID des ausgelösten Alarms herausfinden
                const taskIdToDelete = taskIds[index];
        
                // 2️⃣ Erinnerung aus `ErinnerungsDate` entfernen
                let storedReminders = JSON.parse(localStorage.getItem("ErinnerungsDate")) || {};
                if (storedReminders.hasOwnProperty(taskIdToDelete)) {
                    delete storedReminders[taskIdToDelete]; // Entfernt die gespeicherte Erinnerung
                    localStorage.setItem("ErinnerungsDate", JSON.stringify(storedReminders)); // Speichert die aktualisierten Daten
                    console.log(`🗑️ Erinnerung für ID ${taskIdToDelete} wurde gelöscht.`);
                }
        
                // 3️⃣ Fälligkeitsdatum aus `taskDates` entfernen
                let storedTaskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
                if (storedTaskDates.hasOwnProperty(taskIdToDelete)) {
                    delete storedTaskDates[taskIdToDelete]; // Entfernt das Fälligkeitsdatum
                    localStorage.setItem("taskDates", JSON.stringify(storedTaskDates)); // Speichert die aktualisierten Daten
                    console.log(`🗑️ Fälligkeitsdatum für ID ${taskIdToDelete} wurde gelöscht.`);
                }
        
                // 4️⃣ Überprüfung beenden, falls keine Erinnerungen mehr vorhanden sind
                if (Object.keys(storedReminders).length === 0) {
                    clearInterval(checkTime);
                    console.log("⏹️ Alle Erinnerungen gelöscht, Timer gestoppt.");
                }
            }
        }, 60000);

      
       
           
       

        const getItemFromPrio = document.getElementById("optionsFilter");
        getItemFromPrio.addEventListener("change", function () {
            const getElementFromPrio = JSON.parse(localStorage.getItem("taskPriorities")) || {};
            console.log("Gespeicherte Prioritäten:", getElementFromPrio);
        
            const selectedText = getItemFromPrio.options[getItemFromPrio.selectedIndex].text; 
            console.log("Angezeigter Text:", selectedText);
        
            // Filtert IDs basierend auf der Priorität
            const matchingEntries = Object.entries(getElementFromPrio)
                .filter(([taskId, prioData]) => prioData.priority === selectedText)
                .map(([taskId, prioData]) => taskId);
        
            console.log("Passende IDs:", matchingEntries);
        
            // Speichert die gefilterten IDs im localStorage
            localStorage.setItem("FilteredTaskIDs", JSON.stringify(matchingEntries));
        
            // Aktualisiert die Hauptanzeige mit den gefilterten Tasks

            
            renderTasks();
        });
        
       
const doItAgain = document.getElementById("optionsFilter")        
 const resetAll = document.getElementById("showAllOfYou");
resetAll.addEventListener("click", function() {
    localStorage.removeItem("FilteredTaskIDs"); // Löscht den Wert aus dem localStorage
    doItAgain.value = "."
    renderTasks()
});
    
        

    if (lastSortedColumn !== null) {
        sortTable(lastSortedColumn, true);
    }


    document.addEventListener("DOMContentLoaded", () => {
        renderTasks(); // Direkt beim Laden prüfen
    });
}








const resetAll = document.getElementById("showAllOfYouSearch");
resetAll.addEventListener("click", function() {
    localStorage.removeItem("Gefunden"); // Löscht den Wert aus dem localStorage
  
    renderTasks()
})



























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


document.addEventListener("DOMContentLoaded", function () {
    const arrows = document.querySelectorAll(".arrow1, .arrow2, .arrow3");

    function setActiveArrow(activeArrow) {
        arrows.forEach(arrow => arrow.classList.remove("active")); // Alle zurücksetzen
        activeArrow.classList.add("active"); // Nur den gewählten aktivieren
    }

    document.querySelector(".arrow2").classList.add("active"); // Standardmäßig aktiv setzen

    arrows.forEach(arrow => {
        arrow.addEventListener("click", function () {
            setActiveArrow(this);
        });
    });
});













































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
        checkbox.value = tag.id || "";
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
    displayTags()
}



// Auswahl der Checkboxen speichern
function updateSelection() {
    
    const selectedOptions = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
          .map(checkbox => checkbox.value)
          .filter(value => value); // Entfernt leere Werte
        
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


    renderTasks()
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

    renderCheckboxes()
    displayTagsFilter()
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

            displayTags()
            displayTagsFilter()
            renderTasks()
            renderCheckboxes()
        });

        li.appendChild(deleteButtonTags);
        tagList.appendChild(li);
        
    });
}
document.addEventListener("DOMContentLoaded", displayTags());






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









const ctx = document.getElementById('myChart').getContext('2d'); // Canvas-Element finden

const holData = JSON.parse(localStorage.getItem("tasks"));
console.log("Hier müssen wir zählen", holData);

// Zähler für erledigte und unerledigte Aufgaben
let completedCount = 0;
let pendingCount = 0;

// Array für unerledigte Aufgaben
let pendingTasks = [];

// Prüfen, ob holData ein Array ist und Array durchlaufen
if (Array.isArray(holData)) {
  holData.forEach(task => {
    if (task.isDone) {
      completedCount++; // Wenn die Aufgabe erledigt ist, erhöhen wir den Zähler für erledigte Aufgaben
    } else {
      pendingCount++; // Wenn die Aufgabe unerledigt ist, erhöhen wir den Zähler für unerledigte Aufgaben
      pendingTasks.push(task); // Füge die unerledigte Aufgabe der Liste hinzu
    }
  });

  // Zeigt alle unerledigten Aufgaben an
  console.log("Unerledigte Aufgaben:", pendingTasks);
} else {
  console.log("Es wurde kein gültiges Array gefunden.");
}

const filterPendingTasks = pendingTasks.map(trask => trask.text)
console.log("Die gehören in die Liste", filterPendingTasks)

// Ausgabe der Anzahl erledigter und unerledigter Aufgaben
console.log(`Erledigte Aufgaben: ${completedCount}`);
console.log(`Unerledigte Aufgaben: ${pendingCount}`);


const myChart = new Chart(ctx, {
    type: 'bar', // Diagrammtyp (Balkendiagramm)
    data: {
        labels: ['Erledigt', 'Unerledigt'], // Kategorien für das Diagramm
        datasets: [{
            label: 'Erledigte und Unerledigte Aufgaben',
            data: [completedCount, pendingCount], // Werte für jede Kategorie
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'], // Verschiedene Farben für die Balken
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'], // Verschiedene Randfarben
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true // Die Y-Achse beginnt bei 0
            }
        }
    }
});

const whichAreUnresolved = document.getElementById("whichAreUnresolved")


filterPendingTasks.forEach(text => {
    const theseAreUnresolved = document.createElement("li");
    theseAreUnresolved.classList.add("unresolvedTasks")
    theseAreUnresolved.textContent = text;

    const buttonGoToList = document.createElement("button")
    buttonGoToList.textContent = "Fertig makieren";
    buttonGoToList.classList.add("buttonGoToList")

    theseAreUnresolved.appendChild(buttonGoToList)
    whichAreUnresolved.appendChild(theseAreUnresolved)
})




const ctx1 = document.getElementById('myChart1').getContext('2d'); // Canvas-Element finden

const howManyTags = JSON.parse(localStorage.getItem("Ausgewählte Tags"))
console.log("Hier bekomme ich alle Tags", howManyTags)

let allTags = 0;

if (Array.isArray(howManyTags)) {
  allTags = howManyTags.length; // Die Anzahl der Tag-Einträge direkt zählen
} else {
  console.log("howManyTags ist kein gültiges Array.");
}

console.log("Anzahl Tags:", allTags);

const filterTagsNow = howManyTags.map(yes => yes.tagId)
console.log("Das sind die Tag ids dazu", filterTagsNow)

const compareWithTag = JSON.parse(localStorage.getItem("Tags"))
console.log("WIr vergleichen es hiermit", compareWithTag)


const compareTwoTags = compareWithTag.map(tag => tag.name)
console.log("Ergbenis", compareTwoTags)

const myChart1 = new Chart(ctx1, {
    type: 'bar', // Diagrammtyp (Balkendiagramm)
    data: {
        labels: ['Tags'], // Kategorien für das Diagramm
        datasets: [{
            label: 'Wie viele Tags wurden verwendet',
            data: [allTags], // Werte für jede Kategorie
            backgroundColor: ['blue'], // Verschiedene Farben für die Balken
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'], // Verschiedene Randfarben
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true // Die Y-Achse beginnt bei 0
            }
        }
    }
});

const theseAreTheTags = document.getElementById("theseAreTheTags");

// Sicherstellen, dass das Element leer ist (verhindert doppeltes Einfügen)
theseAreTheTags.innerHTML = "";

compareTwoTags.forEach(tagName => {
    const theseAreTheTags1 = document.createElement("li");
    theseAreTheTags1.classList.add("unresolvedTasks");
    theseAreTheTags1.textContent = tagName;

    

   
    theseAreTheTags.appendChild(theseAreTheTags1);
});


















// Menübalken anzeigen zu lassen
document.getElementById("addTag").addEventListener("click", function () {
    document.getElementById("popup").classList.add("show3"); // Popup anzeigen
});

// Schließen des Menübalken bei Klick auf das "X"
document.querySelector(".close4").addEventListener("click", function () {
    document.getElementById("popup").classList.remove("show3"); // Popup ausblenden
    sidebar.classList.add("show");
});



document.getElementById("tagBearbeiten1").addEventListener("click", function () {
    document.getElementById("datumContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close18").addEventListener("click", function () {
    document.getElementById("datumContainer").classList.remove("showTag"); // Popup ausblenden
   
});

document.getElementById("tagBearbeiten2").addEventListener("click", function () {
    document.getElementById("notizenContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close30").addEventListener("click", function () {
    document.getElementById("notizenContainer").classList.remove("showTag"); // Popup ausblenden
   
});

document.querySelector(".close34").addEventListener("click", function () {
    document.getElementById("infoContainer").classList.remove("showTag"); // Popup ausblenden
   
});

document.getElementById("addTag1").addEventListener("click", function () {
    document.getElementById("tagErstellen").classList.add("show1"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
    sidebar.classList.add("show");
});
document.querySelector(".close2").addEventListener("click", function () {
    document.getElementById("tagErstellen").classList.remove("show1"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
    sidebar.classList.add("show");
});


document.getElementById("addTag2").addEventListener("click", function () {
    document.getElementById("tagBearbeiten").classList.add("show2"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
    sidebar.classList.add("show");
});
document.querySelector(".close3").addEventListener("click", function () {
    document.getElementById("tagBearbeiten").classList.remove("show2"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
    sidebar.classList.add("show");
});



document.querySelector(".close6").addEventListener("click", function () {
    document.getElementById("tagContainer").classList.remove("showTag"); // Popup ausblenden

});

document.querySelector(".close15").addEventListener("click", function () {
    document.getElementById("bearbeitenContainer").classList.remove("showTag"); // Popup ausblenden
    
});


document.getElementById("addTag3").addEventListener("click", function () {
    document.getElementById("tagFiltern").classList.add("show10"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
});
document.querySelector(".close10").addEventListener("click", function () {
    document.getElementById("tagFiltern").classList.remove("show10"); // Popup ausblenden
    document.getElementById("close4").classList.remove("notShow"); // Popup ausblenden
    sidebar.classList.add("show");
});


document.getElementById("show-filter-button").addEventListener("click", function(){
    const notActive = document.getElementById("prioContainerFilter")
    document.getElementById("tagFiltern").classList.add("show10"); // Popup anzeigen
    document.getElementById("close4").classList.add("notShow"); // Popup anzeigen
    document.getElementById("show-filter-button").classList.toggle("active");
    document.getElementById("show-done-button").classList.remove("active");
    document.getElementById("show-not-done-button").classList.remove("active");
    document.getElementById("show-all-button").classList.remove("active");
    document.getElementById("showAfterPrio").classList.remove("active");
    notActive.classList.remove("showTag")
})


document.getElementById("searchToDo").addEventListener("click", function () {
    document.getElementById("searchContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close50").addEventListener("click", function () {
    document.getElementById("searchContainer").classList.remove("showTag"); // Popup ausblenden
    sidebar.classList.add("show");
});


document.getElementById("analysToDo").addEventListener("click", function () {
    document.getElementById("analysContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close80").addEventListener("click", function () {
    document.getElementById("analysContainer").classList.remove("showTag"); // Popup ausblenden
    sidebar.classList.add("show");
});

document.getElementById("exportToDo").addEventListener("click", function () {
    document.getElementById("exportContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close90").addEventListener("click", function () {
    document.getElementById("exportContainer").classList.remove("showTag"); // Popup ausblenden
    sidebar.classList.add("show");
})
document.getElementById("tagBearbeiten3").addEventListener("click", function () {
    document.getElementById("prioContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close100").addEventListener("click", function () {
    document.getElementById("prioContainer").classList.remove("showTag"); // Popup ausblenden
})
document.getElementById("showAfterPrio").addEventListener("click", function () {
    document.getElementById("prioContainerFilter").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close200").addEventListener("click", function () {
    document.getElementById("prioContainerFilter").classList.remove("showTag"); // Popup ausblenden
})
document.getElementById("legendShow").addEventListener("click", function () {
    document.getElementById("legendContainer").classList.add("showTag"); // Popup anzeigen
})
document.querySelector(".close300").addEventListener("click", function () {
    document.getElementById("legendContainer").classList.remove("showTag"); // Popup ausblenden
})


// Daten aus dem localStorage laden
const storedTodos = JSON.parse(localStorage.getItem("tasks")) || [];

// Nur die Namen der To-Dos extrahieren
const todos = storedTodos.map(todo => todo.text);
console.log("Was bekommt todos", todos)
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = ""; // Ergebnisse leeren

  if (query === "") return; // Falls das Feld leer ist, nichts anzeigen

  const filteredTodos = todos.filter(todo => todo.toLowerCase().includes(query));

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = todo;
    li.classList.add("listforSearch")

  

    const searchToDoList = document.createElement("button")
    searchToDoList.textContent = "Zur Liste"
    searchToDoList.classList.add("buttonforSearch")

    searchToDoList.addEventListener("click", function (event) {
        console.log("Geklickt auf:", todo); // Name des geklickten To-Dos
    
        const tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];
        console.log("In tasks suchen", tasksArray);
    
        // ID der Aufgaben herausfiltern, die das geklickte To-Do enthalten
        const filterTasks = tasksArray
          .filter(task => task.text.includes(todo)) // Dynamisch nach `todo` suchen
          .map(task => task.id); // IDs extrahieren
    
        console.log("Gefilterte IDs für", todo, ":", filterTasks);
        console.log(filterTasks)
        localStorage.setItem("Gefunden", JSON.stringify(filterTasks.map(String)));
        renderTasks()

    });
    

    li.appendChild(searchToDoList)
    searchResults.appendChild(li);
  });
});













document.getElementById("show-all-button").addEventListener("click", () => {
    const button = document.getElementById("show-all-button");
    const isActive = button.classList.contains("active"); 
    const notActive = document.getElementById("prioContainerFilter")

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");

        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-done-button").classList.remove("active");
        document.getElementById("show-not-done-button").classList.remove("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("showAfterPrio").classList.remove("active");
        notActive.classList.remove("showTag")
        document.getElementById("tagFiltern").classList.remove("show10");

        renderTasks("all");
    }
});

document.getElementById("show-done-button").addEventListener("click", () => {
    const button = document.getElementById("show-done-button");
    const isActive = button.classList.contains("active");
    const notActive = document.getElementById("prioContainerFilter")

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
      
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("show-not-done-button").classList.remove("active");
        document.getElementById("show-all-button").classList.remove("active");
        document.getElementById("showAfterPrio").classList.remove("active");
        notActive.classList.remove("showTag")
        document.getElementById("tagFiltern").classList.remove("show10");

        renderTasks("done");
    }
});

document.getElementById("show-not-done-button").addEventListener("click", () => {
    const button = document.getElementById("show-not-done-button");
    const isActive = button.classList.contains("active");
    const notActive = document.getElementById("prioContainerFilter")

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
       
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-done-button").classList.remove("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("show-all-button").classList.remove("active");
        document.getElementById("showAfterPrio").classList.remove("active");
        notActive.classList.remove("showTag")
        document.getElementById("tagFiltern").classList.remove("show10");

        renderTasks("not-done");
    }
});

document.getElementById("showAfterPrio").addEventListener("click", () => {
    const button = document.getElementById("showAfterPrio");
    const isActive = button.classList.contains("active");
    const notActive = document.getElementById("prioContainerFilter")

    // Toggle-Logik
    if (isActive) {
        button.classList.remove("active");
        notActive.classList.remove("showTag")
        renderTasks(); // Standardansicht ohne Filter
    } else {
        button.classList.add("active");
        document.getElementById("show-done-button").classList.remove("active");
        document.getElementById("show-filter-button").classList.remove("active");
        document.getElementById("show-all-button").classList.remove("active");
        document.getElementById("show-not-done-button").classList.remove("active");
        document.getElementById("tagFiltern").classList.remove("show10");
      
      

    }
});


document.addEventListener("DOMContentLoaded", function () {
    loadTasks();

    window.addEventListener("storage", () => {
        loadTasks();
    });
});









function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 🎨 Überschrift mit Datum
    const currentDate = new Date().toLocaleDateString("de-DE");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("📋 Meine To-Do-Liste", 10, 15);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`📅 Erstellt am: ${currentDate}`, 10, 25);

    // 🔍 To-Dos aus LocalStorage abrufen
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let y = 35; // Y-Position in der PDF
    tasks.forEach((task, index) => {
        const status = task.isDone ? "✅ Erledigt" : "❌ Offen";

        // 🎨 Unterschiedliche Farben für Erledigt/Unerledigt
        doc.setFont("helvetica", "normal");
        doc.setTextColor(task.isDone ? "green" : "red");
        doc.text(`${index + 1}. ${task.text} - ${status}`, 10, y);

        y += 10; // Abstand zwischen den Zeilen
    });

    // Speichert die PDF mit dynamischem Namen
    doc.save(`ToDo-Liste_${currentDate}.pdf`);
}

// 🚀 Button zum Exportieren hinzufügen
document.getElementById("exportPDFButton").addEventListener("click", exportToPDF);






























function openTaskInNewPage(taskId) {
    window.location.href = `task.html?id=${taskId}`;
}









































window.addEventListener("storage", function (event) {
    if (event.key === "tasks") {
        loadTasks(); // Aktualisiert die Aufgaben in der Tabelle
    }
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





function exportToExcel() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    if (tasks.length === 0) {
        alert("Keine Daten zum Exportieren!");
        return;
    }

    let worksheetData = [["ID", "Aufgabe", "Erstellt am", "Erledigt am", "Status"]]; // Kopfzeile

    tasks.forEach(task => {
        let status = task.isDone ? "Erledigt" : "Unerledigt";
        worksheetData.push([task.id, task.text, task.createdAt, task.doneAt || "-", status]);
    });

    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "ToDo Liste");

    XLSX.writeFile(workbook, "ToDoListe.xlsx");
}

document.getElementById("exportExcelButton").addEventListener("click", exportToExcel);












  

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


const forKalender = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(forKalender);

// Nur die Texte der Aufgaben extrahieren
const filterKalender = forKalender.map(task => task.text);
console.log(filterKalender);

const selectElement = document.getElementById("todoSelect");

// Dropdown mit Aufgaben befüllen
filterKalender.forEach(todo => {
    const option = document.createElement("option");
    option.value = todo;
    option.textContent = todo;
    selectElement.appendChild(option);
});

// Funktion zum Hinzufügen in den Google Kalender
function addSelectedToCalendar() {
    const selectedTask = selectElement.value;
    if (!selectedTask) {
        alert("Bitte eine Aufgabe auswählen!");
        return;
    }

    const title = encodeURIComponent(selectedTask);
    const details = encodeURIComponent("Erinnerung: " + selectedTask);
    const startDate = "20250321T090000Z"; // Beispiel für eine Zeitangabe
    const endDate = "20250321T100000Z";  

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDate}/${endDate}`;

    window.open(googleCalendarUrl, "_blank"); // Öffnet Google Kalender in einem neuen Tab
}