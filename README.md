# Task Management System link: [Website](https://vernardciti.github.io/task_management_v1/)

## Overview  
A simple web-based task management system that allows users to create, update, complete, and delete tasks. Tasks can be categorized and prioritized for better organization.  

## Features  
✅ Create new tasks with title, description, category, priority, and due date  
✅ Mark tasks as completed or incomplete  
✅ Edit or delete tasks  
✅ Categorize tasks for better organization  
✅ Persist data using a backend database  
✅ Responsive and user-friendly interface  

## Technologies Used  
- **Frontend:** HTML, CSS, JavaScript (Axios for API requests)  
- **Backend:** Node.js, Express.js  
- **Database:** SQLite / MySQL (Adjust based on your setup)  

## Installation & Setup  

1. **Clone the Repository**  
   ```sh
   git clone https://github.com/your-repo/task-manager.git
   cd task-manager
   ```

2. **Install Dependencies**  
   ```sh
   npm install
   ```

3. **Set Up the Database**  
   Run the SQL script to create the tasks table:  
   ```sql
   CREATE TABLE tasks (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       description TEXT,
       task_date DATE,
       category TEXT,
       priority TEXT,
       completed INTEGER DEFAULT 0
   );
   ```

4. **Start the Backend Server**  
   ```sh
   node server.js
   ```

5. **Run the Frontend**  
   Open `index.html` in your browser or serve it using a local server.  

## API Endpoints  
| Method | Endpoint         | Description               |
|--------|-----------------|---------------------------|
| GET    | `/tasks`        | Fetch all tasks           |
| POST   | `/tasks`        | Create a new task         |
| PUT    | `/tasks/:id`    | Update a task             |
| DELETE | `/tasks/:id`    | Delete a task             |

## Issues & Debugging  
If completed tasks reappear after refresh or categories disappear:  
- Ensure updates are correctly saved in the database (`completed` and `category` fields).  
- Verify that the frontend correctly fetches and displays the latest data.  
