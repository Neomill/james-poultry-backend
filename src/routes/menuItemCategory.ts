import { Router } from "express";
import MenuItemCategoryController from "../controllers/MenuItemCategoryController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-menu-item-category"), MenuItemCategoryController.getAll);
router.get("/search", checkPermissions("read-menu-item-category"), MenuItemCategoryController.search);
router.get("/:id", checkPermissions("read-menu-item-category"), MenuItemCategoryController.getOne);
router.post(
  "/",
  checkPermissions("create-menu-item-category"),
  body("name").isString().notEmpty(),
  MenuItemCategoryController.create
);
router.put(
  "/:id",
  checkPermissions("update-menu-item-category"),
  body("name").isString().optional(),
  MenuItemCategoryController.update
);
router.delete(
  "/:id",
  checkPermissions("delete-menu-item-category"),
  MenuItemCategoryController.delete
);

export default router;
