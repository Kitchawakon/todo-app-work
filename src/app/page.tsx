"use client";

import React, { useState} from "react";
import './styles.css'; 

interface Todo {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  duedate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duedate, setDuedate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showTodos, setShowTodos] = useState<boolean>(false); 

  const fetchTodos = () => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // สร้างงานใหม่
  const handleCreateTodo = () => {
    if (!name || !description || !duedate) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("http://localhost:3000/api/v1/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, duedate }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data.data]); 
        setName("");
        setDescription("");
        setDuedate("");
      })
      .catch((error) => console.error(error));
  };

  //อัพเดทสถานะการทำงาน
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    fetch(`http://localhost:3000/api/v1/todo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: !currentStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? { ...todo, status: !currentStatus } : todo
        );
        setTodos(updatedTodos);
      });
  };

  // ลบ Todo
  const handleDelete = (id: string) => {
    fetch(`http://localhost:3000/api/v1/todo`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <div className="page">
      <h1>TODO List</h1>
      <div>
        <h2>Create New Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          id="duedate"
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleCreateTodo} className="btn create-btn">
          Add Task
        </button>
        <button onClick={() => {
          fetchTodos();
          setShowTodos(true); 
        }} className="btn view-btn">
          View All Tasks
        </button>
        {showTodos && ( 
          <button onClick={() => setShowTodos(false)} className="btn close-btn">
            Close
          </button>
        )}
      </div>

      {showTodos && (
        <div className="todo-list-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="todo-list">
              {Array.isArray(todos) && todos.length > 0 ? (
                todos.map((todo) => (
                  <li key={todo._id} className="todo-item">
                    <h3 className={todo.status ? "completed" : ""}>{todo.name}</h3>
                    <p>{todo.description}</p>
                    <p>Due date: {todo.duedate}</p>
                    <p>Status: {todo.status ? "Completed" : "Not Completed"}</p>
                    <button
                      onClick={() => handleToggleStatus(todo._id, todo.status)}
                      className={`btn status-btn ${todo.status ? "completed-btn" : "incomplete-btn"}`}
                    >
                      {todo.status ? "Mark as Incomplete" : "Mark as Complete"}
                    </button>
                    <button onClick={() => handleDelete(todo._id)} className="btn delete-btn">
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No tasks found.</p>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
