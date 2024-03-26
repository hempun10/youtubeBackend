import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Start express app
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // Enable CORS for the client app

app.use(express.json({ limit: "16kb" })); // Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Different browser send data in different ways, so we need to parse the data from the body of the request into req.body
app.use(express.static("public")); // Serving static files
app.use(cookieParser()); // for cookies CRUD operations

//Routes import
import userRouter from "./routes/user.routes.js";

//routes decleartion
app.use("/api/v1/user", userRouter);

export default app;
