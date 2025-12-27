// import { logoutUser } from "../utils/auth";

// export default function Navbar({ setUser }) {
//   return (
//     <div className="bg-gray-800 p-3 flex justify-between items-center">
//       <h1 className="text-white">Chat App</h1>
//       <button
//         onClick={() => {
//           logoutUser();
//           setUser(null);
//         }}
//         className="bg-red-600 px-3 py-1 rounded text-white"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }


export default function Navbar({ setUser }) {
  return (
    <div className="bg-gray-800 p-3 flex justify-between text-white">
      <span>Chat App</span>
      <button onClick={()=>{localStorage.clear();setUser(null);}}>Logout</button>
    </div>
  );
}
