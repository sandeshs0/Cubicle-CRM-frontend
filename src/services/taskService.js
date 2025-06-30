import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "x-auth-token": `${token}`,
    },
  };
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} Response from the API
 */
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(
      `${API_URL}/tasks`,
      taskData,
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Get a task by ID
 * @param {string} id - Task ID
 * @returns {Promise} Response from the API
 */
export const getTask = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${id}`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} Response from the API
 */
export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${id}`,
      taskData,
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise} Response from the API
 */
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/tasks/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

/**
 * Move a task between columns or reorder within a column
 * @param {string} id - Task ID
 * @param {string} columnId - Target column ID
 * @param {number} position - New position in the column
 * @returns {Promise} Response from the API
 */
export const moveTask = async (id, columnId, position) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${id}/move`,
      { columnId, position },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};

/**
 * Assign users to a task
 * @param {string} id - Task ID
 * @param {Array} userIds - Array of user IDs
 * @returns {Promise} Response from the API
 */
export const assignTask = async (id, userIds) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${id}/assign`,
      { assignedTo: userIds },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error assigning task:", error);
    throw error;
  }
};

/**
 * Add or update checklist items
 * @param {string} id - Task ID
 * @param {Array} checklist - Array of checklist items
 * @returns {Promise} Response from the API
 */
export const updateTaskChecklist = async (id, checklist) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${id}/checklist`,
      { checklist },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating task checklist:", error);
    throw error;
  }
};

/**
 * Toggle checklist item completion
 * @param {string} taskId - Task ID
 * @param {string} itemId - Checklist item ID
 * @param {boolean} completed - Completion status
 * @returns {Promise} Response from the API
 */
export const toggleChecklistItem = async (taskId, itemId, completed) => {
  try {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}/checklist/${itemId}/toggle`,
      { completed },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error toggling checklist item:", error);
    throw error;
  }
};
