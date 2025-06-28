import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, ChevronDown } from "lucide-react";
import KanbanTask from "./KanbanTask";

function KanbanColumn({ 
  column, 
  deleteTask, 
  formatDueDate, 
  isOverdue, 
  showAddTaskButton, 
  onAddTaskClick,
  onEditTask 
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 flex flex-col h-[70vh]">
      {/* Fixed column header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{column.title}</h3>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
      </div>
      
      {/* Scrollable task area with visual indicators */}
      <div className="flex-1 relative">
        <div 
          ref={setNodeRef} 
          className="absolute inset-0 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded"
        >
          {/* Show scroll indicator if there are tasks */}
          {column.tasks.length > 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none flex justify-center items-end pb-1 z-10">
              <ChevronDown size={16} className="text-gray-400 animate-bounce" />
            </div>
          )}
          
          <SortableContext 
            id={column.id} 
            items={column.tasks.map(task => task.id)} 
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                columnId={column.id}
                onDelete={() => deleteTask(column.id, task.id)}
                formatDueDate={formatDueDate}
                isOverdue={isOverdue}
                onEdit={onEditTask}
              />
            ))}
          </SortableContext>
          
          {column.tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No tasks yet</p>
              <p className="text-xs">Drag tasks here or add new ones</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed column footer */}
      <div className="p-3 border-t border-gray-200">
        {showAddTaskButton && (
          <button
            onClick={onAddTaskClick}
            className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} className="mr-1" /> Add Task
          </button>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;