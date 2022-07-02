import { Router } from "express";
import storageLocationController from "../controllers/StorageLocationController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/",
  checkPermissions("read-storage-location"),
  storageLocationController.getAll
);
router.get(
  "/search",
  checkPermissions("read-storage-location"),
  storageLocationController.search
);
router.get(
  "/:id",
  checkPermissions("read-storage-location"),
  storageLocationController.getOne
);
router.post(
  "/",
  checkPermissions("create-storage-location"),
  body("name").isString().notEmpty(),
  body("address").isString().notEmpty(),
  storageLocationController.create
);
router.put(
  "/:id",
  checkPermissions("update-storage-location"),
  body("name").isString().optional(),
  body("address").isString().optional(),
  storageLocationController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-storage-location"),
  storageLocationController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-storage-location"),
  storageLocationController.delete
);

export default router;
