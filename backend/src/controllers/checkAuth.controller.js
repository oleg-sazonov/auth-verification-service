/**
 * Check Auth Controller
 * ---------------------
 * Handles the retrieval of authenticated user details.
 *
 * Functions:
 *   - checkAuth:
 *       - Description: Retrieves the authenticated user's details based on the user ID attached to the request object.
 *       - Parameters:
 *           - req:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express request object containing the `userId` property set by the `protectRoute` middleware.
 *           - res:
 *               - Type: Object.
 *               - Required: Yes.
 *               - Description: The Express response object used to send responses to the client.
 *       - Workflow:
 *           1. Extracts the `userId` from the request object.
 *           2. Queries the database for the user with the given ID, excluding the password field.
 *           3. If the user is found:
 *               - Sends a 200 status code with the user details.
 *           4. If the user is not found:
 *               - Sends a 404 status code with an appropriate error message.
 *       - Error Handling:
 *           - Logs errors to the console if an exception occurs.
 *           - Sends a 500 status code with a generic error message for server errors.
 *
 * Usage:
 *   - Import the `checkAuth` function to use it in authentication routes.
 *       import { checkAuth } from "../controllers/checkAuth.controller.js";
 *   - Example:
 *       router.get("/check-auth", protectRoute, checkAuth);
 */

import User from "../models/user.model.js";

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in checkAuth controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
