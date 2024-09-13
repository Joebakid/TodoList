import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF

export default function TodoAppComponents() {
  return <TodoApp />;
}

function TodoApp() {
  const [tasks, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTask(JSON.parse(storedTasks));
    }
  }, []); // This runs only once when the component mounts

  // Save tasks to local storage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // handle change in input field
  function handleInputChange(e) {
    setNewTask(e.target.value);
  }

  //   function to toggle task completion
  function toggleTaskCompletion(index) {
    const updatedTasks = tasks.map((task, taskIndex) => {
      if (taskIndex === index) {
        return { ...task, completed: !task.completed };
      }
      console.log(task, index);
      return task;
    });
    setTask(updatedTasks);
  }

  // if string empty, return nothing.
  // The spread operator (...tasks) copies the current tasks array. This is important because you want to preserve the existing tasks and append the new one.
  //   { text: newTask, completed: false }: This creates a new object representing the new task:
  //   text: newTask assigns the current value of the newTask input to the task's text.
  // completed: false ensures that, when a new task is added, it is not completed by default.

  function addTask() {
    if (newTask === "") return;
    setTask([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  }

  //Reset List
  function resetTaskList() {
    setTask([]);
  }

  // Handle 'Enter' key to add the task
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  function deleteTask(e, index) {
    e.stopPropagation();
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTask(updatedTasks);
  }

  // Export tasks to PDF
  function exportToPDF() {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.text("Todo List", 10, yOffset);
    tasks.forEach((task, index) => {
      yOffset += 10;
      doc.text(
        `${index + 1}. ${task.text} - ${
          task.completed ? "Completed" : "Incomplete"
        }`,
        10,
        yOffset
      );
    });

    doc.save("tasks.pdf"); // Save the PDF file with the name 'tasks.pdf'
  }

  return (
    <div className="mobileResponsive">
      <h2>Todo App</h2>

      <input
        type="text"
        value={newTask}
        onChange={handleInputChange}
        placeholder="Enter new task"
        className="input "
        onKeyDown={handleKeyDown}
      ></input>
      <button onClick={addTask} className="btn addTaskBtn">
        Add Task
      </button>
      <ul className="list">
        {tasks.map((task, index) => (
          <li
            key={index}
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
            onClick={() => toggleTaskCompletion(index)}
            className="pointer text-size"
          >
            {task.text}
            <button
              onClick={(e) => deleteTask(e, index)}
              className="btn deleteBtn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="btn resetBtn" onClick={resetTaskList}>
        Reset TaskList
      </button>
      <button className="btn convertToBtn" onClick={exportToPDF}>
        Convert to pdf
      </button>
    </div>
  );
}
