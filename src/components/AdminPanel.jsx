import { useEffect, useState } from "react";
import axios from "axios";

// const API = "http://localhost:5000";
const API = "https://chat-back-1-s6lt.onrender.com";

export default function AdminPanel({ setUser }) {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // create user form
  const [userForm, setUserForm] = useState({
    username: "",
    name: "",
    password: "",
  });

  // create room form
  const [roomForm, setRoomForm] = useState({
    roomId: "",
    passcode: "",
  });

  // assign room
  const [assign, setAssign] = useState({
    username: "",
    roomId: "",
  });

  /* ---------------- LOAD DATA ---------------- */

  const loadUsers = async () => {
    const res = await axios.get(`${API}/admin/users`);
    setUsers(res.data);
  };

  const loadRooms = async () => {
    const res = await axios.get(`${API}/admin/rooms`);
    setRooms(res.data);
  };

  useEffect(() => {
    loadUsers();
    loadRooms();
  }, []);

  /* ---------------- CREATE USER ---------------- */

  const createUser = async () => {
    if (!userForm.username || !userForm.password) {
      alert("Username & password required");
      return;
    }

    await axios.post(`${API}/admin/create-user`, userForm);
    setUserForm({ username: "", name: "", password: "" });
    loadUsers();
  };

  /* ---------------- CREATE ROOM ---------------- */

  const createRoom = async () => {
    if (!roomForm.roomId || !roomForm.passcode) {
      alert("Room ID & passcode required");
      return;
    }

    await axios.post(`${API}/admin/create-room`, roomForm);
    setRoomForm({ roomId: "", passcode: "" });
    loadRooms();
  };

  /* ---------------- ASSIGN ROOM ---------------- */

  const assignRoom = async () => {
    if (!assign.username || !assign.roomId) {
      alert("Select user & room");
      return;
    }

    await axios.post(`${API}/admin/assign-room`, assign);
    setAssign({ username: "", roomId: "" });
    loadUsers();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen bg-gray-900 text-white p-6 overflow-auto">
      <h2 className="text-2xl mb-6">Admin Panel</h2>

      {/* 🔹 CREATE USER */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="mb-3 font-semibold">Create User</h3>

        {["username", "name", "password"].map((f) => (
          <input
            key={f}
            value={userForm[f]}
            onChange={(e) =>
              setUserForm({ ...userForm, [f]: e.target.value })
            }
            placeholder={f}
            type={f === "password" ? "password" : "text"}
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

      {/* 🔹 CREATE ROOM */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="mb-3 font-semibold">Create Room</h3>

        <input
          value={roomForm.roomId}
          onChange={(e) =>
            setRoomForm({ ...roomForm, roomId: e.target.value })
          }
          placeholder="Room ID"
          className="block w-full mb-2 p-2 text-black rounded"
        />

        <input
          value={roomForm.passcode}
          onChange={(e) =>
            setRoomForm({ ...roomForm, passcode: e.target.value })
          }
          placeholder="Room Passcode"
          className="block w-full mb-2 p-2 text-black rounded"
        />

        <button
          onClick={createRoom}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Create Room
        </button>
      </div>

      {/* 🔹 ASSIGN ROOM */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="mb-3 font-semibold">Assign Room to User</h3>

        <select
          value={assign.username}
          onChange={(e) =>
            setAssign({ ...assign, username: e.target.value })
          }
          className="block w-full mb-2 p-2 text-black rounded"
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.username} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          value={assign.roomId}
          onChange={(e) =>
            setAssign({ ...assign, roomId: e.target.value })
          }
          className="block w-full mb-2 p-2 text-black rounded"
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.roomId} value={r.roomId}>
              {r.roomId}
            </option>
          ))}
        </select>

        <button
          onClick={assignRoom}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Assign Room
        </button>
      </div>

      {/* 🔹 USERS LIST */}
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="mb-3 font-semibold">Users</h3>

        {users.map((u) => (
          <div key={u.username} className="mb-2">
            <b>{u.username}</b> →{" "}
            {u.rooms.length > 0 ? u.rooms.join(", ") : "No rooms"}
          </div>
        ))}
      </div>

      {/* 🔹 LOGOUT */}
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
