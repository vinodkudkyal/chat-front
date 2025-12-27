import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Chat from "./components/Chat";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      // 🛡️ VALIDATION (CRITICAL)
      if (!parsed.role) return null;

      // admin is valid without rooms
      if (parsed.role === "admin") return parsed;

      // user must have rooms array
      if (
        parsed.role === "user" &&
        Array.isArray(parsed.rooms)
      ) {
        return parsed;
      }

      // anything else is invalid
      return null;
    } catch {
      return null;
    }
  });

  // persist valid user only
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔴 NOT LOGGED IN → LOGIN SCREEN
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // 🟣 ADMIN
  if (user.role === "admin") {
    return <AdminPanel setUser={setUser} />;
  }

  // 🟢 USER WITHOUT ROOMS
  if (!user.rooms || user.rooms.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        No room access assigned. Contact admin.
        <button
          onClick={() => {
            localStorage.clear();
            setUser(null);
          }}
          className="ml-4 bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return <Chat user={user} setUser={setUser} />;
}
