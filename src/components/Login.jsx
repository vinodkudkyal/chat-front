// import { useState } from "react";
// import axios from "axios";

// const API = "http://localhost:5000";

// export default function Login({ setUser }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async () => {
//     try {
//       // 🔑 ADMIN LOGIN
//       if (username === "vinodadmin@gmail.com") {
//         await axios.post(`${API}/admin/login`, {
//           username,
//           password,
//         });

//         setUser({
//           loggedIn: true,
//           role: "admin",
//           username,
//         });

//         return;
//       }

//       // 👤 USER LOGIN
//       const res = await axios.post(`${API}/login`, {
//         username,
//         password,
//       });

//       setUser({
//         loggedIn: true,
//         role: "user",
//         ...res.data,
//         roomId,
//       });
//     } catch {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-900">
//       <div className="bg-gray-800 p-6 rounded w-80">
//         <h2 className="text-white text-xl mb-4 text-center">Login</h2>

//         <input
//           className="w-full mb-3 p-2 rounded"
//           placeholder="Username"
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full mb-3 p-2 rounded"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {username !== "vinodadmin@gmail.com" && (
//           <input
//             className="w-full mb-3 p-2 rounded"
//             placeholder="Room ID"
//             onChange={(e) => setRoomId(e.target.value)}
//           />
//         )}

//         {error && <p className="text-red-400 text-sm">{error}</p>}

//         <button
//           onClick={handleLogin}
//           className="bg-blue-600 w-full py-2 rounded text-white"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      // 🔑 ADMIN LOGIN
      if (username === "vinodadmin@gmail.com") {
        await axios.post(`${API}/admin/login`, { username, password });

        // ✅ NO loggedIn FLAG
        setUser({
          role: "admin",
          username,
        });
        return;
      }

      // 👤 USER LOGIN
      const res = await axios.post(`${API}/login`, { username, password });

      // ✅ Store ONLY what backend returns
      setUser({
        role: "user",
        ...res.data, // username, name, rooms
      });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h2 className="text-white text-xl mb-4">Login</h2>

        <input
          className="w-full p-2 mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          onClick={login}
          className="bg-blue-600 w-full py-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
