import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post("/api/auth/login", userInput);
      const data = login.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("socketchat", JSON.stringify(data));
      setAuthUser(data);

      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mix-w-full mx-auto">
      <div
        className="w-full p-6 rounded-lg shadow-lg bg-gray-400/30 bg-clip-padding backdrop-filter
         backdrop-blur-lg"
      >
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login <span className="text-gray-950">Socket Chat</span>
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label className="flex justify-start p-2 font-bold text-gray-950 text-xl label-text">
              Email :
            </label>
            <input
              type="email"
              id="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="text-green-600 w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="flex justify-start p-2 font-bold text-gray-950 text-xl label-text">
              Password :
            </label>
            <input
              type="password"
              id="password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
              className="text-green-600 w-full input input-bordered h-10"
            />
          </div>
          <button className="bg-gray-950 rounded-2xl mt-4 px-2 py-1 text-white hover:bg-gray-900">
            {loading ? "Loading..." : "LogIn"}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account ?{" "}
            <Link to="/register">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Register now !
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
