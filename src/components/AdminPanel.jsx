// import { useState } from "react";
// import axios from "axios";
// import { logoutUser } from "../utils/auth";

// const API = "http://localhost:5000";

// export default function AdminPanel() {
//   const [form, setForm] = useState({
//     username: "",
//     name: "",
//     password: "",
//     roomId: "",
//   });

//   const createUser = async () => {
//     await axios.post(`${API}/admin/create-user`, form);
//     alert("User created successfully");
//   };

//   return (
//     <div className="h-screen bg-gray-900 flex items-center justify-center">
//       <div className="bg-gray-800 p-6 rounded w-96">
//         <h2 className="text-white text-xl mb-4">Admin Panel</h2>

//         {["username", "name", "password", "roomId"].map((field) => (
//           <input
//             key={field}
//             placeholder={field}
//             className="w-full mb-3 p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, [field]: e.target.value })
//             }
//           />
//         ))}

//         <button
//           onClick={createUser}
//           className="bg-green-600 w-full py-2 rounded text-white"
//         >
//           Create User
//         </button>

//         <button
//           onClick={() => {
//             logoutUser();
//             window.location.reload();
//           }}
//           className="bg-red-600 w-full mt-3 py-2 rounded text-white"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:5000";

// export default function AdminPanel({ setUser }) {
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({
//     username: "",
//     name: "",
//     password: "",
//     rooms: "",
//   });

//   const loadUsers = async () => {
//     const res = await axios.get(`${API}/admin/users`);
//     setUsers(res.data);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const createUser = async () => {
//     await axios.post(`${API}/admin/create-user`, {
//       ...form,
//       rooms: form.rooms.split(",").map((r) => r.trim()),
//     });

//     setForm({ username: "", name: "", password: "", rooms: "" });
//     loadUsers();
//   };

//   return (
//     <div className="h-screen bg-gray-900 p-6 text-white">
//       <h2 className="text-xl mb-4">Admin Panel</h2>

//       {["username", "name", "password", "rooms"].map((f) => (
//         <input
//           key={f}
//           value={form[f]}
//           onChange={(e) => setForm({ ...form, [f]: e.target.value })}
//           placeholder={f}
//           className="block mb-2 p-2 text-black"
//         />
//       ))}

//       <button
//         onClick={createUser}
//         className="bg-green-600 px-4 py-2 rounded"
//       >
//         Create User
//       </button>

//       <h3 className="mt-6 mb-2">Users</h3>
//       {users.map((u) => (
//         <div key={u.username}>
//           {u.username} → {u.rooms.join(", ")}
//         </div>
//       ))}

//       <button
//         onClick={() => {
//           localStorage.clear();
//           setUser(null);
//         }}
//         className="mt-6 bg-red-600 px-4 py-2 rounded"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminPanel({ setUser }) {
  const [users, setUsers] = useState([]);
  const [roomInput, setRoomInput] = useState({});

  // new user form
  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    rooms: "",
  });

  const loadUsers = async () => {
    const res = await axios.get(`${API}/admin/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    if (!form.username || !form.password) {
      alert("Username & password required");
      return;
    }

    await axios.post(`${API}/admin/create-user`, {
      username: form.username,
      name: form.name,
      password: form.password,
      rooms: form.rooms
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
    });

    setForm({ username: "", name: "", password: "", rooms: "" });
    loadUsers();
  };

  const addRoom = async (username) => {
    if (!roomInput[username]) return;

    await axios.post(`${API}/admin/add-room`, {
      username,
      roomId: roomInput[username],
    });

    setRoomInput({ ...roomInput, [username]: "" });
    loadUsers();
  };

  return (
    <div className="h-screen bg-gray-900 p-6 text-white overflow-auto">
      <h2 className="text-2xl mb-4">Admin Panel</h2>

      {/* 🔹 CREATE USER */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="mb-3 font-semibold">Create New User</h3>

        {["username", "name", "password", "rooms"].map((f) => (
          <input
            key={f}
            value={form[f]}
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
            placeholder={
              f === "rooms"
                ? "Rooms (comma separated)"
                : f
            }
            className="block w-full mb-2 p-2 text-black rounded"
          />
        ))}

        <button
          onClick={createUser}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {/* 🔹 USER LIST */}
      <h3 className="mb-3 font-semibold">Users</h3>

      {users.map((u) => (
        <div
          key={u.username}
          className="bg-gray-800 p-3 mb-3 rounded"
        >
          <p className="font-semibold">{u.username}</p>
          <p className="text-sm">
            Rooms: {Array.isArray(u.rooms) && u.rooms.length > 0 ? u.rooms.join(", ") : "None"}
          </p>

          <div className="flex gap-2 mt-2">
            <input
              placeholder="Add room"
              className="p-1 text-black rounded"
              value={roomInput[u.username] || ""}
              onChange={(e) =>
                setRoomInput({
                  ...roomInput,
                  [u.username]: e.target.value,
                })
              }
            />
            <button
              onClick={() => addRoom(u.username)}
              className="bg-blue-600 px-3 rounded"
            >
              Add
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          localStorage.clear();
          setUser(null);
        }}
        className="mt-6 bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
