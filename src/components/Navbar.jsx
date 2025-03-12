import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth"; // ✅ Add this line

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth); // ✅ Now it will work

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left Side - Google Forms Logo and Title */}
      <div className="flex items-center gap-2">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9IoYXB94gHIWE0REzxZNPPw9thxc53pTwPQ&s"
          alt="Google Forms Logo"
          className="h-8 w-8"
        />
        <span className="text-lg font-semibold text-gray-700">Forms</span>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-grow mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Right Side - Profile and Logout */}
      <div className="flex items-center gap-4">
        {user && user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="h-10 w-10 rounded-full border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">?</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
