// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  // Activate home nav link as needed
  const homeLink = document.querySelector('.nav a[href="#home"]');
  if (homeLink) homeLink.classList.add('active');
});

// Global hash navigation listener (optional)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const targetId = link.getAttribute('href').slice(1);
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  const matchingNavLink = document.querySelector(`.nav a[href="#${targetId}"]`);
  if (matchingNavLink) matchingNavLink.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === targetId);
  });
});

let tasks = [];

// Modal Functions
function showTaskForm() {
  document.getElementById('taskModal').style.display = 'block';
}

function closeTaskForm() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('taskForm').reset();
  clearErrors();
}

function showCategoryForm() {
  document.getElementById('categoryModal').style.display = 'block';
}

function closeCategoryForm() {
  document.getElementById('categoryModal').style.display = 'none';
  document.getElementById('categoryForm').reset();
}

// Error Handling
function showError(element, message) {
  const formGroup = element.closest('.form-group');
  formGroup.classList.add('error');
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function clearErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
    const errorElement = group.querySelector('.error-message');
    if (errorElement) errorElement.style.display = 'none';
  });
}

// Handle Category Addition using Axios or direct update
document.getElementById('categoryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const newCategory = document.getElementById('newCategory').value.trim();
  if (!newCategory) {
    showError(document.getElementById('newCategory'), 'Category name is required');
    return;
  }
  // Optionally post to server:
  // await axios.post('http://localhost:3000/categories', { name: newCategory });
  const select = document.getElementById('taskCategory');
  const option = document.createElement('option');
  option.value = newCategory;
  option.textContent = newCategory;
  select.appendChild(option);
  closeCategoryForm();
});

// Handle Task Submission using Axios
document.getElementById('taskForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  clearErrors();
  const formElements = {
    title: this.querySelector('input[type="text"]'),
    date: this.querySelector('input[type="date"]'),
    description: this.querySelector('textarea'),
    category: this.querySelector('#taskCategory'),
    priority: this.querySelector('input[name="priority"]:checked')
  };

  let isValid = true;
  if (!formElements.title.value.trim()) {
    showError(formElements.title, 'Title is required');
    isValid = false;
  }
  if (!formElements.date.value) {
    showError(formElements.date, 'Date is required');
    isValid = false;
  }
  if (!formElements.priority) {
    showError(document.querySelector('.priority-options'), 'Priority is required');
    isValid = false;
  }
  if (!isValid) return;
  
  const task = {
    title: formElements.title.value.trim(),
    task_date: formElements.date.value,
    description: formElements.description.value.trim(),
    category: formElements.category.value,
    priority: formElements.priority.value
  };

  try {
    const response = await axios.post('http://localhost:3000/tasks', task, {
      headers: { 'Content-Type': 'application/json' }
    });
    renderTask(response.data);
    closeTaskForm();
  } catch (err) {
    console.error('Error adding task:', err);
  }
});

// Render Task on the UI
function renderTask(task) {
  const taskList = document.getElementById('taskList');
  const taskCard = document.createElement('div');
  taskCard.className = `task-card ${task.priority.toLowerCase()}`;
  taskCard.innerHTML = `
    <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
    <h3>${task.title}</h3>
    <div class="task-meta">
      <span>📅 ${task.task_date}</span>
      <span>📁 ${task.category}</span>
      <span>⚠️ ${task.priority}</span>
    </div>
    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
  `;
  taskList.prepend(taskCard);
}

// Delete Task using Axios
async function deleteTask(taskId) {
  try {
    const response = await axios.delete(`http://localhost:3000/tasks/${taskId}`);
    if (response.status === 200) {
      document.querySelector(`[onclick="deleteTask(${taskId})"]`).closest('.task-card').remove();
    }
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}

// Close modals when clicking outside
window.onclick = function(event) {
  if (event.target.className === 'modal') {
    event.target.style.display = 'none';
    if (event.target.id === 'taskModal') closeTaskForm();
    if (event.target.id === 'categoryModal') closeCategoryForm();
  }
};
