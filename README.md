# Show.CO Task Management System

A simple, full-stack task management application that allows users to create, view, update, and delete tasks along with managing task categories and priorities. The system is built using Node.js, Express, PostgreSQL, HTML, CSS, and JavaScript.

## Features

- **Task CRUD Operations:** Create, read, update, and delete tasks.
- **Category Management:** Add and remove categories for task organization.
- **Responsive UI:** Modern, responsive design with a sidebar, modals, and interactive task cards.
- **RESTful API:** Backend built with Node.js and Express to handle all data operations.
- **Persistent Storage:** Uses PostgreSQL to store tasks and categories.

## Project Structure

```
task_management/
├── css/
│   └── styles.css        # Contains all custom styles for the UI.
├── js/
│   └── main.js           # Contains client-side JavaScript for DOM manipulation, modals, and API calls.
├── html/
│   └── index.html        # The main HTML file that structures the UI.
└── server.js             # Express server file handling API endpoints and PostgreSQL connection.
```

## Prerequisites

- **Node.js** (v14+ recommended)
- **PostgreSQL**
- **npm** (Node Package Manager)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task_management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content (update with your PostgreSQL credentials):

```
PG_USER=your_db_username
PG_HOST=localhost
PG_DATABASE=your_db_name
PG_PASSWORD=your_db_password
PG_PORT=5432
PORT=3000
```

### 4. Set Up the Database

Create the necessary tables in PostgreSQL:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  task_date DATE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  priority VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

### 5. Run the Server

Start the Express server by running:

```bash
node server.js
```

The server will run on the port specified in your `.env` file (default is `3000`).

### 6. Access the Application

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to start using the task management system.

## Usage

- **Add Task:**  
  Click on the **"Add task"** button to open the task modal. Fill out the form fields including title, date, description, category, and priority, then submit the form to create a new task.

- **Add Category:**  
  Click on the **"Add category"** button to open the category modal. Enter a new category name and submit the form. The new category will be added to the task form's category dropdown.

- **Manage Tasks:**  
  Tasks are displayed as cards in the main view. Each card shows task details like title, date, category, and priority. Use the delete button (×) on each card to remove a task.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, Axios (for HTTP requests)
- **Backend:** Node.js, Express, PostgreSQL
- **Design:** Custom CSS with modern design principles, Font Awesome for icons
