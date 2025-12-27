// import { useState } from "react";

// export default function RoomSidebar({ roomId, setRoomId }) {
//   const [newRoom, setNewRoom] = useState("");

//   return (
//     <div className="w-60 bg-gray-800 p-4">
//       <h3 className="text-white mb-3">Rooms</h3>

//       <input
//         placeholder="Enter Room ID"
//         className="w-full p-2 mb-3 rounded"
//         onChange={(e) => setNewRoom(e.target.value)}
//       />

//       <button
//         onClick={() => setRoomId(newRoom)}
//         className="bg-green-600 w-full py-2 rounded text-white"
//       >
//         Switch Room
//       </button>

//       <p className="text-gray-400 mt-4">Current: {roomId}</p>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

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
