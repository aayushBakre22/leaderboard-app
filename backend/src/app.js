import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/users", userRouter);

app.use(function (err, req, res, next) {
  console.log("Error: ", err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

export default app;
