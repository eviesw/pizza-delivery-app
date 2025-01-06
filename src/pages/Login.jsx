import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import OrderHistory from "../components/OrderHistory";
import { useNavigate } from "react-router-dom";
import Favorites from "../components/Favorites";

export default function Login() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, login, register, logout } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(() => {
    // Check if we have a register parameter in the URL
    const params = new URLSearchParams(window.location.search);
    return !params.get("register"); // If register=true, set isLogin to false
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match!");
          return;
        }
        if (formData.password.length < 6) {
          setError("Password should be at least 6 characters");
          return;
        }
        await register(formData.email, formData.password, formData.name);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If user is logged in, show their profile
  if (user) {
    return (
      <div className="mt-[150px] max-w-[1400px] mx-auto p-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-semibold pr-2">
            Welcome, {user.displayName || user.email}!
          </h2>
          <button
            onClick={logout}
            className="bg-[#ff6347] text-white px-4 py-2 rounded hover:bg-[#ff4f2b]"
          >
            Logout
          </button>
        </div>
        <div className="mb-16">
          <Favorites />
        </div>
        <OrderHistory />
      </div>
    );
  }

  return (
    <div className="mt-[150px] max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required={!isLogin}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
