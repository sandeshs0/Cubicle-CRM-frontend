import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  CheckSquare,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";

function KanbanTask({
  task,
  columnId,
  onDelete,
  formatDueDate,
  isOverdue,
  onEdit,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
        columnId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate checklist completion percentage
  const getCompletionPercentage = () => {
    if (!task.checklist || task.checklist.length === 0) return 0;
    const completedItems = task.checklist.filter(
      (item) => item.completed
    ).length;
    return Math.round((completedItems / task.checklist.length) * 100);
  };

  // Priority color mapping
  const priorityColors = {
    low: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
    medium: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
    high: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      dot: "bg-orange-500",
    },
    critical: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  };

  const priorityColor = task.priority
    ? priorityColors[task.priority]
    : priorityColors.medium;
  const completionPercentage = getCompletionPercentage();

  // Handle edit click
  const handleEditClick = () => {
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-md p-4 mb-3  shadow-sm border border-gray-100 relative group"
    >
      {/* Drag handle - ONLY PART WITH LISTENERS */}
      <div
        {...listeners}
        className="absolute left-0 top-0 border-r-2 border-gray-150 bottom-0 w-8 flex items-center justify-center cursor-grab rounded-l-md hover:bg-gray-50 active:cursor-grabbing"
      >
        <GripVertical size={16} className="text-gray-400" />
      </div>

      {/* Priority indicator */}
      {task.priority && (
        <div
          className="absolute left-8 top-4 w-2 h-10 rounded-r-full"
          style={{ backgroundColor: priorityColor.dot }}
        ></div>
      )}

      {/* Task content - CLICKABLE AREA */}
      <div className="pl-6 pr-4" onClick={handleEditClick}>
        <h4 className="font-medium mb-1 cursor-pointer">{task.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 cursor-pointer">
          {task.description}
        </p>

        {/* Task metadata and indicators */}
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {/* Due date */}
          {task.dueDate && (
            <div
              className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                isOverdue(task.dueDate)
                  ? "bg-red-100 text-red-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              <Calendar size={12} className="mr-1" />
              {formatDueDate(task.dueDate)}
            </div>
          )}

          {/* Priority badge */}
          {task.priority && (
            <div
              className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${priorityColor.bg} ${priorityColor.text}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
          )}

          {/* Checklist indicator */}
          {task.checklist && task.checklist.length > 0 && (
            <div className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              <CheckSquare size={12} className="mr-1" />
              {`${completionPercentage}%`}
            </div>
          )}

          {/* Image indicator */}
          {task.image && (
            <div className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
              <ImageIcon size={12} className="mr-1" />
              Image
            </div>
          )}
        </div>

        {/* Preview image if exists */}
        {task.image && (
          <div className="mt-3 rounded-md overflow-hidden h-20 bg-gray-100">
            <img
              src={task.image}
              alt={task.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/150?text=Image+Error";
              }}
            />
          </div>
        )}

        {/* Checklist progress bar */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanTask;
