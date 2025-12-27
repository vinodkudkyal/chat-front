// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import RoomSelect from "./RoomSelect";
// import Navbar from "./Navbar";

// const socket = io("http://localhost:5000");
// const API = "http://localhost:5000";

// export default function Chat({ user, setUser }) {
//   // 🛡️ SAFE user + rooms
//   const safeRooms = Array.isArray(user?.rooms) ? user.rooms : [];

//   const [roomId, setRoomId] = useState("");
//   const [roomUsers, setRoomUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   // ✅ EFFECT 1 – join room + load data
//   useEffect(() => {
//     if (!roomId) return;

//     socket.emit("joinRoom", { username: user.username, roomId });

//     axios.get(`${API}/messages/${roomId}`).then((res) => {
//       setMessages(res.data || []);
//     });

//     axios.get(`${API}/room-users/${roomId}`).then((res) => {
//       setRoomUsers(res.data || []);
//     });
//   }, [roomId, user.username]);

//   // ✅ EFFECT 2 – socket listener
//   useEffect(() => {
//     const onGroupMessage = (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     };

//     socket.on("receiveGroupMessage", onGroupMessage);

//     return () => {
//       socket.off("receiveGroupMessage", onGroupMessage);
//     };
//   }, []);

//   const send = () => {
//     if (!text.trim() || !roomId) return;

//     socket.emit("sendGroupMessage", {
//       roomId,
//       sender: user.username,
//       text,
//     });

//     setText("");
//   };

//   // ✅ CONDITIONAL UI (AFTER HOOKS)
//   if (!roomId) {
//     return (
//       <RoomSelect
//         rooms={safeRooms}
//         setRoomId={setRoomId}
//       />
//     );
//   }

//   return (
//     <div className="h-screen flex bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 p-4">
//         <h3 className="mb-2">Room: {roomId}</h3>

//         <p className="text-sm mb-2">Users</p>
//         {roomUsers.map((u) => (
//           <div key={u.username} className="text-sm">
//             {u.username}
//           </div>
//         ))}

//         <hr className="my-3" />

//         <select
//           value={roomId}
//           onChange={(e) => {
//             setRoomId(e.target.value);
//             setMessages([]);
//           }}
//           className="p-1 text-black w-full"
//         >
//           {safeRooms.map((r) => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Chat */}
//       <div className="flex-1 flex flex-col">
//         <Navbar setUser={setUser} />

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i}>
//               <b>{m.sender}</b>: {m.text}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="flex-1 p-2 text-black"
//             placeholder="Type message"
//           />
//           <button
//             onClick={send}
//             className="bg-blue-600 px-4"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import Navbar from "./Navbar";

// const socket = io("http://localhost:5000");
// const API = "http://localhost:5000";

// export default function Chat({ user, setUser }) {
//   const rooms = Array.isArray(user.rooms) ? user.rooms : [];

//   const [roomId, setRoomId] = useState(rooms[0]); // ✅ default room
//   const [roomUsers, setRoomUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const [chatMode, setChatMode] = useState("group"); // group | private
//   const [privateUser, setPrivateUser] = useState(null);

//   /* ---------------- JOIN ROOM ---------------- */

//   useEffect(() => {
//     if (!roomId) return;

//     socket.emit("joinRoom", { roomId });

//     axios.get(`${API}/messages/${roomId}`).then(res => {
//       setMessages(res.data || []);
//     });

//     axios.get(`${API}/room-users/${roomId}`).then(res => {
//       setRoomUsers(
//         res.data.filter(u => u.username !== user.username)
//       );
//     });
//   }, [roomId, user.username]);

//   /* ---------------- SOCKET LISTENERS ---------------- */

//   useEffect(() => {
//     socket.on("receiveGroupMessage", msg => {
//       if (chatMode === "group") {
//         setMessages(prev => [...prev, msg]);
//       }
//     });

//     socket.on("receivePrivateMessage", msg => {
//       if (
//         chatMode === "private" &&
//         (msg.sender === privateUser || msg.receiver === privateUser)
//       ) {
//         setMessages(prev => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receiveGroupMessage");
//       socket.off("receivePrivateMessage");
//     };
//   }, [chatMode, privateUser]);

//   /* ---------------- SEND MESSAGE ---------------- */

//   const send = () => {
//     if (!text.trim()) return;

