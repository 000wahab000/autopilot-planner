document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-task-form');
    const message = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const duration = document.getElementById('duration').value;

        if (!title || !duration) {
            message.textContent = 'Please fill in all fields.';
            message.className = 'mt-4 text-center text-red-600';
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title })
            });

            if (response.ok) {
                message.textContent = 'Task added successfully!';
                message.className = 'mt-4 text-center text-green-600';
                form.reset();
                // Redirect to plan page after a short delay
                setTimeout(() => {
                    window.location.href = '/plan';
                }, 1000);
            } else {
                const error = await response.json();
                message.textContent = error.error || 'Failed to add task.';
                message.className = 'mt-4 text-center text-red-600';
            }
        } catch (error) {
            message.textContent = 'An error occurred. Please try again.';
            message.className = 'mt-6 text-center text-red-600 font-medium';
        }
    });
});
