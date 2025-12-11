document.addEventListener('DOMContentLoaded', function() {
    const aiSuggestBtn = document.getElementById('ai-suggest-btn');
    const suggestionsDiv = document.getElementById('suggestions');
    const suggestionsList = document.getElementById('suggestions-list');
    const addAllBtn = document.getElementById('add-all-btn');
    const addMessage = document.getElementById('add-message');
    const tasksContainer = document.querySelector(".tasks-list");

    // Load tasks from API
    async function loadTasks() {
        try {
            const res = await fetch("/api/tasks");
            const data = await res.json();

            tasksContainer.innerHTML = "";  // Clear old content

            // If no tasks
            if (!data.tasks || data.tasks.length === 0) {
                tasksContainer.innerHTML = `
                    <p class="text-gray-500 text-lg">No tasks added yet.</p>
                `;
                return;
            }

            // Render each task
            data.tasks.forEach((task, index) => {
                const card = document.createElement("div");
                card.className =
                    "p-4 mb-4 bg-white rounded-lg shadow hover:shadow-md transition";

                card.innerHTML = `
                    <h3 class="text-xl font-semibold">${task.title}</h3>
                    <p class="text-gray-600">Duration: ${task.duration} hour(s)</p>

                    <button data-id="${index}"
                        class="delete-btn mt-3 px-3 py-1 bg-red-500 text-white rounded">
                        Delete
                    </button>
                `;

                tasksContainer.appendChild(card);
            });

            // Attach delete listeners
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.getAttribute("data-id");
                    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
                    loadTasks();
                });
            });

        } catch (err) {
            console.error("Failed loading tasks:", err);
        }
    }

    loadTasks();

    aiSuggestBtn.addEventListener('click', async function() {
        try {
            // Get current tasks
            const tasksResponse = await fetch('/api/tasks');
            const tasksData = await tasksResponse.json();
            const tasks = tasksData.tasks || [];

            // Get AI suggestions
            const suggestResponse = await fetch('/api/ai/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: tasks })
            });

            if (!suggestResponse.ok) {
                throw new Error('Failed to get suggestions');
            }

            const suggestData = await suggestResponse.json();
            const suggestions = suggestData.suggestions || [];

            // Display suggestions
            suggestionsList.innerHTML = '';
            suggestions.forEach(suggestion => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200';
                card.innerHTML = `
                    <h3 class="font-bold text-lg text-gray-900 mb-2">${suggestion.title}</h3>
                    <p class="text-gray-600">Duration: ${suggestion.duration} hours</p>
                `;
                suggestionsList.appendChild(card);
            });

            suggestionsDiv.classList.remove('hidden');
            addAllBtn.classList.remove('hidden');

        } catch (error) {
            alert('Failed to get AI suggestions. Please try again.');
        }
    });

    addAllBtn.addEventListener('click', async function() {
        try {
            const tasksResponse = await fetch('/api/tasks');
            const tasksData = await tasksResponse.json();
            const tasks = tasksData.tasks || [];

            const suggestResponse = await fetch('/api/ai/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: tasks })
            });

            if (!suggestResponse.ok) {
                throw new Error('Failed to get suggestions');
            }

            const suggestData = await suggestResponse.json();
            const suggestions = suggestData.suggestions || [];

            let added = 0;
            for (const suggestion of suggestions) {
                const addResponse = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: suggestion.title })
                });
                if (addResponse.ok) {
                    added++;
                }
            }

            addMessage.textContent = `${added} tasks added successfully!`;
            addAllBtn.classList.add('hidden');
            suggestionsDiv.classList.add('hidden');
            loadTasks();

        } catch (error) {
            addMessage.textContent = 'Failed to add tasks. Please try again.';
            addMessage.className = 'mt-4 text-center text-red-600 font-medium';
        }
    });
});
