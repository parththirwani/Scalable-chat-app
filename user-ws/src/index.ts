import WebSocket, { WebSocketServer } from "ws"

interface Room {
  sockets: WebSocket[]
}

const rooms: Record<string, Room> = {}

export const wss = new WebSocketServer({ port: 8080 })

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
      const room = parsedData.room
      rooms[room]?.sockets.forEach((socket) => socket.send(data.toString()))
    }
  })
})
