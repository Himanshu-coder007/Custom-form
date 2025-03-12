import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import authImage from "../assets/login.jpg";
import { auth, signInWithGoogle, signUpWithEmail, signInWithEmail } from "../firebase";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Added username field
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle Sign In / Sign Up

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  // Email/Password Authentication Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, username); // Pass username for signup
      } else {
        await signInWithEmail(email, password);
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex w-11/12 md:w-3/4 lg:max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="w-1/2 relative">
          <img
            src={authImage}
            alt="Authentication"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">or</p>
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 px-4 w-full rounded-lg shadow-sm hover:shadow-md transition duration-300"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </button>
            <p className="mt-4 text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;