// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5000");

// export default function App() {
//   const [username, setUsername] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [chatUser, setChatUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   /* -------- Register User -------- */
//   const login = () => {
//     if (!username.trim()) return;
//     setCurrentUser(username);
//     socket.emit("registerUser", username);
//   };

//   /* -------- Online Users -------- */
//   useEffect(() => {
//     socket.on("onlineUsers", (users) => {
//       setUsers(users.filter((u) => u !== currentUser));
//     });

//     return () => socket.off("onlineUsers");
//   }, [currentUser]);

//   /* -------- Load Messages -------- */
//   useEffect(() => {
//     if (!currentUser || !chatUser) return;

//     axios
//       .get(`http://localhost:5000/messages/${currentUser}/${chatUser}`)
//       .then((res) => setMessages(res.data));
//   }, [chatUser]);

//   /* -------- Receive Messages -------- */
//   useEffect(() => {
//     socket.on("receiveMessage", (msg) => {
//       if (
//         msg.sender === chatUser ||
//         msg.sender === currentUser
//       ) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => socket.off("receiveMessage");
//   }, [chatUser]);

//   const sendMessage = () => {
//     if (!text.trim()) return;

//     socket.emit("sendMessage", {
//       sender: currentUser,
//       receiver: chatUser,
//       message: text,
//     });

//     setText("");
//   };

//   /* -------- Login Screen -------- */
//   if (!currentUser) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-900">
//         <div className="bg-gray-800 p-6 rounded">
//           <h1 className="text-white text-xl mb-4">Enter Username</h1>
//           <input
//             className="w-full p-2 mb-3 rounded"
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <button
//             onClick={login}
//             className="bg-blue-600 w-full py-2 text-white rounded"
//           >
//             Join Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* -------- Chat UI -------- */
//   return (
//     <div className="h-screen bg-gray-900 flex">
//       <div className="w-1/4 bg-gray-800 p-4">
//         <h2 className="text-white mb-3">Online Users</h2>
//         {users.map((u) => (
//           <div
//             key={u}
//             onClick={() => {
//               setChatUser(u);
//               setMessages([]);
//             }}
//             className="cursor-pointer p-2 bg-gray-700 mb-2 rounded text-white"
//           >
//             {u}
//           </div>
//         ))}
//       </div>

//       <div className="flex-1 flex flex-col">
//         <div className="p-4 text-white border-b border-gray-700">
//           Chat with {chatUser || "—"}
//         </div>

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div
//               key={i}
//               className={`mb-2 max-w-xs p-2 rounded ${
//                 m.sender === currentUser
//                   ? "bg-blue-600 ml-auto"
//                   : "bg-gray-700"
//               }`}
//             >
//               {m.text}
//             </div>
//           ))}
//         </div>

//         {chatUser && (
//           <div className="p-4 flex gap-2">
//             <input
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="flex-1 p-2 rounded"
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-600 px-4 rounded text-white"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import Login from "./components/Login";
// import AdminPanel from "./components/AdminPanel";
// import Chat from "./components/Chat";

// export default function App() {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     }
//   }, [user]);

//   // 🔴 ALWAYS SHOW LOGIN IF NOT LOGGED IN
//   if (!user || !user.loggedIn) {
//     return <Login setUser={setUser} />;
//   }

//   // 🟣 ADMIN AFTER LOGIN
//   if (user.role === "admin") {
//     return <AdminPanel setUser={setUser} />;
//   }

//   // 🟢 NORMAL USER
//   return <Chat user={user} setUser={setUser} />;
// }



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
