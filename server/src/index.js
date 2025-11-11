import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }
  if (req.headers['x-user-id']) {
    console.log('  User ID:', req.headers['x-user-id']);
  }
  
  // Log response status
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`  → ${res.statusCode} ${req.method} ${req.path}`);
    return originalSend.call(this, data);
  };
  
  next();
});

app.use("/api/v1", routes);

app.get("/health", (req, res) => {
  res.send("Server is up and running!!");
});

dbConnection(process.env.MONGODB_URL);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});