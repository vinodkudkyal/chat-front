export default function RoomSelect({ rooms = [], setRoomId }) {
  // 🛡️ HARD GUARD
  if (!Array.isArray(rooms) || rooms.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        No rooms assigned. Contact admin.
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded text-white w-80">
        <h2 className="mb-4 text-lg">Select Room</h2>

        <select
          defaultValue=""
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 text-black w-full"
        >
          <option value="" disabled>
            Choose a room
          </option>

          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
