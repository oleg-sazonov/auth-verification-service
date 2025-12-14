/**
 * Protect Route Middleware
 * ------------------------
 * Middleware to protect routes by verifying the JWT token from cookies.
 *
 * Function:
 *   - protectRoute:
 *       - Description: Validates the JWT token from the request cookies and attaches the user ID to the request object.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing cookies.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *           - next:
 *               - Type: Function.
 *               - Required: Yes.
 *               - Description: The next middleware function in the stack.
 *       - Workflow:
 *           1. Extracts the JWT token from the `req.cookies.jwt`.
 *           2. If no token is provided:
 *               - Returns a 401 status code with an "Unauthorized" message.
 *           3. Verifies the token using the `JWT_SECRET` environment variable.
 *           4. If the token is invalid:
 *               - Returns a 403 status code with an "Unauthorized - Invalid token" message.
 *           5. If the token is valid:
 *               - Attaches the `decoded.id` (user ID) to `req.userId`.
 *               - Calls the `next()` middleware function.
 *       - Error Handling:
 *           - Logs errors to the console if an exception occurs.
 *           - Returns a 403 status code with a "Forbidden access" message for any errors during token verification.
 *
 * Usage:
 *   - Import the `protectRoute` middleware to protect routes.
 *       import { protectRoute } from "../middleware/protectRoute.js";
 *   - Example:
 *       router.get("/protected-route", protectRoute, (req, res) => {
 *           res.json({ message: "This is a protected route" });
 *       });
 */

import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }

        // Check if token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Invalid token",
            });
        }

        req.userId = decoded.id; // attach user id for downstream handlers

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res
            .status(403)
            .json({ success: false, message: "Forbidden access" });
    }
};