//     if (chatMode === "group") {
//       socket.emit("sendGroupMessage", {
//         roomId,
//         sender: user.username,
//         text,
//       });
//     } else {
//       socket.emit("sendPrivateMessage", {
//         sender: user.username,
//         receiver: privateUser,
//         text,
//       });
//     }

//     setText("");
//   };

//   /* ---------------- ROOM SWITCH WITH PASSCODE ---------------- */

//   const switchRoom = async (newRoom) => {
//     if (newRoom === roomId) return;

//     const passcode = prompt(`Enter passcode for ${newRoom}`);
//     if (!passcode) return;

//     try {
//       await axios.post(`${API}/verify-room`, {
//         roomId: newRoom,
//         passcode,
//       });

//       setMessages([]);
//       setChatMode("group");
//       setPrivateUser(null);
//       setRoomId(newRoom);
//     } catch {
//       alert("Invalid room passcode");
//     }
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="h-screen flex bg-gray-900 text-white">
//       {/* 🔹 SIDEBAR */}
//       <div className="w-64 bg-gray-800 p-4">
//         <h3 className="mb-2">Room: {roomId}</h3>

//         <button
//           className={`w-full mb-2 p-2 ${
//             chatMode === "group" ? "bg-blue-600" : "bg-gray-700"
//           }`}
//           onClick={() => {
//             setChatMode("group");
//             setPrivateUser(null);
//             setMessages([]);
//           }}
//         >
//           Group Chat
//         </button>

//         <p className="text-sm mt-3 mb-1">Users</p>
//         {roomUsers.map(u => (
//           <div
//             key={u.username}
//             className={`p-2 mb-1 cursor-pointer ${
//               privateUser === u.username ? "bg-blue-600" : "bg-gray-700"
//             }`}
//             onClick={() => {
//               setChatMode("private");
//               setPrivateUser(u.username);
//               setMessages([]);
//             }}
//           >
//             {u.username}
//           </div>
//         ))}

//         <hr className="my-3" />

//         <select
//           value={roomId}
//           onChange={e => switchRoom(e.target.value)}
//           className="p-2 text-black w-full"
//         >
//           {rooms.map(r => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 🔹 CHAT AREA */}
//       <div className="flex-1 flex flex-col">
//         <Navbar setUser={setUser} />

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i} className="mb-1">
//               <b>{m.sender}</b>: {m.text}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 flex gap-2">
//           <input
//             value={text}
//             onChange={e => setText(e.target.value)}
//             className="flex-1 p-2 text-black"
//             placeholder={
//               chatMode === "group"
//                 ? "Group message"
//                 : `Message to ${privateUser}`
//             }
//           />
//           <button onClick={send} className="bg-blue-600 px-4">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import Navbar from "./Navbar";

// const socket = io("http://localhost:5000");
// const API = "http://localhost:5000";

// export default function Chat({ user, setUser }) {
//   const rooms = user.rooms || [];
//   const [roomId, setRoomId] = useState(rooms[0]);

//   const [roomUsers, setRoomUsers] = useState([]);

//   const [groupMessages, setGroupMessages] = useState([]);
//   const [privateMessages, setPrivateMessages] = useState([]);

//   const [chatMode, setChatMode] = useState("group"); // group | private
//   const [privateUser, setPrivateUser] = useState(null);

//   const [text, setText] = useState("");

//   /* ---------- GROUP CHAT ---------- */

//   useEffect(() => {
//     if (!roomId) return;

//     socket.emit("joinRoom", { roomId });

//     axios.get(`${API}/messages/${roomId}`).then((res) => {
//       setGroupMessages(res.data);
//     });

//     axios.get(`${API}/room-users/${roomId}`).then((res) => {
//       setRoomUsers(
//         res.data.filter((u) => u.username !== user.username)
//       );
//     });
//   }, [roomId]);

//   /* ---------- PRIVATE CHAT ---------- */

//   useEffect(() => {
//     if (!privateUser) return;

//     axios
//       .get(
//         `${API}/private-messages/${user.username}/${privateUser}`
//       )
//       .then((res) => {
//         setPrivateMessages(res.data);
//       });
//   }, [privateUser]);

//   /* ---------- SOCKET LISTENERS ---------- */

//   useEffect(() => {
//     socket.on("receiveGroupMessage", (msg) => {
//       setGroupMessages((prev) => [...prev, msg]);
//     });

//     socket.on("receivePrivateMessage", (msg) => {
//       if (
//         msg.sender === privateUser ||
//         msg.receiver === privateUser
//       ) {
//         setPrivateMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receiveGroupMessage");
//       socket.off("receivePrivateMessage");
//     };
//   }, [privateUser]);

