import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Login to Cubicle</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;