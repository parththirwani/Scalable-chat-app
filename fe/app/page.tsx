"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      console.log("Connection established");
      setSocket(newSocket);
    };

    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
      setLatestMessage(message.data);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      console.log("Closing WebSocket connection...");
      newSocket.close();
    };
  }, []);

  const handleSend = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setInput(""); // clear after sending
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">WebSocket Client</h1>
      <p>Latest message: {latestMessage || "No messages yet"}</p>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // controlled input
          onKeyDown={(e) => e.key === "Enter" && handleSend()} // send on Enter
          className="border rounded p-2 flex-1"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
