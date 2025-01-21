import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDb from "./db/index.js";
import { initSocket } from "./socket.js";

connectDb()
  .then(() => {
    const server = http.createServer(app);
    initSocket(server);
    app.on("error", (error) => {
      console.log("App error: ", error);
      throw error;
    });
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed! ", error);
  });
