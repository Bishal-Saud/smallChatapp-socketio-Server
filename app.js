import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
const port = 3000;
const secretJWTkey = "safsfadewisk";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// const user = false;
// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);
//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));
//     const decode = jwt.verify(token, secretJWTkey);
//     next();
//   });
// }); // Middleware

app.get("/", (req, res) => {
  res.send("Hello world");
});

// app.get("/login", (req, res) => {
//   const token = jwt.sign({ _id: "sssdfwwewjjss" }, secretJWTkey);
//   res
//     .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
//     .json({
//       message: "User Login successfully",
//     });
// });

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //   socket.emit("welcome", `Welcome to the server`);
  //   socket.broadcast.emit("welcome", `${socket.id} Joined the server`);\

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    // socket.broadcast.emit("receive-msg", message);
    io.to(room).emit("receive-msg", message);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("User Joined", room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log(`server is running port ${port}`);
});
