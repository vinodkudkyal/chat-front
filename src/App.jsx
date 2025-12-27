import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Fetch conversation
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    axios
      .get(`http://localhost:5000/messages/${currentUser}/${otherUser}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, [currentUser, otherUser]);

  // Socket listener
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === currentUser && otherUser) ||
        (msg.sender === otherUser && currentUser)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [currentUser, otherUser]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: otherUser,
      message: text,
    });

    setText("");
  };

  // 🔵 Role Selection Screen
  if (!currentUser) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-white text-xl font-semibold mb-6">
            Select User Role
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setCurrentUser("UserA");
                setOtherUser("UserB");
              }}
              className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700"
            >
              User A
            </button>

            <button
              onClick={() => {
                setCurrentUser("UserB");
                setOtherUser("UserA");
              }}
              className="bg-green-600 px-6 py-2 rounded text-white hover:bg-green-700"
            >
              User B
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 Chat UI
  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-700 text-white text-lg font-semibold">
          Chat – {currentUser}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs p-2 rounded-lg text-sm ${
                msg.sender === currentUser
                  ? "bg-blue-600 ml-auto text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
