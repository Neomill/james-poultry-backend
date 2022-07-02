import { Router } from "express";
import BrandsController from "../controllers/BrandsController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-brand"), BrandsController.getAll);
router.get("/search", checkPermissions("read-brand"), BrandsController.search);
router.get("/:id", checkPermissions("read-brand"), BrandsController.getOne);
router.post(
  "/",
  checkPermissions("create-brand"),
  body("name").isString().notEmpty(),
  BrandsController.create
);
router.put(
  "/:id",
  checkPermissions("update-brand"),
  body("name").isString().optional(),
  BrandsController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-brand"),
  BrandsController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-brand"),
  BrandsController.delete
);

export default router;
