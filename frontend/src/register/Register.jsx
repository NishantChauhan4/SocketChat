import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(inputData);

  const selectGender = (selectedGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectedGender === inputData.gender ? "" : selectedGender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (inputData.password !== inputData.confpassword) {
        setLoading(false);
        return toast.error("Passwords do not match");
      }
      const register = await axios.post("/api/auth/register", inputData);
      const data = register.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("socketchat", JSON.stringify(data));
      setAuthUser(data);

      setLoading(false);
      navigate("/login");
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
        style={{
          backgroundColor: "rgba(156, 163, 175, 0.3)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Register <span className="text-gray-950">Socket Chat</span>
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label className="flex justify-start p-2 font-bold text-gray-950 text-xl label-text">
              Fullname :
            </label>
            <input
              type="text"
              id="fullname"
              onChange={handleInput}
              placeholder="Enter your fullname"
              required
              className="text-green-600 w-full input input-bordered h-10"
            />
          </div>

          <div>
            <label className="flex justify-start p-2 font-bold text-gray-950 text-xl label-text">
              Username :
            </label>
            <input
              type="text"
              id="username"
              onChange={handleInput}
              placeholder="Enter your username"
              required
              className="text-green-600 w-full input input-bordered h-10"
            />
          </div>

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

          <div>
            <label className="flex justify-start p-2 font-bold text-gray-950 text-xl label-text">
              Confirm password :
            </label>
            <input
              type="password"
              id="confpassword"
              onChange={handleInput}
              placeholder="Confirm your password"
              required
              className="text-green-600 w-full input input-bordered h-10"
            />
          </div>

          <div id="gender" className="flex mt-3">
            <label className="cursor-pointer label flex gap-2 mr-4">
              <span className="label-text font-semibold text-gray-950">
                Male
              </span>
              <input
                onChange={() => selectGender("male")}
                checked={inputData.gender === "male"}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>

            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">
                Female
              </span>
              <input
                onChange={() => selectGender("female")}
                checked={inputData.gender === "female"}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>
          </div>

          <button className="bg-gray-950 rounded-2xl mt-4 px-2 py-1 text-white hover:bg-gray-900">
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Do have an account ?{" "}
            <Link to="/login">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Login now !
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
