import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { initDB } from "./utils/db.js";
import { connectRabbitMQ } from "./utils/connectServices.js";
import cors from "cors";
import router from "./routes/api.js";

dotenv.config({ override: true });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

async function startServer() {
    try {
        // Initialize database
        await initDB();
        
        // Connect to RabbitMQ
        const connection = await connectRabbitMQ();
        const channel = await connection.createChannel();
        
        // Setup routes with RabbitMQ channel
        app.use("/api", (req, res, next) => {
            req.channel = channel;
            next();
        }, router);

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
