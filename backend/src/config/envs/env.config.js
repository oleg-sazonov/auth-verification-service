/**
 * Environment Configuration
 * -------------------------
 * Loads environment variables from a `.env` file located in the root directory of the project.
 *
 * Description:
 *   - This module uses the `dotenv` package to load environment variables into `process.env`.
 *   - It resolves the path to the `.env` file dynamically to ensure compatibility across different environments.
 *
 * Workflow:
 *   1. Resolves the current file's directory using `fileURLToPath` and `path.dirname`.
 *   2. Constructs the absolute path to the `.env` file located in the root directory.
 *   3. Loads the environment variables using `dotenv.config`.
 *
 * Error Handling:
 *   - If the `.env` file is missing or contains invalid entries, the application may fail to start.
 *
 * Usage:
 *   - Import this module at the entry point of the application to ensure all environment variables are loaded.
 *       import "./config/envs/env.config.js";
 *
 * Example:
 *   - Define environment variables in the `.env` file:
 *       MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
 *       JWT_SECRET=your_jwt_secret
 *       MAILTRAP_API_TOKEN=your_mailtrap_api_token
 *
 *   - Access the variables in your code:
 *       const mongoURI = process.env.MONGODB_URI;
 *       const jwtSecret = process.env.JWT_SECRET;
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
});
