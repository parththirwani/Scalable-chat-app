import WebSocket, { WebSocketServer } from "ws"

export const wss = new WebSocketServer({ port: 3001 })

const servers: WebSocket[] = []

wss.on("connection", (ws) => {
  console.log("New server connected to relayer")
  servers.push(ws)

  ws.on("error", console.error)

  ws.on("close", () => {
    console.log("Server disconnected from relayer")
    const index = servers.indexOf(ws)
    if (index !== -1) servers.splice(index, 1)
  })

  ws.on("message", (data) => {
    console.log("Relayer broadcasting:", data.toString())
    servers.forEach((socket) => {
      if (socket !== ws && socket.readyState === WebSocket.OPEN) {
        socket.send(data.toString())
      }
    })
  })
})
