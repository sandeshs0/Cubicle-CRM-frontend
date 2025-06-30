import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { format, isAfter } from "date-fns";
import { ChevronLeft, Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskModal from "../components/kanban/TaskModal";
import { getBoard } from "../services/boardService";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../services/columnService";
import {
  createTask,
  deleteTask,
  moveTask,
  updateTask,
} from "../services/taskService";

function KanbanPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState({});
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [users, setUsers] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      setIsLoading(true);
      const data = await getBoard(boardId);

      setBoard(data.board);

      // Transform columns and tasks into the format expected by our components
      const columnsMap = {};
      data.columns.forEach((column) => {
        columnsMap[column._id] = {
          id: column._id,
          title: column.title,
          tasks: [],
        };
      });

      // Add tasks to their respective columns
      data.tasks.forEach((task) => {
        if (columnsMap[task.columnId]) {
          columnsMap[task.columnId].tasks.push({
            id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            checklist: task.checklist || [],
            assignedTo: task.assignedTo,
            columnId: task.columnId,
            boardId: task.boardId,
          });
        }
      });

      setColumns(columnsMap);

      // Extract users from board members for task assignment
      if (data.board.members && data.board.members.length > 0) {
        const boardUsers = data.board.members.map((member) => ({
          _id: member.userId._id,
          name: member.userId.name,
          email: member.userId.email,
        }));
        setUsers(boardUsers);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching board:", err);
      setError("Failed to load board data");
      toast.error("Failed to load board data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDueDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM d");
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return isAfter(new Date(), new Date(date));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    // If no over target or same column, do nothing
    if (!over || !active.data.current) return;

    const activeId = active.id;
    const overId = over.id;

    // Handle case for dragging task over a column
    if (
      active.data.current.type === "task" &&
      over.data.current?.type === "column"
    ) {
      const activeColumnId = active.data.current.task.columnId;

      // If dragging to different column
      if (activeColumnId !== overId) {
        // We'll handle the actual moving in dragEnd - this is just for visuals if needed
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Handle case when task is dropped on a column
    if (
      active.data.current.type === "task" &&
      over.data.current?.type === "column"
    ) {
      const sourceColumn = columns[active.data.current.task.columnId];
      const targetColumn = columns[over.id];

      // Find the task that is being moved
      const taskIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeId
      );

      if (taskIndex === -1) return;

      try {
        // Create a copy of the columns
        const newColumns = { ...columns };

        // Remove task from source column
        const task = newColumns[sourceColumn.id].tasks[taskIndex];
        newColumns[sourceColumn.id].tasks.splice(taskIndex, 1);

        // Add task to destination column
        const updatedTask = { ...task, columnId: targetColumn.id };
        newColumns[targetColumn.id].tasks.push(updatedTask);

        // Update UI optimistically
        setColumns(newColumns);

        // Call API to move task
        await moveTask(
          activeId,
          targetColumn.id,
          newColumns[targetColumn.id].tasks.length - 1
        );
      } catch (error) {
        console.error("Failed to move task:", error);
        toast.error("Failed to move task");
        // Revert the UI state
        fetchBoardData();
      }
    }
    // Handle reordering tasks within the same column
    else if (
      active.data.current.type === "task" &&
      over.data.current?.type === "task" &&
      active.data.current.task.columnId === over.data.current.task.columnId
    ) {
      const columnId = active.data.current.task.columnId;
      const column = columns[columnId];
      const oldIndex = column.tasks.findIndex((task) => task.id === activeId);
      const newIndex = column.tasks.findIndex((task) => task.id === overId);

      if (oldIndex === newIndex) return;

      try {
        // Create a new array of tasks with the updated order
        const newTasks = arrayMove(column.tasks, oldIndex, newIndex);

        // Update UI optimistically
        setColumns({
          ...columns,
          [columnId]: {
            ...column,
            tasks: newTasks,
          },
        });

        // Call API to update task position
        await moveTask(activeId, columnId, newIndex);
      } catch (error) {
        console.error("Failed to reorder task:", error);
        toast.error("Failed to reorder task");
        // Revert the UI state
        fetchBoardData();
      }
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Create a copy of columns
        const newColumns = { ...columns };
        // Find task index
        const taskIndex = newColumns[columnId].tasks.findIndex(
          (task) => task.id === taskId
        );
        // Remove task from column
        newColumns[columnId].tasks.splice(taskIndex, 1);
        // Update state
        setColumns(newColumns);

        // Call API to delete task
        await deleteTask(taskId);
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("Failed to delete task");
        fetchBoardData();
      }
    }
  };

  const handleAddTask = (columnId) => {
    setCurrentTask(null);
    setCurrentColumnId(columnId);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setCurrentColumnId(task.columnId);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (currentTask) {
        // Editing existing task
        const updatedTask = await updateTask(currentTask.id, taskData);

        // Update UI
        const newColumns = { ...columns };

        // If the task moved to a different column
        if (currentTask.columnId !== updatedTask.columnId) {
          // Remove from old column
          const oldColumnTasks = newColumns[currentTask.columnId].tasks.filter(
            (t) => t.id !== currentTask.id
          );
          newColumns[currentTask.columnId].tasks = oldColumnTasks;

          // Add to new column
          newColumns[updatedTask.columnId].tasks.push(updatedTask);
        } else {
          // Update in the same column
          const taskIndex = newColumns[currentTask.columnId].tasks.findIndex(
            (t) => t.id === currentTask.id
          );
          newColumns[currentTask.columnId].tasks[taskIndex] = updatedTask;
        }

        setColumns(newColumns);
        toast.success("Task updated successfully");
      } else {
        // Creating new task
        const newTask = await createTask(taskData);

        // Add to UI
        const newColumns = { ...columns };
        newColumns[taskData.columnId].tasks.push(newTask);
        setColumns(newColumns);
        toast.success("Task created successfully");
      }

      setTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error(`Failed to ${currentTask ? "update" : "create"} task`);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) {
      toast.error("Column title cannot be empty");
      return;
    }

    try {
      const columnData = {
        title: newColumnTitle,
        boardId: boardId,
      };

      const newColumn = await createColumn(columnData);

      // Add to UI
      setColumns({
        ...columns,
        [newColumn._id]: {
          id: newColumn._id,
          title: newColumn.title,
          tasks: [],
        },
      });

      // Reset form
      setNewColumnTitle("");
      setIsAddingColumn(false);
      toast.success("Column added successfully");
    } catch (error) {
      console.error("Failed to add column:", error);
      toast.error("Failed to add column");
    }
  };

  const handleUpdateColumn = async (columnId, title) => {
    try {
      await updateColumn(columnId, { title });

      // Update UI
      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          title,
        },
      });

      toast.success("Column updated successfully");
    } catch (error) {
      console.error("Failed to update column:", error);
      toast.error("Failed to update column");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this column? All tasks will be deleted."
      )
    ) {
      try {
        await deleteColumn(columnId);

        // Update UI
        const newColumns = { ...columns };
        delete newColumns[columnId];
        setColumns(newColumns);

        toast.success("Column deleted successfully");
      } catch (error) {
        console.error("Failed to delete column:", error);
        toast.error("Failed to delete column");
      }
    }
  };

  const collisionDetectionStrategy = (args) => {
    // First, let's check for direct collisions with droppable containers
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // If no direct collisions, find the closest center
    return closestCenter(args);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-center mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-center text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{board.title}</h1>
        <button
          onClick={() => setIsAddingColumn(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Column
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto pb-4 gap-6">
          {Object.values(columns).map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              formatDueDate={formatDueDate}
              onAddTaskClick={() => handleAddTask(column.id)}
              onEditColumn={(title) => handleUpdateColumn(column.id, title)}
              isOverdue={isOverdue}
              users={users}
              onUpdateColumn={handleUpdateColumn}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
        </div>
      </DndContext>

      {taskModalOpen && (
        <TaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onSave={handleSaveTask}
          task={currentTask}
          columns={columns}
          boardId={boardId}
          users={users}
          columnId={currentColumnId}
        />
      )}

      {isAddingColumn && (
        <div className="mt-4">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="New column title"
            className="px-4 py-2 border rounded-md w-full"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsAddingColumn(false)}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddColumn}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition-colors"
            >
              Add Column
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanPage;
