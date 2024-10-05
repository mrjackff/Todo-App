import axios from "axios";
import React, { useEffect, useState } from "react";
import './Todo.css'; // Your custom styles if needed

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://127.0.0.1:3001/getTodoList')
            .then(result => {
                setTodoList(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://127.0.0.1:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                setTodoList([...todoList, res.data]); // Update state without reload
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
            })
            .catch(err => console.log(err));
    };

    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post(`http://127.0.0.1:3001/updateTodoList/${id}`, editedData)
            .then(result => {
                setTodoList(todoList.map(item => item._id === id ? { ...item, ...editedData } : item));
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline(""); 
            })
            .catch(err => console.log(err));
    };

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:3001/deleteTodoList/${id}`)
            .then(result => {
                setTodoList(todoList.filter(item => item._id !== id)); // Update state without reload
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Todo List</h1>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(todoList) && todoList.length > 0 ? (
                            todoList.map((data) => (
                                <tr key={data._id}>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                type="text"
                                                value={editedTask}
                                                onChange={(e) => setEditedTask(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            data.task
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                type="text"
                                                value={editedStatus}
                                                onChange={(e) => setEditedStatus(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            data.status
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                type="datetime-local"
                                                value={editedDeadline}
                                                onChange={(e) => setEditedDeadline(e.target.value)}
                                                className="form-control"
                                            />
                                        ) : (
                                            data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <button className="btn btn-success" onClick={() => saveEditedTask(data._id)}>
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn btn-warning" onClick={() => toggleEditable(data._id)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger" onClick={() => deleteTask(data._id)}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No tasks available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="add-task-container mt-4">
                <h2>Add Task</h2>
                <form onSubmit={addTask}>
                    <div className="form-row">
                        <div className="form-group col-12 col-md-4">
                            <label>Task</label>
                            <input type="text" placeholder="Enter Task" onChange={(e) => setNewTask(e.target.value)} value={newTask} className="form-control" required />
                        </div>
                        <div className="form-group col-12 col-md-4">
                            <label>Status</label>
                            <input type="text" placeholder="Enter Status" onChange={(e) => setNewStatus(e.target.value)} value={newStatus} className="form-control" required />
                        </div>
                        <div className="form-group col-12 col-md-4">
                            <label>Deadline</label>
                            <input type="datetime-local" onChange={(e) => setNewDeadline(e.target.value)} value={newDeadline} className="form-control" required />
                        </div>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Todo;
