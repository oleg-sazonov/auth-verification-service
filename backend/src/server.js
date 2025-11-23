import "./config/envs/env.config.js";
import express from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./config/db/db.config.js";
import authRoutes from "./routes/auth.routes.js";

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
