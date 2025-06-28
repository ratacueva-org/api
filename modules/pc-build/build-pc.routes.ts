import { Router } from "express";
import * as buildPcController from "./build-pc.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, buildPcController.addBuildPc);

export default router;
