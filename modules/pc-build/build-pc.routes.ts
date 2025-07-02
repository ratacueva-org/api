import { Router } from "express";
import * as buildPcController from "./build-pc.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("client"),
  buildPcController.addBuildPc
);

export default router;
