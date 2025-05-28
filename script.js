document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    window.location.href = "auth.html";
  } else {
    loadTasks();
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "auth.html";
}

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskText = document.getElementById("task").value.trim();
  const taskTime = document.getElementById("time").value;
  const taskDate = document.getElementById("date").value;
  const priority = document.getElementById("priority").value;

  if (!taskText || !taskTime || !taskDate) {
    alert("Please enter task, time and date.");
    return;
  }

  const task = {
    text: taskText,
    time: taskTime,
    date: taskDate,
    priority: priority,
    completed: false
  };

  saveTask(task);
  displayTask(task);
  document.getElementById("task").value = "";
  document.getElementById("time").value = "";
  document.getElementById("date").value = "";
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => displayTask(task));
}

function displayTask(task) {
  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");
  li.className = "task-item";

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const taskText = document.createElement("span");
  taskText.textContent = `${task.text} - ${task.time} [${task.priority}] (${task.date})`;
  if (task.completed) {
    taskText.classList.add("completed");
  }

  taskInfo.appendChild(taskText);

  const taskButtons = document.createElement("div");
  taskButtons.className = "task-buttons";

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✔";
  completeBtn.classList.add("complete");
  completeBtn.onclick = () => {
    task.completed = !task.completed;
    updateTasks();
    taskText.classList.toggle("completed");
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.classList.add("delete");
  deleteBtn.onclick = () => {
    li.remove();
    removeTask(task);
  };

  taskButtons.appendChild(completeBtn);
  taskButtons.appendChild(deleteBtn);

  li.appendChild(taskInfo);
  li.appendChild(taskButtons);

  taskList.appendChild(li);
}

function updateTasks() {
  const allTasks = [];
  document.querySelectorAll(".task-item").forEach(item => {
    const text = item.querySelector("span").textContent;
    const [taskTextPart, rest] = text.split(" - ");
    const [timePart, priorityDate] = rest.split(" [");
    const [priority, datePart] = priorityDate.split("] (");
    const date = datePart.replace(")", "");
    const completed = item.querySelector("span").classList.contains("completed");

    allTasks.push({
      text: taskTextPart,
      time: timePart.trim(),
      date: date.trim(),
      priority: priority.trim(),
      completed
    });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function removeTask(taskToRemove) {
  const tasks = getTasks().filter(task =>
    !(task.text === taskToRemove.text &&
      task.time === taskToRemove.time &&
      task.date === taskToRemove.date)
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasksByDate() {
  const filterDate = document.getElementById("filterDate").value;
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasks = getTasks().filter(task => task.date === filterDate || filterDate === "");
  tasks.forEach(task => displayTask(task));
}

function downloadPDF() {
  const element = document.createElement('a');
  const tasks = getTasks();
  let content = "✨ Your Day Plan\n\n";
  tasks.forEach(task => {
    content += `${task.text} - ${task.time} [${task.priority}] (${task.date})\n`;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(blob);
  element.download = "DayPlan.txt";
  element.click();
}





