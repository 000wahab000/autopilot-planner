document.addEventListener("DOMContentLoaded", async () => {
    const taskList = document.getElementById("task-list");

    try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        const tasks = data.tasks;

        taskList.innerHTML = "";

        if (tasks.length === 0) {
            taskList.innerHTML = "<p>No tasks for today.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const item = document.createElement("div");
            item.className = "p-4 bg-white rounded-lg shadow mb-4";

            item.innerHTML = `
                <h3 class="text-lg font-semibold">${task.title}</h3>
                <p class="text-gray-600">Duration: ${task.duration} hour(s)</p>
            `;

            taskList.appendChild(item);
        });

    } catch (err) {
        console.error(err);
        taskList.innerHTML = "<p>Error loading tasks.</p>";
    }
});
