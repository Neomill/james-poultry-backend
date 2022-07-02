import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-category"), CategoryController.getAll);
router.get(
  "/search",
  checkPermissions("read-category"),
  CategoryController.search
);
router.get(
  "/:id",
  checkPermissions("read-category"),
  CategoryController.getOne
);
router.post(
  "/",
  checkPermissions("create-category"),
  body("name").isString().notEmpty(),
  CategoryController.create
);
router.put(
  "/:id",
  checkPermissions("update-category"),
  body("name").isString().optional(),
  CategoryController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-category"),
  CategoryController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-category"),
  CategoryController.delete
);

export default router;
