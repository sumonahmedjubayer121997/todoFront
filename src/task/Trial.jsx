import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import useSWR from 'swr';

import SearchTask from './SearchTask';
import TaskActions from './TaskActions';
import TaskList from './TaskList';
import AddTaskModal from './AddTaskModal';
import Header from '../Header';

// const fetcher = async (url) => {
//   const token = localStorage.getItem('token'); // ✅ Get the token from localStorage

//   if (!token) {
//     console.error('No authentication token found.');
//     throw new Error('No authentication token. Please log in again.');
//   }

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // ✅ Include the token
//       },
//       credentials: 'include', // ✅ Important for cookies
//       mode: 'cors',
//     });
//     console.log('🔍 Fetch Request Status:', response.status);
//     console.log('🔍 Fetch Request Headers:', response.headers);
//     if (!response.ok) {
//       const errorData = await response.json();
//       console.log('Error Data:', errorData);
//       throw new Error(errorData.message || 'Unauthorized or fetch error');
//     }

//     return response.json();
//   } catch (error) {
//     console.error('Fetch Error:', error);
//     throw new Error(
//       error.message || 'Something went wrong while fetching data.'
//     );
//   }
// };

const fetcher = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ REQUIRED for sending cookies
    });

    console.log('🔍 Fetch Request Status:', response.status);
    console.log('🔍 Fetch Request Headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Fetch Error Data:', errorData);
      throw new Error(errorData.message || 'Unauthorized or fetch error');
    }

    return response.json();
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    throw new Error(
      error.message || 'Something went wrong while fetching data.'
    );
  }
};

