import { Router } from "express";
import MenuItemStockController from "../controllers/MenuItemStockController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/search",
  checkPermissions("read-menu-item-stock"),
  MenuItemStockController.search
);
router.get(
  "/:id",
  checkPermissions("read-menu-item-stock"),
  MenuItemStockController.getOne
);

router.put(
  "/:id",
  checkPermissions("update-menu-item-stock"),
  body("qty").isInt().toInt().optional(),
  body("expiry_date").optional().toDate(),
  body("date_received").optional().toDate(),
  MenuItemStockController.update
);

router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-menu-item-stock"),
  MenuItemStockController.deleteMany
);

router.delete(
  "/:id",
  checkPermissions("delete-menu-item-stock"),
  MenuItemStockController.delete
);

export default router;
