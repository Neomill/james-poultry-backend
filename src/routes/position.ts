import { Router } from "express";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import PositionController from "./../controllers/PositionController";
const router = Router();

router.get("/", checkPermissions("read-position"), PositionController.getAll);
router.get(
  "/search",
  checkPermissions("read-position"),
  PositionController.search
);
router.get(
  "/:id",
  checkPermissions("read-position"),
  PositionController.getOne
);
router.post(
  "/",
  checkPermissions("create-position"),
  PositionController.createPosition
);
router.put(
  "/:id",
  checkPermissions("update-position"),
  PositionController.updatePosition
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-position"),
  PositionController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-position"),
  PositionController.delete
);

export default router;
