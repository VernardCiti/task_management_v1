// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  // Activate home nav link as needed
  const homeLink = document.querySelector('.nav a[href="#home"]');
  if (homeLink) homeLink.classList.add('active');
  refreshTasks();  // Fetch tasks when the DOM is ready
  generateCalendar();
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

// Global tasks array to keep track of tasks (should be in sync with your backend)
let tasks = [];
const API_URL = "https://task-management-v1.onrender.com";

// ----------------------
// Existing navigation & modal code remains here...
// ----------------------

// Modal Functions
function showTaskForm() {
  // Clear previous form data if needed
  document.getElementById('taskForm').reset();
  document.getElementById('taskId').value = '';
  document.getElementById('modalTitle').textContent = 'Add Task';
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

// Error Handling Functions
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

// ----------------------
// Category Form Submission remains largely unchanged
document.getElementById('categoryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const newCategory = document.getElementById('newCategory').value.trim();
  if (!newCategory) {
    showError(document.getElementById('newCategory'), 'Category name is required');
    return;
  }
  // Optionally, post to server here...
  const select = document.getElementById('taskCategory');
  const option = document.createElement('option');
  option.value = newCategory;
  option.textContent = newCategory;
  select.appendChild(option);
  closeCategoryForm();
});
// ----------------------

// Task Form Submission - Handles both creation and update
document.getElementById('taskForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  clearErrors();

  // Gather form values
  const taskId = document.getElementById('taskId').value.trim();
  const title = document.getElementById('taskTitle').value.trim();
  const taskDate = document.getElementById('taskDate').value;
  const description = document.getElementById('taskDescription').value.trim();
  const category = document.getElementById('taskCategory').value;
  const priorityRadio = document.querySelector('input[name="priority"]:checked');
  const priority = priorityRadio ? priorityRadio.value : '';

  // Basic Validation
  let isValid = true;
  if (!title) {
    showError(document.getElementById('taskTitle'), 'Title is required');
    isValid = false;
  }
  if (!taskDate) {
    showError(document.getElementById('taskDate'), 'Date is required');
    isValid = false;
  }
  if (!priority) {
    showError(document.querySelector('.priority-options'), 'Priority is required');
    isValid = false;
  }
  if (!isValid) return;

  // Build task object
  const taskData = {
    title,
    task_date: taskDate,
    description,
    category,
    priority
  };

  try {
    if (taskId) {
      // Update existing task via PATCH
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, taskData, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Update local array and refresh UI
      const index = tasks.findIndex(t => t.id === parseInt(taskId));
      if (index >= 0) {
        tasks[index] = { ...tasks[index], ...response.data };
      }
      refreshTasks();
    } else {
      // Create new task via POST
      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { 'Content-Type': 'application/json' }
      });
      tasks.push(response.data);
      renderTask(response.data);
    }
    closeTaskForm();
  } catch (err) {
    console.error('Error saving task:', err);
  }
});

// ----------------------
// Render Task as Card
function renderTask(task) {
  const taskList = document.getElementById('taskList');
  const taskCard = document.createElement('div');
  taskCard.className = `task-card ${task.priority.toLowerCase()}`;

  taskCard.innerHTML = `
    <h2>${task.title}</h2>
    <div class="task-meta">
      <span>📅 ${task.task_date}</span>
      <span>📁 ${task.category}</span>
      <span>⚠️ ${task.priority}</span>
    </div>
    ${ task.description ? `<p class="task-description">${task.description}</p>` : '' }
    <hr class="divider" />
    <div class="task-footer">
      <!-- Complete button -->
      <button class="complete-btn" onclick="completeTask(${task.id})">Complete</button>
      <!-- Icon group: Share, Favorite, Delete, Edit -->
      <div class="icon-group">
        <button class="icon-btn" title="Share"><i class="fa-solid fa-link" style="color: #6A3DDB;"></i></button>
        <button class="icon-btn" title="Favorite"><i class="fa-solid fa-star" style="color: #6A3DDB;"></i></button>
        <button class="icon-btn" title="Delete" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash" style="color: #6A3DDB;"></i></button>
        <button class="icon-btn" title="Edit" onclick="editTask(${task.id})"><i class="fa-solid fa-pen" style="color: #6A3DDB;"></i></button>
      </div>
    </div>
  `;
  
  // Add new task card at the top of the list
  taskList.prepend(taskCard);
}

