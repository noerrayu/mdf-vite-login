import React, { useState, useRef, useEffect } from "react";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const HOST_APP_URL = import.meta.env.VITE_HOST_APP_URL;

export default function Header({ username = "Guest", app = "Remote App" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  const onSignOut = async () => {
    await fetch(`${AUTH_URL}logout`, {
      method: "POST",
      credentials: "include",
    });
    setOpen(false);
    window.location.href = HOST_APP_URL;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="p-7 bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 min-w-full rounded-2xl flex items-center justify-between">
      <h1 className="text-2xl text-white">Welcome in {app}!</h1>

      {/* Username + Icon */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          {/* Simple user icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
            />
          </svg>
          <span>{username}</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
            <button
              onClick={onSignOut}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
