import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import RoomSelect from "./RoomSelect";
import Navbar from "./Navbar";

const socket = io("http://localhost:5000");
const API = "http://localhost:5000";

export default function Chat({ user, setUser }) {
  // 🛡️ SAFE user + rooms
  const safeRooms = Array.isArray(user?.rooms) ? user.rooms : [];

  const [roomId, setRoomId] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ EFFECT 1 – join room + load data
  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", { username: user.username, roomId });

    axios.get(`${API}/messages/${roomId}`).then((res) => {
      setMessages(res.data || []);
    });

    axios.get(`${API}/room-users/${roomId}`).then((res) => {
      setRoomUsers(res.data || []);
    });
  }, [roomId, user.username]);

  // ✅ EFFECT 2 – socket listener
  useEffect(() => {
    const onGroupMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveGroupMessage", onGroupMessage);

    return () => {
      socket.off("receiveGroupMessage", onGroupMessage);
    };
  }, []);

  const send = () => {
    if (!text.trim() || !roomId) return;

    socket.emit("sendGroupMessage", {
      roomId,
      sender: user.username,
      text,
    });

    setText("");
  };

  // ✅ CONDITIONAL UI (AFTER HOOKS)
  if (!roomId) {
    return (
      <RoomSelect
        rooms={safeRooms}
        setRoomId={setRoomId}
      />
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <h3 className="mb-2">Room: {roomId}</h3>

        <p className="text-sm mb-2">Users</p>
        {roomUsers.map((u) => (
          <div key={u.username} className="text-sm">
            {u.username}
          </div>
        ))}

        <hr className="my-3" />

        <select
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
            setMessages([]);
          }}
          className="p-1 text-black w-full"
        >
          {safeRooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <Navbar setUser={setUser} />

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i}>
              <b>{m.sender}</b>: {m.text}
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 text-black"
            placeholder="Type message"
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