const Todos = () => {
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
  const [tasks, setTasks] = useState([]); // 🔹 Stores ALL tasks from the server
  const [filteredTasks, setFilteredTasks] = useState([]); // 🔹 Stores SEARCHED tasks
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  const { data, error, isLoading } = useSWR(
    'https://simpleserverapp.vercel.app/api/todos/',
    fetcher
  );
  // ✅ Only update `tasks` when `data` changes
  useEffect(() => {
    if (data) {
      setTasks(data);
      setFilteredTasks(data);
    }
  }, [data]);

  if (error) {
    console.error('API Fetch Error:', error.message);
    return (
      <h1 className="text-2xl py-2 text-red-500">
        {error.message || 'Something went wrong while fetching the data.'}
      </h1>
    );
  }

  if (isLoading) {
    return (
      <h1 className="text-2xl py-2 text-blue-500">
        Loading data, please wait...
      </h1>
    );
  }
  console.log('Stored Token:', localStorage.getItem('token'));

  console.log('Fetched Data:', data);
  //setTasks(data);
  console.log(tasks);
  //Adding new Task

  const handleAddTask = async (newTask, isAdd) => {
    try {
      // ✅ Check if user is logged in
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user')); // ✅ Get user data from localStorage

      console.log('🔍 Debug - Request User:', user); // ✅ Log user info
      if (!token || !user?.id) {
        console.error('❌ No token or user ID found. User must log in.');
        alert('You must be logged in to add tasks.');
        return;
      }

      // ✅ Ensure newTask has required fields
      const taskData = {
        title: newTask.title || 'Untitled Task', // ✅ Default title if missing
        description: newTask.description || '', // ✅ Default empty string
        tags: newTask.tags || [], // ✅ Default empty array
        priority: newTask.priority || 'Medium', // ✅ Default priority
        isFavorite: newTask.isFavorite || false, // ✅ Default to false
        isCompleted: newTask.isCompleted || false, // ✅ Default to false
        userID: user.id, // ✅ Add the userID
      };

      const url = isAdd
        ? 'https://simpleserverapp.vercel.app/api/todos' // ✅ Create Task
        : `https://simpleserverapp.vercel.app/api/todos/${newTask._id}`; // ✅ Update Task

      const method = isAdd ? 'POST' : 'PUT'; // ✅ Dynamic method

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Attach token
        },
        credentials: 'include', // ✅ Include cookies if needed
        body: JSON.stringify(taskData),
      });

      // ✅ Handle errors properly
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save task');
      }

      // ✅ Update State Based on Add or Edit
      setTasks((prevTasks) =>
        isAdd
          ? [...prevTasks, data]
          : prevTasks.map((task) => (task._id === data._id ? data : task))
      );

      // ✅ Close modal and reset taskToUpdate
      setShowAddModal(false);
      setTaskToUpdate(null);
    } catch (error) {
      console.error('❌ Error in handleAddTask:', error.message);
      alert(error.message || 'Something went wrong while saving the task.');
    }
  };

  const handleCloseClick = () => {
    setShowAddModal(false);
    setTaskToUpdate(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log('🗑️ Attempting to delete task with ID:', taskId);

      const token = localStorage.getItem('token'); // ✅ Ensure token is included
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(
        `https://simpleserverapp.vercel.app/api/todos/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token
          },
          credentials: 'include', // ✅ Ensure cookies are sent if required
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete task from the server.'
        );
      }

      console.log('✅ Task Deleted Successfully:', taskId);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId && task.id !== taskId)
      );
    } catch (error) {
      console.error('❌ Error deleting task:', error.message);
    }
  };

  const handleDeleteAllTask = () => {
    tasks.length = 0;
    setTasks([...tasks]);
    //setTasks([]);
  };

  const handleFavorite = async (taskId) => {
    try {
      console.log('🟡 Toggling Favorite for Task ID:', taskId);
      setTaskToUpdate(data);
      // ✅ Find the task
      const taskToUpdate = data.find((task) => task._id === taskId);
      if (!taskToUpdate) {
        console.error('❌ Task not found.');
        return;
      }
      console.log(taskToUpdate);
      // ✅ Toggle `isFavorite`
      const updatedTask = {
        ...taskToUpdate,
        isFavorite: !taskToUpdate.isFavorite,
      };
      console.log(updatedTask);

      // ✅ Ensure token is included
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No auth token found.');
        return;
      }

      // ✅ Ensure proper request payload
      const response = await fetch(
        `https://simpleserverapp.vercel.app/api/todos/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Attach authentication token
          },
          credentials: 'include',
          body: JSON.stringify(updatedTask), // ✅ Send the entire updated task
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to update favorite status.'
        );
      }

      const updatedData = await response.json();
      console.log('✅ Updated Task:', updatedData);

      // ✅ Update state
      setTasks((prevTasks) =>
        prevTasks.map(
          (task) => (task._id === taskId ? updatedData.todo : task) // ✅ Replace with latest data from server
        )
      );

      console.log('✅ Favorite Updated Successfully!');
    } catch (error) {
      console.error('❌ Error updating favorite:', error);
    }
  };

  //   const handleFavorite = (taskId) => {
  //     console.log(tasks);
  //     setTasks((prevTasks) =>
  //       prevTasks.map((task) => {
  //         console.log(task);
  //         task._id === taskId // ✅ Ensure `_id` is checked if that's what MongoDB uses
  //           ? { ...task, isFavorite: !task.isFavorite } // ✅ Toggle `isFavorite`
  //           : task;
  //       })
  //     );
  //   };

  //   const handleFavorite = async (taskId) => {
  //     try {
  //       console.log('🟡 Toggling Favorite for Task ID:', taskId);
  //     //  console.log(data);
  //       // ✅ Find the task in `tasks`
  //       const taskToUpdate = data.find((task) => task._id === taskId);
  //       if (!taskToUpdate) {
  //         console.error('❌ Task not found.');
  //         return;
  //       }

  //       // ✅ Toggle isFavorite
  //       const updatedTask = {
  //         ...taskToUpdate,
  //         isFavorite: !taskToUpdate.isFavorite,
  //       };

  //       // ✅ Send update request to the server
  //       const response = await fetch(
  //         `https://simpleserverjs.vercel.app/api/todos/${taskId}`,
  //         {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ Attach auth token
  //           },
  //           body: JSON.stringify({ isFavorite: updatedTask.isFavorite }), // ✅ Send only the updated field
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error('Failed to update favorite status.');
  //       }

  //       // ✅ Fetch updated task list from the server
  //       const updatedData = await response.json();
  //       console.log('✅ Updated Task:', updatedData);

  //       // ✅ Update state with the latest data
  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //           task._id === taskId
  //             ? { ...task, isFavorite: updatedData.todo.isFavorite }
  //             : task
  //         )
  //       );

  //       console.log('✅ Favorite Updated Successfully!');
  //     } catch (error) {
  //       console.error('❌ Error updating favorite:', error);
  //     }
  //   };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredTasks(tasks); // Reset to all tasks if search is empty
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      console.log('🔍 Searching for:', lowerSearchTerm);

      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(lowerSearchTerm)
      );

      console.log('🟢 Filtered Results:', filtered);
      setFilteredTasks(filtered);
    }
  };

  const handleEdit = (task) => {
    if (!task || !task._id) {
      console.error('❌ Error: Task is missing or has no ID.');
      alert('Task data is invalid.');
      return;
    }

    console.log('📝 Editing Task - Before State Update:', task); // ✅ Debugging step

    // ✅ Ensure priority updates properly
    const validPriorities = ['Low', 'Medium', 'High'];
    let formattedPriority =
      typeof task.priority === 'string' ? task.priority.toLowerCase() : 'low'; // ✅ Convert priority to lowercase

    if (!validPriorities.includes(formattedPriority)) {
      formattedPriority = 'low'; // ✅ Default to "low" if priority is invalid
    }

    // ✅ Ensure taskToUpdate is formatted correctly
    const formattedTask = {
      _id: task._id, // ✅ Ensure ID is correctly passed
      title: task.title?.trim() || 'Untitled Task', // ✅ Trim input & default value
      description: task.description?.trim() || '', // ✅ Trim input & prevent undefined
      tags: Array.isArray(task.tags) ? task.tags : [], // ✅ Ensure tags is always an array
      priority: formattedPriority, // ✅ Use validated priority
      isFavorite: Boolean(task.isFavorite), // ✅ Convert to boolean
    };

    console.log('✅ Updating State with:', formattedTask); // ✅ Debugging step

    setTaskToUpdate({ ...formattedTask }); // ✅ Force a state update
    setShowAddModal(false); // ✅ Close & re-open modal to trigger re-render
    setTimeout(() => setShowAddModal(true), 100); // ✅ Ensure modal refreshes
    task.description?.trim();
  };

  return (
    <>
      <Header />
      <div className="py-9" />
      <section className="mb-20 font-poppins" id="tasks">
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
            {filteredTasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onDelete={handleDeleteTask}
                onEdit={handleEdit}
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
    </>
  );
};

export default Todos;