//   /* ---------- SEND MESSAGE ---------- */

//   const send = () => {
//     if (!text.trim()) return;

//     if (chatMode === "group") {
//       socket.emit("sendGroupMessage", {
//         roomId,
//         sender: user.username,
//         text,
//       });
//     } else {
//       socket.emit("sendPrivateMessage", {
//         sender: user.username,
//         receiver: privateUser,
//         text,
//       });
//     }

//     setText("");
//   };

//   /* ---------- UI ---------- */

//   const messages =
//     chatMode === "group" ? groupMessages : privateMessages;

//   return (
//     <div className="h-screen flex bg-gray-900 text-white">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 p-4">
//         <h3>Room: {roomId}</h3>

//         <button
//           className="w-full bg-blue-600 my-2 p-2"
//           onClick={() => setChatMode("group")}
//         >
//           Group Chat
//         </button>

//         <p className="text-sm mt-3">Users</p>
//         {roomUsers.map((u) => (
//           <div
//             key={u.username}
//             className="cursor-pointer p-2 bg-gray-700 mt-1"
//             onClick={() => {
//               setChatMode("private");
//               setPrivateUser(u.username);
//             }}
//           >
//             {u.username}
//           </div>
//         ))}

//         <select
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           className="mt-4 w-full text-black p-1"
//         >
//           {rooms.map((r) => (
//             <option key={r}>{r}</option>
//           ))}
//         </select>
//       </div>

//       {/* Chat */}
//       <div className="flex-1 flex flex-col">
//         <Navbar setUser={setUser} />

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i}>
//               <b>{m.sender}</b>: {m.text}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="flex-1 p-2 text-black"
//           />
//           <button onClick={send} className="bg-blue-600 px-4">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import Navbar from "./Navbar";
// import { saveUser } from "../utils/auth"; // or wherever you store helpers

// const socket = io("http://localhost:5000");
// const API = "http://localhost:5000";

// export default function Chat({ user, setUser }) {
//   const rooms = Array.isArray(user.rooms) ? user.rooms : [];


//   // ✅ default room = first assigned room
//   const [roomId, setRoomId] = useState(rooms[0]);

//   const [roomUsers, setRoomUsers] = useState([]);

//   const [groupMessages, setGroupMessages] = useState([]);
//   const [privateMessages, setPrivateMessages] = useState([]);

//   const [chatMode, setChatMode] = useState("group"); // group | private
//   const [privateUser, setPrivateUser] = useState(null);

//   const [text, setText] = useState("");

//   // 🔐 remembers verified rooms (passcode entered once)
//   const verifiedRooms = useRef(new Set([rooms[0]]));

//   /* ---------------- JOIN ROOM & LOAD GROUP DATA ---------------- */


//   // 🔄 Refresh rooms from backend
// useEffect(() => {
//   axios
//     .get(`${API}/user/${user.username}`)
//     .then((res) => {
//       // update local user object
//       const updatedUser = {
//         ...user,
//         rooms: res.data.rooms,
//       };

//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//     })
//     .catch(() => {});
// }, []);


//   useEffect(() => {
//     if (!roomId) return;

//     // join socket room
//     socket.emit("joinRoom", { roomId });

//     // clear previous room data
//     setGroupMessages([]);
//     setRoomUsers([]);
//     setChatMode("group");
//     setPrivateUser(null);

//     // fetch messages for THIS room only
//     axios.get(`${API}/messages/${roomId}`).then((res) => {
//       setGroupMessages(res.data || []);
//     });

//     // fetch users for THIS room only
//     axios.get(`${API}/room-users/${roomId}`).then((res) => {
//       setRoomUsers(
//         res.data.filter((u) => u.username !== user.username)
//       );
//     });
//   }, [roomId, user.username]);

//   /* ---------------- PRIVATE CHAT FETCH ---------------- */

//   useEffect(() => {
//     if (!privateUser) return;

//     axios
//       .get(
//         `${API}/private-messages/${user.username}/${privateUser}`
//       )
//       .then((res) => {
//         setPrivateMessages(res.data || []);
//       });
//   }, [privateUser, user.username]);

//   /* ---------------- SOCKET LISTENERS ---------------- */


  
//   useEffect(() => {
//     socket.on("receiveGroupMessage", (msg) => {
//       setGroupMessages((prev) => [...prev, msg]);
//     });

