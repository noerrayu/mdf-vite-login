import React, { useState, useEffect } from "react";
import Header from "./components/Header";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const HOST_APP_URL = import.meta.env.VITE_HOST_APP_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${AUTH_URL}user`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.user?.username || data.user?.name || "Guest");
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Login check failed:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Wait until we know login status
  if (loading)
    return (
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-pink-500"></div>
    );

  // Redirect only AFTER loading is complete
  if (!loggedIn) {
    window.location.href = HOST_APP_URL;
    return null;
  }

  return (
    <>
      <Header username={username} />
    </>
  );
}

export default App;
