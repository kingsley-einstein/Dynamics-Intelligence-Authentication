import { Router } from "express";
import { AuthController } from "../controller";
import { AuthMiddleware } from "../middlewares";

// Router
const router = Router();

// Routes
router.post(
 "/create",
 AuthMiddleware.checkIfUserExists,
 AuthController.create
);
router.post("/login", AuthController.login);
router.get(
 "/getloggeduser",
 AuthMiddleware.checkToken,
 AuthController.getUserWithSession
);
router.get("/users", AuthController.getAllUsers);
router.get(
 "/logout",
 AuthMiddleware.checkToken,
 AuthController.logout
);

// Export router for use
export default router;
