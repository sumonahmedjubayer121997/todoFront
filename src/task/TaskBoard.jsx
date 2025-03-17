import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import useSWR from 'swr';

import SearchTask from './SearchTask';
import TaskActions from './TaskActions';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';

export default function TaskBoard() {
  const defaultTask = {
    id: crypto.randomUUID(),
    title: 'Learn React Native',
    description:
      'I want to Learn React such thanI can treat it like my slave and make it do whatever I want to do.',
    tags: ['web', 'react', 'js'],
    priority: 'High',
    isFavorite: true,
  };
  const modalOpen = false;
  const [tasks, setTasks] = useState([defaultTask]);
  const [showAddModal, setShowAddModal] = useState(modalOpen);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  // Fetch tasks from MongoDB on component mount
  // Fetch tasks from MongoDB when the component mounts
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/todos');
  //       const data = await response.json();
  //       console.log('Fetched Tasks:', data); // Debugging: Check if data is coming
  //       setTasks(data); // Set tasks state
  //     } catch (error) {
  //       console.error('Error fetching tasks:', error);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token'); // Get JWT Token
      if (!token) {
        console.error('No token found, user must log in.');
        return;
      }

      try {
        const response = await fetch(
          'https://simpleserverjs.vercel.app/api/todos',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Attach Token
            },
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setTasks(data); // Set tasks state
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (newTask, isAdd) => {
    try {
      const token = localStorage.getItem('token'); // ✅ Get the stored JWT token
      if (!token) {
        console.error('No token found. User must log in.');
        alert('You must be logged in to add tasks.');
        return;
      }

      const url = isAdd
        ? 'https://simpleserverjs.vercel.app/api/todos' // ✅ Create Task
        : `https://simpleserverjs.vercel.app/api/todos/${newTask._id}`; // ✅ Update Task

      const method = isAdd ? 'POST' : 'PUT'; // ✅ Dynamic method based on isAdd

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Attach Bearer Token
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save task');
      }

      if (isAdd) {
        setTasks((prevTasks) => [...prevTasks, data]); // ✅ Add new task to state
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === data._id ? data : task))
        ); // ✅ Update existing task
      }

      // ✅ Close modal and reset taskToUpdate
      setShowAddModal(false);
      setTaskToUpdate(null);
    } catch (error) {
      console.error('❌ Error in handleAddTask:', error);
      alert(error.message || 'Something went wrong while saving the task.');
    }
  };

  // const handleAddTask = async (newTask, isAdd) => {
  //   try {
  //     console.log('Submitting Task:', newTask); // Debugging step

  //     if (isAdd) {
  //       // ✅ Add New Task
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/tasks', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(newTask),
  //       });

  //       if (!response.ok) throw new Error('Failed to add task');

  //       const data = await response.json();
  //       setTasks((prevTasks) => [...prevTasks, data]); // Update UI with new task
  //     } else {
  //       // ✅ Update Existing Task
  //       const response = await fetch(
  //         `https://simpleserverjs.vercel.app/api/tasks/${newTask._id}`,
  //         {
  //           method: 'PUT',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(newTask),
  //         }
  //       );

  //       if (!response.ok) throw new Error('Failed to update task');

  //       const updatedTask = await response.json();
  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //           task._id === updatedTask._id ? updatedTask : task
  //         )
  //       );
  //     }

  //     setShowAddModal(false);
  //     setTaskToUpdate(null);
  //   } catch (error) {
  //     console.error('Error adding/updating task:', error);
  //   }
  // };

  // const handleAddTask = async (newTask, isAdd) => {
  //   try {
  //     if (isAdd) {
  //       console.log('Sending Task Data:', newTask); // Debugging step

  //       // ✅ Convert array fields to strings
  //       const formattedTask = {
  //         title: Array.isArray(newTask.title)
  //           ? newTask.title[0]
  //           : newTask.title,
  //         description: Array.isArray(newTask.description)
  //           ? newTask.description[0]
  //           : newTask.description,
  //         tags: Array.isArray(newTask.tags) ? newTask.tags : [],
  //         priority: Array.isArray(newTask.priority)
  //           ? newTask.priority[0]
  //           : newTask.priority,
  //         isFavorite: Boolean(newTask.isFavorite),
  //       };

  //       // ✅ Send formatted task to the backend
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/tasks', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(formattedTask),
  //       });

  //       if (!response.ok) {
  //         const errorMessage = await response.text();
  //         throw new Error('Failed to add task: ' + errorMessage);
  //       }

  //       const data = await response.json();
  //       setTasks((prevTasks) => [...prevTasks, data]); // Update state
  //     }
  //   } catch (error) {
  //     console.error('Error adding/updating task:', error);
  //   }
  // };

  // const handleAddTask = async (newTask, isAdd) => {
  //   try {
  //     if (isAdd) {
  //       console.log('Sending Task Data:', newTask); // Debugging step

  //       // Ensure that newTask has all required fields
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/tasks', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           title: newTask.title || 'Untitled Task',
  //           description: newTask.description || '',
  //           tags: newTask.tags || [],
  //           priority: newTask.priority || 'low',
  //           isFavorite: newTask.isFavorite || false,
  //         }),
  //       });

  //       if (!response.ok) {
  //         const errorMessage = await response.text();
  //         throw new Error('Failed to add task: ' + errorMessage);
  //       }

  //       const data = await response.json();
  //       setTasks((prevTasks) => [...prevTasks, data]); // Update state
  //     }
  //   } catch (error) {
  //     console.error('Error adding/updating task:', error);
  //   }
  // };

  // const handleAddTask = async (newTask, isAdd) => {
  //   try {
  //     if (isAdd) {
  //       // ✅ Send POST request to backend to add new task
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/tasks', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(newTask),
  //       });

  //       if (!response.ok) throw new Error('Failed to add task');

  //       const data = await response.json();
  //       setTasks((prevTasks) => [...prevTasks, data]); // Update state
  //     } else {
  //       // ✅ Send PUT request to update existing task
  //       const response = await fetch(
  //         `https://simpleserverjs.vercel.app/api/tasks/${newTask._id}`,
  //         {
  //           method: 'PUT',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(newTask),
  //         }
  //       );

  //       if (!response.ok) throw new Error('Failed to update task');

  //       const updatedTask = await response.json();
  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //           task._id === updatedTask._id ? updatedTask : task
  //         )
  //       );
  //     }

  //     setShowAddModal(false);
  //     setTaskToUpdate(null);
  //   } catch (error) {
  //     console.error('Error adding/updating task:', error);
  //   }
  // };

  // const handleAddTask = async (newTask, isAdd) => {
  //   try {
  //     if (isAdd) {
  //       // Add new task to MongoDB
  //       const response = await fetch('https://simpleserverjs.vercel.app/api/tasks', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(newTask),
  //       });

  //       const data = await response.json();
  //       setTasks((prevTasks) => [...prevTasks, data]); // Update state with new task
  //     } else {
  //       // Update existing task in MongoDB
  //       const response = await fetch(
  //         `https://simpleserverjs.vercel.app/api/tasks/${newTask._id}`,
  //         {
  //           method: 'PUT',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(newTask),
  //         }
  //       );

  //       const updatedTask = await response.json();
  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //           task._id === updatedTask._id ? updatedTask : task
  //         )
  //       );
  //     }

  //     // Close the modal after adding/updating
  //     setShowAddModal(false);
  //     setTaskToUpdate(null);
  //   } catch (error) {
  //     console.error('Error adding/updating task:', error);
  //   }
  // };

  const handleCloseClick = () => {
    setShowAddModal(false);
    setTaskToUpdate(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Send a DELETE request to remove the task from MongoDB
      await fetch(`https://simpleserverjs.vercel.app/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      // Update the frontend state by filtering out the deleted task
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteAllTask = () => {
    tasks.length = 0;
    setTasks([...tasks]);
    //setTasks([]);
  };
  const handleFavorite = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isFavorite: !task.isFavorite };
        } else {
          return task;
        }
      })
    );
  };

  const handleSearch = (searchTerm) => {
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks([...filteredTasks]);
    //console.log('Search Term:', searchTerm);
  };
  // const handleAddTask = (newTask, isAdd) => {
  //   // console.log('Add Task Clicked', newTask);
  //   if (isAdd) {
  //     setTasks([...tasks, newTask]);
  //     setShowAddModal(false);
  //     newTask = {};
  //   } else {
  //     setTasks(
  //       tasks.map((task) => {
  //         if (task.id === newTask.id) {
  //           return newTask;
  //         }
  //         return task;
  //       })
  //     );
  //     setShowAddModal(false);
  //     newTask = {};
  //   }
  // };
  // const handleEdit = (task) => {
  //   const formattedTask = {
  //     id: task.id,
  //     title: Array.isArray(task.title) ? task.title[0] : task.title,
  //     description: Array.isArray(task.description) ? task.description[0] : task.description,
  //     priority: Array.isArray(task.priority) ? task.priority[0] : task.priority,
  //     tags: Array.isArray(task.tags) ? task.tags.map(tag => tag) : task.tags,
  //   };

  //   console.log("Editing task:", formattedTask);
  //   setSelectedTask(formattedTask);
  //    console.log('Editing task:', task);
  // };

  const handleEdit = (task) => {
    console.log('Editing task:', task); // Debugging step

    // ✅ Ensure taskToUpdate is formatted correctly
    const formattedTask = {
      _id: task._id, // Ensure ID is correctly passed
      title: task.title || '',
      description: task.description || '',
      tags: Array.isArray(task.tags) ? task.tags : [],
      priority: task.priority || 'low',
      isFavorite: task.isFavorite || false,
    };

    setTaskToUpdate(formattedTask);
    setShowAddModal(true);
  };

  return (
    <section className="mb-20" id="tasks">
      {showAddModal && (
        <AddTaskModal
          onSave={handleAddTask}
          taskToUpdate={taskToUpdate}
          onCloseClick={handleCloseClick}
        />
      )}
      <div className="container">
        <SearchTask onSearch={handleSearch} />
        <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
          <TaskActions
            onAddClick={() => setShowAddModal(true)}
            onDeleteAll={handleDeleteAllTask}
            tasks={tasks}
          />
          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDeleteTask}
              onFav={handleFavorite}
            />
          ) : (
            <div className="text-center text-white text-2xl">
              No Tasks Found
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
