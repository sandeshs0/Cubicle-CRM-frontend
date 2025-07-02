import { Calendar, CheckSquare, Plus, Trash2, User, X, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskModal = ({
  task = null,
  columnId,
  boardId,
  onClose,
  onSave,
  columns = {},
  users = [],
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: "medium",
    assignedTo: [],
    columnId: columnId,
    subtasks: [], // Renamed from checklist to subtasks
    labels: [], // Added labels array
    coverImage: "", // Added coverImage field
  });
  const [newSubtaskTitle, setNewSubtaskTitle] = useState(""); // Renamed from newCheckItem
  const [newLabel, setNewLabel] = useState({ text: "", color: "#3b82f6" });

  useEffect(() => {
    if (task) {
      // Transform existing data if needed
      const subtasks = task.checklist
        ? task.checklist.map((item) => ({
            _id: item.id, // Use existing id as _id for updating
            title: item.text, // Map text to title
            isCompleted: item.completed, // Map completed to isCompleted
          }))
        : task.subtasks || [];

      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        priority: task.priority || "medium",
        assignedTo: task.assignedTo || [],
        columnId: task.columnId || columnId,
        subtasks: subtasks,
        labels: task.labels || [],
        coverImage: task.coverImage || "",
      });
    } else {
      setFormData({
        ...formData,
        columnId: columnId,
      });
    }
  }, [task, columnId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDueDateChange = (date) => {
    setFormData({
      ...formData,
      dueDate: date,
    });
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newItem = {
        // No id for new subtasks, API will generate one
        title: newSubtaskTitle.trim(),
        isCompleted: false,
      };
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, newItem],
      });
      setNewSubtaskTitle("");
    }
  };

  const toggleSubtaskCompletion = (index) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      isCompleted: !updatedSubtasks[index].isCompleted,
    };

    setFormData({
      ...formData,
      subtasks: updatedSubtasks,
    });
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks.splice(index, 1);

    setFormData({
      ...formData,
      subtasks: updatedSubtasks,
    });
  };

  const handleAddLabel = () => {
    if (newLabel.text.trim()) {
      const labelId = newLabel.text.toLowerCase().replace(/\s+/g, "-");
      const newLabelObj = {
        id: labelId,
        text: newLabel.text.trim(),
        color: newLabel.color,
      };

      setFormData({
        ...formData,
        labels: [...formData.labels, newLabelObj],
      });
      setNewLabel({ text: "", color: "#3b82f6" });
    }
  };

  const removeLabel = (labelId) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((label) => label.id !== labelId),
    });
  };

  const toggleAssignUser = (userId) => {
    if (formData.assignedTo.includes(userId)) {
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, userId],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      boardId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Task title"
                required
              />
            </div>

            {/* Cover Image Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://example.com/image.jpg"
              />
              {formData.coverImage && (
                <div className="mt-2 relative h-32 rounded overflow-hidden">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x100?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Add a more detailed description..."
                rows="3"
              />
            </div>

            {/* Due Date and Column Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.dueDate}
                    onChange={handleDueDateChange}
                    dateFormat="MMM d, yyyy"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholderText="Select a date"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Column
                </label>
                <select
                  name="columnId"
                  value={formData.columnId || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {columns && typeof columns === "object" && Object.keys(columns).length > 0
                    ? Object.values(columns).map((column) => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>

            {/* Priority Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["low", "medium", "high", "critical"].map((priority) => (
                  <label
                    key={priority}
                    className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-colors ${
                      formData.priority === priority
                        ? getPriorityActiveClass(priority)
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Labels Field - NEW */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Tag size={16} className="mr-1" />
                Labels
              </label>

              {/* Display existing labels */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: `${label.color}20`, // 20% opacity version of the color
                      borderColor: label.color,
                      color: label.color,
                    }}
                  >
                    <span>{label.text}</span>
                    <button
                      type="button"
                      onClick={() => removeLabel(label.id)}
                      className="ml-2 text-current hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new label */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newLabel.text}
                  onChange={(e) =>
                    setNewLabel({ ...newLabel, text: e.target.value })
                  }
                  placeholder="Add a label"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                />
                <input
                  type="color"
                  value={newLabel.color}
                  onChange={(e) =>
                    setNewLabel({ ...newLabel, color: e.target.value })
                  }
                  className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Assigned Users Field */}
            {users.length > 0 && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Assigned To
                </label>
                <div className="flex flex-wrap gap-2">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => toggleAssignUser(user._id)}
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${
                        formData.assignedTo.includes(user._id)
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      <User size={14} className="mr-1" />
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks Field (Renamed from Checklist) */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <CheckSquare size={16} className="mr-1" />
                Subtasks
              </label>
              <div className="space-y-2">
                {formData.subtasks.map((subtask, index) => (
                  <div key={subtask._id || index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() => toggleSubtaskCompletion(index)}
                      className="mr-2 rounded text-blue-500"
                    />
                    <span
                      className={
                        subtask.isCompleted ? "line-through text-gray-500" : ""
                      }
                    >
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask"
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r hover:bg-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {task ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to get priority colors
const getPriorityActiveClass = (priority) => {
  switch (priority) {
    case "low":
      return "border-green-500 bg-green-50 text-green-700";
    case "medium":
      return "border-blue-500 bg-blue-50 text-blue-700";
    case "high":
      return "border-orange-500 bg-orange-50 text-orange-700";
    case "critical":
      return "border-red-500 bg-red-50 text-red-700";
    default:
      return "border-blue-500 bg-blue-50 text-blue-700";
  }
};

export default TaskModal;
