import { Link } from 'react-router-dom';

function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Sign Up for Cubicle</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="Create a password" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select className="w-full p-2 border rounded">
              <option value="designer">Graphic Designer</option>
              <option value="developer">Software Developer</option>
              <option value="editor">Video Editor</option>
              <option value="writer">Writer</option>
              <option value="producer">Music Producer</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Sign Up</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/terms" className="text-green-600 hover:underline">Terms & Conditions</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;