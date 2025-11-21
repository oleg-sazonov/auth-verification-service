import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
    res.send("Hello!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
