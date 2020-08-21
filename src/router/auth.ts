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
router.get("/verify", AuthController.verify);
router.post("/request_ver_link", AuthController.requestNewVerificationLink);
router.post("/login", AuthController.login);
router.get(
 "/getloggeduser",
 AuthMiddleware.checkToken,
 AuthMiddleware.checkIfVerified,
 AuthController.getUserWithSession
);
router.get("/users", AuthController.getAllUsers);
router.get(
 "/logout",
 AuthMiddleware.checkToken,
 AuthController.logout
);
router.patch(
 "/update",
 AuthMiddleware.checkToken,
 AuthController.updateUser
);

// Export router for use
export default router;
