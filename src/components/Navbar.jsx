import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Left Side - Google Forms Logo and Title */}
      <div className="flex items-center gap-3">
        <img
          src="https://www.gstatic.com/images/branding/product/2x/forms_2020q4_48dp.png"
          alt="Google Forms Logo"
          className="h-10 w-10"
        />
        <span className="text-xl font-semibold text-gray-800">Forms</span>
      </div>

      

        


      {/* Right Side - Profile and Logout */}
      <div className="flex items-center gap-4">
        {user && user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-purple-500 hover:border-purple-600 transition-all cursor-pointer"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all cursor-pointer">
            <span className="text-gray-600 text-lg font-medium">?</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-red-600 active:bg-red-700 transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
