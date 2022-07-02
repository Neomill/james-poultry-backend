import { Router } from "express";
import menuItemController from "../controllers/MenuItemController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import MenuItemController from "../controllers/MenuItemController";
import uploadImage from "../middlewares/uploadImage";
const router = Router();

router.get("/", checkPermissions("read-menu-item"), menuItemController.getAll);
router.get(
  "/search",
  checkPermissions("read-menu-item"),
  menuItemController.search
);
router.get(
  "/:id",
  checkPermissions("read-menu-item"),
  menuItemController.getOne
);
router.post(
  "/",
  checkPermissions("create-menu-item"),
  uploadImage("menuItem"),
  body("name").isString().notEmpty(),
  body("desc").isString().notEmpty(),
  body("cost_price").isNumeric().toFloat().notEmpty(),
  body("selling_price").isNumeric().toFloat().notEmpty(),
  body("qty").isInt().toInt().notEmpty(),
  body("menu_item_category_id").isInt().toInt().optional(),
  menuItemController.create
);

router.post(
  "/bulk",
  checkPermissions("create-menu-item"),
  body("*.name").isString().notEmpty(),
  body("*.desc").isString().notEmpty(),
  body("*.qty").isInt().notEmpty().toInt(),
  body("*.cost_price").isNumeric().notEmpty().toFloat(),
  body("*.selling_price").isNumeric().notEmpty().toFloat(),
  body("*.menu_item_category_id").isInt().notEmpty().toInt(),
  menuItemController.createMany
);

router.put(
  "/upload-image/:id",
  checkPermissions("update-menu-item"),
  uploadImage("menuItem"),
  body("image"),
  menuItemController.updateImage
);
router.put(
  "/:id",
  checkPermissions("update-menu-item"),
  body("name").isString().optional(),
  body("desc").isString().optional(),
  body("cost_price").isFloat().toFloat().optional(),
  body("selling_price").isFloat().toFloat().optional(),
  body("qty").isInt().toInt().optional(),
  body("menu_item_category_id").isInt().toInt().optional(),
  menuItemController.update
);

router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-menu-item"),
  menuItemController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-menu-item"),
  menuItemController.delete
);

router.put(
  "/:id/restock",
  checkPermissions("update-menu-item"),
  body("qty").isInt().optional().toInt(),
  MenuItemController.restock
);

export default router;
