import { FaCreditCard, FaTasks, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in">
              Launch Your Freelance Journey with Cubicle
            </h1>
            <p className="text-xl md:text-2xl mb-6 animate-fade-in-delay">
              Manage clients, projects, and payments in a cosmic workflow.
            </p>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold animate-pulse shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Cosmic Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition transform hover:scale-105 cursor-pointer shadow-md">
              <FaUsers className="text-4xl text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client Management</h3>
              <p className="text-gray-300">
                Track and organize clients with stellar precision.
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition transform hover:scale-105 cursor-pointer shadow-md">
              <FaTasks className="text-4xl text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
              <p className="text-gray-300">
                Monitor projects with a galactic Kanban board.
              </p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition transform hover:scale-105 cursor-pointer shadow-md">
              <FaCreditCard className="text-4xl text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Payment Integration
              </h3>
              <p className="text-gray-300">
                Secure payments across the universe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Orbit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-2xl mb-4">$0/month</p>
              <ul className="text-gray-300 mb-4">
                <li>5 Clients</li>
                <li>Basic Project Tools</li>
                <li>Email Support</li>
              </ul>
              <Link
                to="/signup"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
              >
                Start Free
              </Link>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-2xl mb-4">$10/month</p>
              <ul className="text-gray-300 mb-4">
                <li>20 Clients</li>
                <li>Advanced Tracking</li>
                <li>Priority Support</li>
              </ul>
              <Link
                to="/signup"
                className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
              >
                Get Pro
              </Link>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-2xl mb-4">$25/month</p>
              <ul className="text-gray-300 mb-4">
                <li>Unlimited Clients</li>
                <li>Custom Features</li>
                <li>24/7 Support</li>
              </ul>
              <Link
                to="/signup"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-center"
              >
                Go Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Start Free Trial Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Take Off?
        </h2>
        <p className="text-lg mb-4">
          Join thousands of freelancers exploring the cosmos with Cubicle.
        </p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 shadow-md"
        >
          Start Free Trial Now
        </Link>
      </section>
    </div>
  );
}

// Simple CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInDelay {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in;
  }
  .animate-fade-in-delay {
    animation: fadeInDelay 1s ease-in 0.5s backwards;
  }
`;

// Inject styles into document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default LandingPage;
