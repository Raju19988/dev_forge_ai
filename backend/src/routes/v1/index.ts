import { Router } from "express";
import healthRoutes from "../health.routes";
import usersRoutes from "../users.routes";
import authRoutes from "../auth.routes";
import profileRoutes from "../profile.routes";

const router = Router();

router.use(healthRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

export default router;