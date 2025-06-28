import { useState, useEffect } from "react";
import { FolderCheck, Users, ListTodo, Wallet, Check, Plus } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function OverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Task 1: Complete the backend models and controllers of BatoGo Application.",
      completed: false
    },
    {
      id: 2,
      text: "Task 1: Complete the backend models and controllers of BatoGo Application.",
      completed: true
    },
    {
      id: 3,
      text: "Task 1: Complete the backend models and controllers of BatoGo Application.",
      completed: true
    }
  ]);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Metrics data
  const metrics = [
    { 
      value: "10", 
      label: "Projects Completed", 
      icon: <FolderCheck size={20} className="text-blue-600" />,
      bgColor: "bg-blue-50" 
    },
    { 
      value: "6", 
      label: "Clients", 
      icon: <Users size={20} className="text-[#007991]" />,
      bgColor: "bg-[#f0f9ff]" 
    },
    { 
      value: "10", 
      label: "Tasks Due", 
      icon: <ListTodo size={20} className="text-amber-600" />,
      bgColor: "bg-amber-50" 
    },
    { 
      value: "Rs. 40,000", 
      label: "Pending Invoices", 
      icon: <Wallet size={20} className="text-green-600" />,
      bgColor: "bg-green-50" 
    },
  ];

  // Chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: [30, 70, 40, 90, 50, 80],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "red",
        pointBorderColor: "red",
        pointRadius: 5,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Date",
          position: "left",
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: "Revenue",
          position: "bottom",
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Add new task
  const addNewTask = () => {
    const newTask = {
      id: Date.now(),
      text: "Task 1: Complete the backend models and controllers of BatoGo Application.",
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="space-y-6">
      {/* Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            {isLoading ? (
              <div className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  {metric.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <div 
                      className={`w-6 h-6 mt-0.5 mr-3 rounded border flex-shrink-0 ${
                        task.completed 
                          ? 'border-gray-400 bg-gray-100' 
                          : 'border-gray-300'
                      } flex items-center justify-center cursor-pointer`}
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed && <Check size={16} className="text-gray-500" />}
                    </div>
                    <span className={task.completed ? 'text-gray-500' : 'text-gray-800'}>
                      {task.text}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-4">
                <button 
                  onClick={addNewTask}
                  className="bg-[#007991] hover:bg-[#005f73] text-white font-medium py-2 px-6 rounded-md inline-flex items-center"
                >
                  <Plus size={18} className="mr-1" />
                  Add Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Income overtime chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Income overtime</h2>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;