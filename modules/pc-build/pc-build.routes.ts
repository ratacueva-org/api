import { Router } from "express";
import * as pcBuildController from "./pc-build.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, pcBuildController.addPcBuild);

export default router;
