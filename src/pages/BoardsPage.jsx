import {
  AlertCircle,
  Edit,
  Grid,
  Loader,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createBoard,
  deleteBoard,
  getUserBoards,
} from "../services/boardService";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: "",
    description: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await getUserBoards();
      setBoards(data);
      setError(null);
    } catch (err) {
      setError("Failed to load boards. Please try again.");
      toast.error("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoard.title) {
      toast.error("Board title is required");
      return;
    }

    try {
      setIsCreating(true);
      const createdBoard = await createBoard(newBoard);
      setBoards([createdBoard, ...boards]);
      setShowCreateModal(false);
      setNewBoard({ title: "", description: "" });
      toast.success("Board created successfully");
    } catch (err) {
      toast.error("Failed to create board");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (id) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        await deleteBoard(id);
        setBoards(boards.filter((board) => board._id !== id));
        toast.success("Board deleted successfully");
      } catch (err) {
        toast.error("Failed to delete board");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Boards</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="mr-2" size={18} />
          Create Board
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-500" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.length === 0 ? (
            <div className="col-span-full bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Grid className="mx-auto mb-3 text-gray-400" size={40} />
              <h3 className="text-lg font-medium text-gray-700">
                No boards yet
              </h3>
              <p className="text-gray-500 mt-1 mb-4">
                Create your first board to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Board
              </button>
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {board.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {board.description || "No description"}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span>Created by </span>
                      <span className="font-medium ml-1">
                        {board.createdBy?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/dashboard/boards/${board._id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Board
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewBoard({
                            title: board.title,
                            description: board.description || "",
                          });
                          // Here you would implement edit functionality
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Board</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateBoard}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Board Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter board title"
                  value={newBoard.title}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter board description"
                  value={newBoard.description}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, description: e.target.value })
                  }
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Board"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardsPage;
