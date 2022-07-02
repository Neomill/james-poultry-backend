import { Router } from "express";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import PullOutController from "./../controllers/PullOutController";
const router = Router();

router.get("/", checkPermissions("read-pull-out"), PullOutController.getAll);
router.get(
  "/search",
  checkPermissions("read-pull-out"),
  PullOutController.search
);
router.get(
  "/:id",
  checkPermissions("read-pull-out"),
  PullOutController.getOne
);
router.post(
  "/",
  checkPermissions("create-pull-out"),
  PullOutController.create
);
router.put(
  "/:id",
  checkPermissions("update-pull-out"),
  PullOutController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-pull-out"),
  PullOutController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-pull-out"),
  PullOutController.delete
);

export default router;
