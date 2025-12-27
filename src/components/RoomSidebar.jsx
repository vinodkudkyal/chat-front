import { useEffect, useState } from "react";
import axios from "axios";

// const API = "http://localhost:5000";
const API = "https://chat-back-1-s6lt.onrender.com";

export default function RoomSidebar({ roomId, currentUser, setChatTarget }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API}/room-users/${roomId}`).then(res=>{
      setUsers(res.data.filter(u=>u.username!==currentUser));
    });
  }, [roomId]);

  return (
    <div className="w-64 bg-gray-800 p-4 text-white">
      <button onClick={()=>setChatTarget({type:"group"})}>Group Chat</button>
      {users.map(u=>(
        <div key={u.username} onClick={()=>setChatTarget({type:"private",user:u.username})}>
          {u.username}
        </div>
      ))}
    </div>
  );
}
