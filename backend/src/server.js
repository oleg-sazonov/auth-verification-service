import express from "express";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./config/db/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
