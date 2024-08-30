import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

app.use(cors());
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Middleware to set cache control headers for static assets
app.use((req, res, next) => { 
  res.setHeader('Cache-Control', 'no-store, must-revalidate'); 
  next(); 
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);




// To serve react static files (Frontend)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "./client/dist")));
app.use(express.static(path.join(__dirname, "./")));

// Serve the React app for all other routes
app.get('*', function (_, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
