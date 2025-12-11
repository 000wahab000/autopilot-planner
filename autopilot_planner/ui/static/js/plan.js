async function loadTasks() {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  renderTasks(data.tasks || []);
}

function renderTasks(tasks) {
  const container = document.getElementById('plan-container');
  container.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('div');
    li.className = 'task-card bg-white p-4 shadow rounded mb-4';
    li.innerHTML = `
      <h3 class="text-lg font-semibold"><span class="task-text">${task.text}</span>
        <span class="category-pill bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm ml-2">${task.category}</span>
        <span class="status-badge ${task.status === 'done' ? 'bg-green-100 text-green-800' : task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded text-sm ml-2">${task.status}</span>
      </h3>
      <div class="mt-2 space-y-2">
        <div class="flex space-x-4">
          <select onchange="changeStatus(${idx}, this.value)" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="todo" ${task.status === "todo" ? "selected" : ""}>Todo</option>
            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
          </select>
          <select onchange="changeCategory(${idx}, this.value)" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="general" ${task.category === "general" ? "selected" : ""}>General</option>
            <option value="work" ${task.category === "work" ? "selected" : ""}>Work</option>
            <option value="college" ${task.category === "college" ? "selected" : ""}>College</option>
            <option value="personal" ${task.category === "personal" ? "selected" : ""}>Personal</option>
          </select>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">Start:</label>
            <input type="time" value="${task.start || ''}" onchange="changeStart(${idx}, this.value)" class="border border-gray-300 rounded px-2 py-1 text-sm">
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">End:</label>
            <input type="time" value="${task.end || ''}" onchange="changeEnd(${idx}, this.value)" class="border border-gray-300 rounded px-2 py-1 text-sm">
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium">Due:</label>
            <input type="date" value="${task.due || ''}" onchange="changeDue(${idx}, this.value)" class="border border-gray-300 rounded px-2 py-1 text-sm">
          </div>
        </div>
        <div class="subtasks-section">
          <ul class="subtask-list space-y-1">
            ${task.subtasks.map((s, i) => `
              <li class="flex items-center space-x-2">
                 <input type="checkbox" ${s.done ? "checked" : ""} onchange="toggleSubtask(${idx}, ${i})" class="rounded">
                 <span class="${s.done ? 'line-through text-gray-500' : ''} text-sm">${s.text}</span>
                 <button onclick="deleteSubtask(${idx}, ${i})" class="text-red-500 hover:text-red-700 text-sm">×</button>
              </li>
            `).join("")}
          </ul>
          <div class="flex mt-2">
            <input type="text" id="subtask-input-${idx}" placeholder="Add subtask..." class="flex-1 border border-gray-300 rounded-l px-2 py-1 text-sm">
            <button onclick="addSubtask(${idx})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-r text-sm">Add</button>
          </div>
        </div>
        <div class="flex space-x-2 mt-2">
          <button onclick="editTask(${idx})" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Edit</button>
          <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" data-idx="${idx}">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const idx = e.target.dataset.idx;
      const res = await fetch(`/api/tasks/${idx}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok) {
        loadTasks();
      } else {
        alert("Failed to delete task: " + (json.error || "Unknown error"));
      }
    });
  });
}

function editTask(index) {
    const taskCard = document.querySelector(`#plan-container > div:nth-child(${index + 1})`);
    const span = taskCard.querySelector(".task-text");
    const oldText = span.textContent;

    span.innerHTML = `<input id="edit-input-${index}" value="${oldText}" class="border border-gray-300 rounded px-2 py-1">`;
    const editButton = taskCard.querySelector('button[onclick*="editTask"]');
    editButton.outerHTML = `<button onclick="saveEdit(${index})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Save</button>`;
}

async function changeStatus(index, newStatus) {
    await fetch(`/api/tasks/${index}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });
    loadTasks();
}

async function changeCategory(index, newCategory) {
    await fetch(`/api/tasks/${index}/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory })
    });
    loadTasks();
}

async function changeStart(index, newStart) {
    await fetch(`/api/tasks/${index}/start`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: newStart })
    });
    loadTasks();
}

async function changeEnd(index, newEnd) {
    await fetch(`/api/tasks/${index}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ end: newEnd })
    });
    loadTasks();
}

async function changeDue(index, newDate) {
    await fetch(`/api/tasks/${index}/due`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due: newDate || null })
    });
    loadTasks();
}

async function addSubtask(index) {
    const input = document.querySelector(`#subtask-input-${index}`);
    const value = input.value.trim();
    if (!value) return;

    await fetch(`/api/tasks/${index}/subtasks/add`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value })
    });

    input.value = "";
    loadTasks();
}

async function toggleSubtask(index, subIndex) {
    await fetch(`/api/tasks/${index}/subtasks/${subIndex}/toggle`, {
        method: "PATCH"
    });
    loadTasks();
}

async function deleteSubtask(index, subIndex) {
    await fetch(`/api/tasks/${index}/subtasks/${subIndex}`, {
        method: "DELETE"
    });
    loadTasks();
}

async function saveEdit(index) {
    const newText = document.querySelector(`#edit-input-${index}`).value;

    await fetch(`/api/tasks/${index}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
    });

    loadTasks();
}

// AI Chat functionality
async function sendChat() {
    const input = document.getElementById('chat-input');
    const output = document.getElementById('chat-output');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    output.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

    try {
        // Get current tasks
        const tasksResponse = await fetch('/api/tasks');
        const tasksData = await tasksResponse.json();
        const tasks = tasksData.tasks || [];

        // Send chat request
        const chatResponse = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, tasks: tasks })
        });

        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            const reply = chatData.reply || 'No response received.';
            output.innerHTML += `<div><strong>AI:</strong> ${reply}</div>`;
        } else {
            const errorData = await chatResponse.json();
            if (chatResponse.status === 500 && errorData.error && errorData.error.includes('API key')) {
                output.innerHTML += `<div><strong>AI:</strong> AI features disabled. Add API key in config.py to enable them.</div>`;
            } else {
                output.innerHTML += `<div><strong>AI:</strong> Sorry, I encountered an error processing your request.</div>`;
            }
        }
    } catch (error) {
        output.innerHTML += `<div><strong>AI:</strong> Sorry, I encountered an error processing your request.</div>`;
    }

    input.value = '';
    output.scrollTop = output.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    // Load tasks if on plan page
    const planContainer = document.getElementById('plan-container');
    if (planContainer) {
        loadTasks();
    }

    // Set up chat functionality
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendChat);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChat();
            }
        });
    }
});
