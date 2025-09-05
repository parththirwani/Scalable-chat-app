import { test, describe, expect } from "vitest"
import WebSocket from "ws"

const BACKEND_URL1 = "ws://localhost:8080"
const BACKEND_URL2 = "ws://localhost:8081"

describe("Chat Application", () => {
    test("Message sent from room 1 reaches another participant in room 1", async () => {
        const ws1 = new WebSocket(BACKEND_URL1)
        const ws2 = new WebSocket(BACKEND_URL2)

        // Wait for both sockets to open
        await Promise.all([
            new Promise<void>(resolve => ws1.onopen = () => resolve()),
            new Promise<void>(resolve => ws2.onopen = () => resolve())
        ])



        // Both join the same room
        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))
        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))


        // message listener before sending
        const messagePromise = new Promise<void>((resolve) => {
            ws2.onmessage = ({ data }) => {
                const parsedData = JSON.parse(data.toString())
                expect(parsedData.type).toBe("chat")
                expect(parsedData.message).toBe("hi there")
                resolve()
            }
        })

                        console.log('control')
        // Send chat message
        ws1.send(JSON.stringify({
            type: "chat",
            message: "hi there",
            room: "Room 1"
        }))

        await messagePromise

        ws1.close()
        ws2.close()
    })
})
