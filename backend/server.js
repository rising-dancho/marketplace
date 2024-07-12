import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import logMessage from "./module/chat.module.js";
import userRoutes from "./routes/user.js";
import listingsRouter from "./routes/listings.js";
import reviewRoutes from "./routes/reviews.js";
import chatRouter from "./routes/chat.js";

dotenv.config();

// To handle this warning:
// [MONGOOSE] DeprecationWarning: Mongoose: the strictQuery option will be switched back to false by default in Mongoose 7. Use mongoose.set('strictQuery', false); if you want to prepare for this change.
mongoose.set("strictQuery", false);

// express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
});

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Authorization", "Content-Type"], // Allowed headers
    credentials: true, // Include credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  console.log(req.path, req.method, req.body);
  next();
});

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/listings", listingsRouter);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/chat", chatRouter);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join", (uid) => {
    console.log("UID:" + uid);
    socket.join(uid);
  });
  socket.on("newMsg", (msg) => {
    console.log(msg);
    io.sockets
      .in(msg.toUser)
      .in(msg.fromUser)
      .emit("pvt_msg", { message: msg.messageBody });
    logMessage(msg);
  });
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    server.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
