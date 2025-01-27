function saveTasks() {
    const tasks = Array.from(document.querySelectorAll("#task-list li")).map(li => ({
        text: li.textContent.replace("Löschen", "").trim(),
        done: li.classList.contains("done"),
    }));

    localStorage.setItem("todos", JSON.stringify(tasks));
}


function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
    const taskList = document.getElementById("task-list");

    savedTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.done) {
            listItem.classList.add("done");
        }

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);
        
      
        listItem.addEventListener("click", function () {
            listItem.classList.toggle("done");
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

//-----------------------------------------------------------------------------------------------//



document.getElementById("add-task-button").addEventListener("click", function(){
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Bitte geben sie etwas ein bevor sie den Button drücken")
        return;
    }

    const taskList = document.getElementById("task-list");

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

document.getElementById("add-done-button").addEventListener("click", function (){
    const taskDone = document.querySelectorAll("#task-list li");

    taskDone.forEach(task => {
        if (task.classList.contains("done")){
        } else {
            task.style.display = "none";
        }
    })
})

document.getElementById("add-all_Button").addEventListener("click", function(){
    const taskBack = document.querySelectorAll("#task-list li");

    taskBack.forEach(task => {
        task.style.display = "flex";
    })

document.getElementById("add-notDone-Button").addEventListener("click", function(){
    const taskNotDone = document.querySelectorAll("#task-list li");

    taskNotDone.forEach(task => {
        if(task.classList.contains("done")){
            task.style.display = "none";
        } else {
            task.style.display = "flex";
        }
    })
})
})

document.addEventListener("DOMContentLoaded", loadTasks);