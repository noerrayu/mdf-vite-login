import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

const LoginForm = ({ setLoggedIn, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${AUTH_URL}login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setLoggedIn(true);
      onLogin();
    } else {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const cr = credentialResponse.credential;
    const res = await fetch(`${AUTH_URL}google-login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: cr }),
    });

    if (res.ok) {
      setLoggedIn(true);
      onLogin();
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-linear-to-r from-gray-400 via-pink-500 to-rose-400 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl text-gray-800 font-bold mb-6 text-center">
          Welcome in Host App!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg mb-4 bg-black"
          >
            Login
          </button>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
