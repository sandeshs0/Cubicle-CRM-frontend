import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, CheckSquare, Calendar, AlertTriangle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function TaskModal({ isOpen, onClose, onSave, task = null, columns }) {
  const isEditing = !!task;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    columnId: "backlog",
    priority: "medium",
    checklist: [],
    image: null
  });
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Set form data when editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate || "",
        columnId: task.columnId || "backlog",
        priority: task.priority || "medium",
        checklist: task.checklist || [],
        image: task.image || null
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    setFormData({
      ...formData,
      checklist: [
        ...formData.checklist,
        { id: uuidv4(), text: newChecklistItem, completed: false }
      ]
    });
    setNewChecklistItem("");
  };

  const handleChecklistItemChange = (itemId, isCompleted) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map(item => 
        item.id === itemId ? { ...item, completed: isCompleted } : item
      )
    });
  };

  const handleChecklistItemDelete = (itemId) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== itemId)
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Title is required");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-10 overflow-y-auto py-10">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#007991] focus:border-[#007991]"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#007991] focus:border-[#007991]"
                placeholder="Enter task description"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-[#007991] focus:border-[#007991]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#007991] focus:border-[#007991]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="column" className="block text-sm font-medium text-gray-700 mb-1">
                Column
              </label>
              <select
                id="columnId"
                name="columnId"
                value={formData.columnId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#007991] focus:border-[#007991]"
              >
                {Object.values(columns).map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Attachment
              </label>
              {!formData.image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload an image (max 2MB)</p>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="relative border rounded-md overflow-hidden h-40">
                  <img
                    src={formData.image}
                    alt="Task"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checklist
              </label>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add a checklist item"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-[#007991] focus:border-[#007991]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 py-2 bg-[#007991] text-white rounded-r-md hover:bg-[#006980]"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {formData.checklist.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">No checklist items yet</p>
                ) : (
                  <div className="relative">
                    {/* Scroll shadow indicators */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
                    
                    {/* Scrollable checklist */}
                    <ul className="space-y-2 max-h-64 overflow-y-auto py-4 pr-1 
                                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded">
                      {formData.checklist.map((item) => (
                        <li key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(e) => handleChecklistItemChange(item.id, e.target.checked)}
                              className="w-4 h-4 text-[#007991] focus:ring-[#007991] border-gray-300 rounded mr-2"
                            />
                            <span className={item.completed ? "line-through text-gray-500" : ""}>
                              {item.text}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleChecklistItemDelete(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Checklist progress */}
                {formData.checklist.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {formData.checklist.filter(item => item.completed).length}/{formData.checklist.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            formData.checklist.length > 0
                              ? (formData.checklist.filter(item => item.completed).length / formData.checklist.length) * 100
                              : 0
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#007991] text-white rounded-md hover:bg-[#006980]"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;