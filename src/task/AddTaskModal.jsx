import React, { useState, useEffect } from 'react';

const defaultTask = {
  title: '',
  description: '',
  tags: [],
  priority: '',
  isFavorite: false,
};

export default function AddTaskModal({ onSave, taskToUpdate, onCloseClick }) {
  const [task, setTask] = useState(defaultTask);
  const [isAdd, setIsAdd] = useState(!taskToUpdate);

  // ✅ Update the task state when `taskToUpdate` changes
  useEffect(() => {
    console.log('🟢 Modal Re-render - taskToUpdate:', taskToUpdate);
    if (taskToUpdate) {
      setTask({ ...taskToUpdate });
      setIsAdd(false);
    } else {
      setTask(defaultTask);
      setIsAdd(true);
    }
  }, [taskToUpdate]);

  const handleChanges = (e) => {
    const { name, value } = e.target;

    setTask((prevTask) => ({
      ...prevTask,
      [name]: name === 'tags' ? value.split(',') : value, // ✅ Ensure tags are always an array
    }));
  };

  return (
    <>
      <div className="bg-black bg-opacity-70 h-full z-10 absolute top-0 left-0"></div>
      <form className="mx-auto my-10 w-full max-w-[740px] rounded-xl border border-[#FEFBFB]/[36%] bg-[#191D26] p-9 max-md:px-4 lg:my-20 lg:p-11 z-10 absolute top-1/4 left-1/3">
        <h2 className="mb-9 text-center text-2xl font-bold text-white lg:mb-11 lg:text-[28px]">
          {isAdd ? 'Add New Task' : 'Edit Task'}
        </h2>

        <div className="space-y-9 text-white lg:space-y-10">
          {/* Title */}
          <div className="space-y-2 lg:space-y-3">
            <label htmlFor="title">Title</label>
            <input
              className="block w-full rounded-md bg-[#2D323F] px-3 py-2.5"
              type="text"
              name="title"
              id="title"
              required
              value={task.title}
              onChange={handleChanges}
            />
          </div>

          {/* Description */}
          <div className="space-y-2 lg:space-y-3">
            <label htmlFor="description">Description</label>
            <textarea
              className="block min-h-[120px] w-full rounded-md bg-[#2D323F] px-3 py-2.5 lg:min-h-[180px]"
              name="description"
              id="description"
              required
              value={task.description}
              onChange={handleChanges}
            ></textarea>
          </div>

          {/* Tags & Priority */}
          <div className="grid-cols-2 gap-x-4 max-md:space-y-9 md:grid lg:gap-x-10 xl:gap-x-20">
            {/* Tags */}
            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="tags">Tags</label>
              <input
                className="block w-full rounded-md bg-[#2D323F] px-3 py-2.5"
                type="text"
                name="tags"
                id="tags"
                required
                value={task.tags.join(',')} // ✅ Convert array to comma-separated string
                onChange={handleChanges}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="priority">Priority</label>
              <select
                className="block w-full cursor-pointer rounded-md bg-[#2D323F] px-3 py-2.5"
                name="priority"
                id="priority"
                required
                value={task.priority || 'low'}
                onChange={handleChanges}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-16 flex justify-between lg:mt-20 font-poppins">
          <button
            className="rounded bg-red-600 px-4 py-2 text-white transition-all hover:opacity-80"
            onClick={onCloseClick}
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white transition-all hover:opacity-80"
            onClick={(e) => {
              e.preventDefault();
              onSave(task, isAdd);
            }}
          >
            {isAdd ? 'Create New Task' : 'Update Task'}
          </button>
        </div>
      </form>
    </>
  );
}