// ----------------------
// Delete Task Function (unchanged except for DOM removal)
async function deleteTask(taskId) {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    if (response.status === 200) {
      document.querySelector(`[onclick="deleteTask(${taskId})"]`).closest('.task-card').remove();
      tasks = tasks.filter(task => task.id !== taskId);
    }
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}

// ----------------------
// Complete Task Function - Marks task as complete
function completeTask(taskId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex < 0) return;

  // Mark task as complete locally (and add a 'completed' flag if needed)
  tasks[taskIndex].completed = true;

  // Use PUT instead of PATCH since your server is configured for PUT
  axios.put(`${API_URL}/tasks/${taskId}`, { 
    ...tasks[taskIndex],
    completed: true
  }, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then(() => {
      // Mark the card visually as completed
      const card = document.querySelector(`[onclick="deleteTask(${taskId})"]`)?.closest('.task-card');
      if (card) {
        card.classList.add('completed');
      }
    })
    .catch(err => {
      console.error('Error marking task complete:', err);
    });
}

// ----------------------
// Edit Task Function - Populates the form with existing task data
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  // Populate the form fields with the task's data
  document.getElementById('taskId').value = task.id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDate').value = task.task_date;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskCategory').value = task.category;
  
  // Set the priority radio button
  const radios = document.querySelectorAll('input[name="priority"]');
  radios.forEach(radio => {
    radio.checked = (radio.value === task.priority);
  });

  // Change modal title to indicate editing
  document.getElementById('modalTitle').textContent = 'Edit Task';
  showTaskForm();
}

// ----------------------
// Refresh Tasks - Fetch and re-render tasks from the server
async function refreshTasks() {
  try {
    const response = await axios.get('${API_URL}/tasks');
    tasks = response.data;
    document.getElementById('taskList').innerHTML = '';
    tasks.forEach(task => {
      renderTask(task);
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
}
// Calendar Logic
// Modified Calendar Logic
function generateCalendar(date = new Date()) {
  const calendarBody = document.querySelector('.calendar-body');
  const currentMonthElement = document.getElementById('currentMonth');
  
  // Clear previous calendar
  calendarBody.innerHTML = '';
  
  // Get month/year and setup dates
  const month = date.getMonth();
  const year = date.getFullYear();
  const today = new Date();
  
  // Update header
  currentMonthElement.textContent = 
    `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  // Create calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = lastDay.getDate();

  // Create weekdays header
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarBody.innerHTML += `
    <div class="calendar-week">
      ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
    </div>
    <div class="calendar-days"></div>
  `;

  const daysContainer = calendarBody.querySelector('.calendar-days');
  
  // Add empty cells for days before the first day
  for (let i = 0; i < startDay; i++) {
    daysContainer.innerHTML += `<div class="calendar-day empty"></div>`;
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && 
                    month === today.getMonth() && 
                    year === today.getFullYear();
    daysContainer.innerHTML += `
      <div class="calendar-day${isToday ? ' today' : ''}">${day}</div>
    `;
  }

  // Calculate total cells needed (6 rows × 7 days)
  const totalCells = 42; // 6 weeks × 7 days
  const remainingCells = totalCells - (startDay + daysInMonth);
  
  // Add empty cells for remaining days
  for (let i = 0; i < remainingCells; i++) {
    daysContainer.innerHTML += `<div class="calendar-day empty"></div>`;
  }
}

// ----------------------
// Close modals when clicking outside
window.onclick = function(event) {
  if (event.target.className === 'modal') {
    event.target.style.display = 'none';
    if (event.target.id === 'taskModal') closeTaskForm();
    if (event.target.id === 'categoryModal') closeCategoryForm();
  }
};

// ----------------------
// Optional: Activate navigation link logic remains here...