//     socket.on("receivePrivateMessage", (msg) => {
//       if (
//         msg.sender === privateUser ||
//         msg.receiver === privateUser
//       ) {
//         setPrivateMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receiveGroupMessage");
//       socket.off("receivePrivateMessage");
//     };
//   }, [privateUser]);

//   /* ---------------- SEND MESSAGE ---------------- */

//   const send = () => {
//     if (!text.trim()) return;

//     if (chatMode === "group") {
//       socket.emit("sendGroupMessage", {
//         roomId,
//         sender: user.username,
//         text,
//       });
//     } else {
//       socket.emit("sendPrivateMessage", {
//         sender: user.username,
//         receiver: privateUser,
//         text,
//       });
//     }

//     setText("");
//   };

//   /* ---------------- ROOM SWITCH WITH ONE-TIME AUTH ---------------- */

//   const switchRoom = async (newRoom) => {
//     if (newRoom === roomId) return;

//     // 🔐 ask passcode ONLY first time
//     if (!verifiedRooms.current.has(newRoom)) {
//       const passcode = prompt(`Enter passcode for ${newRoom}`);
//       if (!passcode) return;

//       try {
//         await axios.post(`${API}/verify-room`, {
//           roomId: newRoom,
//           passcode,
//         });

//         verifiedRooms.current.add(newRoom);
//       } catch {
//         alert("Invalid room passcode");
//         return;
//       }
//     }

//     setRoomId(newRoom);
//   };

//   /* ---------------- UI ---------------- */

//   const messages =
//     chatMode === "group" ? groupMessages : privateMessages;

//   return (
//     <div className="h-screen flex bg-gray-900 text-white">
//       {/* SIDEBAR */}
//       <div className="w-64 bg-gray-800 p-4">
//         <h3 className="mb-2">Room: {roomId}</h3>

//         <button
//           className={`w-full mb-2 p-2 ${
//             chatMode === "group" ? "bg-blue-600" : "bg-gray-700"
//           }`}
//           onClick={() => setChatMode("group")}
//         >
//           Group Chat
//         </button>

//         <p className="text-sm mt-3 mb-1">Users</p>
//         {roomUsers.map((u) => (
//           <div
//             key={u.username}
//             className={`cursor-pointer p-2 mb-1 ${
//               privateUser === u.username
//                 ? "bg-blue-600"
//                 : "bg-gray-700"
//             }`}
//             onClick={() => {
//               setChatMode("private");
//               setPrivateUser(u.username);
//             }}
//           >
//             {u.username}
//           </div>
//         ))}

//         <hr className="my-3" />

//         <select
//           value={roomId}
//           onChange={(e) => switchRoom(e.target.value)}
//           className="p-2 text-black w-full"
//         >
//           {rooms.map((r) => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* CHAT */}
//       <div className="flex-1 flex flex-col">
//         <Navbar setUser={setUser} />

//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i} className="mb-1">
//               <b>{m.sender}</b>: {m.text}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="flex-1 p-2 text-black"
//             placeholder={
//               chatMode === "group"
//                 ? "Group message"
//                 : `Message to ${privateUser}`
//             }
//           />
//           <button
//             onClick={send}
//             className="bg-blue-600 px-4"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "./Navbar";

// const socket = io("http://localhost:5000");
const socket = io("https://chat-back-1-s6lt.onrender.com");
// const API = "http://localhost:5000";
const API = "https://chat-back-1-s6lt.onrender.com";

