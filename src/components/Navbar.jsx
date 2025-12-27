export default function Navbar({ setUser }) {
  return (
    <div className="bg-gray-800 p-3 flex justify-between text-white">
      <span>Chat App</span>
      <button onClick={()=>{localStorage.clear();setUser(null);}}>Logout</button>
    </div>
  );
}
