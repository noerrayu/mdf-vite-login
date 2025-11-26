import React, { useState, useEffect, useCallback } from "react";
import { RemoteComponentWrapper } from "./components/RemoteComponentWrapper";
import LoginForm from "./Login";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        const res = await fetch(`${AUTH_URL}user`, {
          credentials: "include",
        });

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json();
          setUsername(data.user?.username || data.user?.name || "Guest");
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        if (mounted) {
          console.error("Login check failed:", error);
          setLoggedIn(false);
        }
      }
    };

    checkLogin();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const res = await fetch(`${AUTH_URL}user`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.user?.username || data.user?.name || "Guest");
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, []);

  if (!loggedIn) {
    return <LoginForm setLoggedIn={setLoggedIn} onLogin={handleLogin} />;
  }

  return <RemoteComponentWrapper username={username} />;
}

export default App;
