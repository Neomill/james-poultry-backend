import { Router } from "express";

import checkPermissions from "../middlewares/checkPermissions";
import OverviewController from "../controllers/OverviewController";
const router = Router();

router.get("/", checkPermissions("read-dashboard"), OverviewController.index);

export default router;
