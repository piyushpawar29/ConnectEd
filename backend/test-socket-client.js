// test-socket-client.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:5001"); // Change port if needed

socket.on("connect", () => {
  console.log("Connected to Socket.io server!");
  // Test joining a room
  socket.emit("join", "test-room");
  // Test sending a message
  socket.emit("sendMessage", { conversationId: "test-room", text: "Hello from client!" });
});

socket.on("message", (msg) => {
  console.log("Received message:", msg);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});