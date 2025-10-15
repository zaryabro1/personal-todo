import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

app.get("/health", (req, res) => {
  res.send("Server is up and running!!");
});

dbConnection(process.env.MONGODB_URL);

// mongoose.connect(process.env.MONGODB_URL).then(() => {
//   console.log("Connected to MongoDB");
// }).catch((err) => {
//   console.log(err);
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});