import WebSocket, { WebSocketServer } from "ws"

interface Room {
  sockets: WebSocket[]
}

const rooms: Record<string, Room> = {}

const RELAYER_URL = "ws://localhost:3001"
const relayerSocket = new WebSocket(RELAYER_URL)

export const wss = new WebSocketServer({ port: 8081 })

// Handle messages coming from the relayer
relayerSocket.onmessage = ({ data }) => {
  const parsedData = JSON.parse(data.toString())
  if (parsedData.type === "chat") {
    const room = parsedData.room
    rooms[room]?.sockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data.toString())
      }
    })
  }
}

relayerSocket.onerror = (err) => {
  console.error("Relayer connection error:", err)
}


// Handle messages from clients
wss.on("connection", (ws) => {
  ws.on("error", console.error)


  ws.on("message", (data) => {
    const parsedData = JSON.parse(data.toString())

    if (parsedData.type === "join-room") {
      const room = parsedData.room
      if (!rooms[room]) {
        rooms[room] = { sockets: [] }
      }
      rooms[room].sockets.push(ws)
    }

    if (parsedData.type === "chat") {
      console.log("Forwarding chat:", parsedData)
      relayerSocket.send(JSON.stringify(parsedData))
    }

  })
})
