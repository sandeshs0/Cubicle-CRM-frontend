import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Trello,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import authService from "../services/authService";

function DashboardLayout() {
  const { user, isLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    profileImage: "",
    plan: "free",
    role: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoadingProfile(true);
        const profileData = await authService.getUserProfile();
        setUserProfile({
          fullName: profileData.fullName || "User",
          email: profileData.email || "",
          profileImage: profileData.profileImage || "",
          plan: profileData.plan || "free",
          role: profileData.role || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle error - maybe redirect to login if unauthorized
        if (error.response && error.response.status === 401) {
          authService.logout();
          navigate("/login");
        }
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchUserProfile();
  }, [navigate]);

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "dashboard") return "Overview";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Plan badge styles and text
  const getPlanBadge = () => {
    switch (userProfile.plan.toLowerCase()) {
      case "pro":
        return {
          text: "Pro",
          bgColor: "bg-indigo-600",
          textColor: "text-white",
        };
      case "vantage":
        return {
          text: "Vantage",
          bgColor: "bg-purple-600",
          textColor: "text-white",
        };
      case "free":
      default:
        return {
          text: "Free Plan",
          bgColor: "bg-gray-200",
          textColor: "text-gray-700",
        };
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Overview",
      path: "/dashboard/overview",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Clients",
      path: "/dashboard/clients",
      icon: <UsersRound size={20} />,
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Inbox",
      path: "/dashboard/inbox",
      icon: <MessageSquare size={20} />,
    },
    { name: "Kanban", path: "/dashboard/kanban", icon: <Trello size={20} /> },
    {
      name: "Help Center",
      path: "/dashboard/help",
      icon: <HelpCircle size={20} />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  const planBadge = getPlanBadge();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left section: Menu button and logo */}
          <div className="flex items-center p-4 mt-2">
            {/* Remove the existing toggle button and just keep the logo */}
            <div className="flex items-center">
              <img
                src="/src/assets/logo.png"
                alt="Cubicle Logo"
                className="h-14 w-14"
              />
              <span className="ml-2 text-2xl font-semibold text-gray-800">
                Cubicle
              </span>
            </div>
          </div>

          {/* Right section: notifications, profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
              >
                <Bell size={25} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notification dropdown */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium">
                        New project invitation
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">Meeting reminder</p>
                      <p className="text-xs text-gray-500">Today at 3:00 PM</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-[#007991] hover:text-[#005f73] font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                {isLoadingProfile ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ) : userProfile.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#222E50] text-white flex items-center justify-center font-medium">
                    {userProfile.fullName
                      .split(" ")
                      .map((name) => name.charAt(0))
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium">
                  {isLoadingProfile ? (
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    userProfile.fullName
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className="hidden md:block text-gray-600"
                />
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium">{userProfile.fullName}</p>
                    <p className="text-xs text-gray-500">{userProfile.email}</p>
                  </div>
                  <NavLink
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          className={`bg-white shadow-sm z-10 relative ${
            sidebarOpen ? "block" : "hidden"
          } lg:block`}
          initial={{ width: isMobile ? 0 : 256 }}
          animate={{ width: sidebarOpen ? 256 : isMobile ? 0 : 72 }}
          transition={{ duration: 0.2 }}
        >
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-6 h-16 bg-white border border-gray-200 rounded-r-lg shadow-md flex items-center justify-center text-gray-500 hover:text-teal-600 transition-colors z-10"
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          <div
            className="h-full flex flex-col mt-10"
            style={{ width: sidebarOpen ? 256 : 72 }}
          >
            <div className="overflow-y-auto py-4 flex flex-col justify-between h-full">
              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center px-5 py-3.5 transition-colors bg-gradient-to-r from-[#005667]/20 from-1% via-[#005667]/5 to-[#FFFFFF] text-[#005667] font-bold"
                        : "flex items-center px-5 py-3.5 transition-colors text-gray-700 hover:bg-gray-100"
                    }
                  >
                    <div className="flex items-center">
                      <span className="w-6">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                    </div>

                    {/* Show indicator for active page */}
                    {({ isActive }) =>
                      isActive && (
                        <div className="ml-auto">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#222E50]"></div>
                        </div>
                      )
                    }
                  </NavLink>
                ))}
              </nav>

              {/* User profile card */}
              <div className="px-3 py-4 mt-auto">
                {isLoadingProfile ? (
                  <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ) : sidebarOpen ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      {userProfile.profileImage ? (
                        <img
                          src={userProfile.profileImage}
                          alt="Profile"
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#222E50] text-white flex items-center justify-center font-medium text-lg">
                          {userProfile.fullName
                            .split(" ")
                            .map((name) => name.charAt(0))
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {userProfile.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userProfile.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${planBadge.bgColor} ${planBadge.textColor}`}
                      >
                        {planBadge.text}
                      </span>

                      {userProfile.plan.toLowerCase() === "free" && (
                        <button
                          className="text-xs font-medium text-[#007991] py-1 px-2 flex items-center hover:bg-[#f0f9ff] rounded"
                          onClick={() => navigate("/dashboard/settings")}
                        >
                          Upgrade <ArrowUpRight size={12} className="ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    {userProfile.profileImage ? (
                      <img
                        src={userProfile.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#222E50] text-white flex items-center justify-center font-medium">
                        {userProfile.fullName
                          .split(" ")
                          .map((name) => name.charAt(0))
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Page heading */}
          <div className="mb-6">
            {/* <h1 className="text-2xl font-bold text-gray-800">
              {getPageTitle()}
            </h1> */}
          </div>

          {/* Page content from child routes */}
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default DashboardLayout;