export default function Chat({ user, setUser }) {
  // 🔒 SAFE ROOMS ARRAY
  const rooms = Array.isArray(user.rooms) ? user.rooms : [];

  // 🔑 current room
  const [roomId, setRoomId] = useState(rooms[0]);

  const [roomUsers, setRoomUsers] = useState([]);

  const [groupMessages, setGroupMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);

  const [chatMode, setChatMode] = useState("group"); // group | private
  const [privateUser, setPrivateUser] = useState(null);

  const [text, setText] = useState("");

  // 🔐 rooms verified with passcode (once per session)
  const verifiedRooms = useRef(new Set());

  /* ======================================================
     🔄 REFRESH USER ROOMS FROM BACKEND (CRITICAL)
  ====================================================== */
  useEffect(() => {
    axios
      .get(`${API}/user/${user.username}`)
      .then((res) => {
        const updatedUser = {
          ...user,
          rooms: res.data.rooms || [],
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch(() => {});
  }, []);

  /* ======================================================
     🔁 SYNC roomId WHEN rooms CHANGE (CORE FIX)
  ====================================================== */
  useEffect(() => {
    if (rooms.length === 0) return;

    // default to first room if current is missing/invalid
    if (!roomId || !rooms.includes(roomId)) {
      setRoomId(rooms[0]);
      verifiedRooms.current.add(rooms[0]); // default room trusted
    }
  }, [rooms]);

  /* ======================================================
     🚪 JOIN ROOM & LOAD GROUP DATA
  ====================================================== */
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", { roomId });

    // reset room-specific state
    setGroupMessages([]);
    setRoomUsers([]);
    setChatMode("group");
    setPrivateUser(null);

    // load messages for THIS room only
    axios.get(`${API}/messages/${roomId}`).then((res) => {
      setGroupMessages(res.data || []);
    });

    // load users for THIS room only
    axios.get(`${API}/room-users/${roomId}`).then((res) => {
      setRoomUsers(
        res.data.filter((u) => u.username !== user.username)
      );
    });
  }, [roomId, user.username]);

  /* ======================================================
     💬 LOAD PRIVATE CHAT
  ====================================================== */
  useEffect(() => {
    if (!privateUser) return;

    axios
      .get(
        `${API}/private-messages/${user.username}/${privateUser}`
      )
      .then((res) => {
        setPrivateMessages(res.data || []);
      });
  }, [privateUser, user.username]);

  /* ======================================================
     📡 SOCKET LISTENERS
  ====================================================== */
  useEffect(() => {
    socket.on("receiveGroupMessage", (msg) => {
      setGroupMessages((prev) => [...prev, msg]);
    });

    socket.on("receivePrivateMessage", (msg) => {
      if (
        msg.sender === privateUser ||
        msg.receiver === privateUser
      ) {
        setPrivateMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveGroupMessage");
      socket.off("receivePrivateMessage");
    };
  }, [privateUser]);

  /* ======================================================
     ✉️ SEND MESSAGE
  ====================================================== */
  const send = () => {
    if (!text.trim()) return;

    if (chatMode === "group") {
      socket.emit("sendGroupMessage", {
        roomId,
        sender: user.username,
        text,
      });
    } else {
      socket.emit("sendPrivateMessage", {
        sender: user.username,
        receiver: privateUser,
        text,
      });
    }

    setText("");
  };

  /* ======================================================
     🔐 ROOM SWITCH (PASSCODE ONCE)
  ====================================================== */
  const switchRoom = async (newRoom) => {
    if (newRoom === roomId) return;

    // ask passcode only first time
    if (!verifiedRooms.current.has(newRoom)) {
      const passcode = prompt(`Enter passcode for ${newRoom}`);
      if (!passcode) return;

      try {
        await axios.post(`${API}/verify-room`, {
          roomId: newRoom,
          passcode,
        });

        verifiedRooms.current.add(newRoom);
      } catch {
        alert("Invalid room passcode");
        return;
      }
    }

    setRoomId(newRoom);
  };

  /* ======================================================
     🖥️ UI
  ====================================================== */
  const messages =
    chatMode === "group" ? groupMessages : privateMessages;

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-gray-800 p-4">
        <h3 className="mb-2">Room: {roomId}</h3>

        <button
          className={`w-full mb-2 p-2 ${
            chatMode === "group"
              ? "bg-blue-600"
              : "bg-gray-700"
          }`}
          onClick={() => setChatMode("group")}
        >
          Group Chat
        </button>

        <p className="text-sm mt-3 mb-1">Users</p>
        {roomUsers.map((u) => (
          <div
            key={u.username}
            className={`cursor-pointer p-2 mb-1 ${
              privateUser === u.username
                ? "bg-blue-600"
                : "bg-gray-700"
            }`}
            onClick={() => {
              setChatMode("private");
              setPrivateUser(u.username);
            }}
          >
            {u.username}
          </div>
        ))}

        <hr className="my-3" />

        <select
          value={roomId}
          onChange={(e) => switchRoom(e.target.value)}
          className="p-2 text-black w-full"
        >
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <Navbar setUser={setUser} />

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="mb-1">
              <b>{m.sender}</b>: {m.text}
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 text-black"
            placeholder={
              chatMode === "group"
                ? "Group message"
                : `Message to ${privateUser}`
            }
          />
          <button
            onClick={send}
            className="bg-blue-600 px-4"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
