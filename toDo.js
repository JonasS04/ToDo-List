document.getElementById("add-task-button").addEventListener("click", function(){
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();

    if (taskValue === "") {
        alert("Bitte geben sie etwas ein bevor sie den Button drücken")
        return;
    }

    const taskList = document.getElementById("task-list");
    const listItem = document.createElement("li");
    listItem.textContent = taskValue;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.addEventListener("click", function() {
        taskList.removeChild(listItem);
    })

    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    taskInput.value = "";
})