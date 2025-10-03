import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("");
  const Navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      Navigate("/DashBoard");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={Submit}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Your Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name=""
            placeholder="Your Password"
            id=""
          />
          <button type="submit">Login</button>
          <p onClick={() => Navigate("/Register")}>Don't Have a Account</p>
        </form>
      </div>
    </>
  );
};

export default Login;
