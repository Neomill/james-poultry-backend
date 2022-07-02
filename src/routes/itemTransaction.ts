import { Router } from "express";
import ItemTransactionController from "../controllers/ItemTransactionController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/search",
  checkPermissions("read-item"),
  ItemTransactionController.search
);
router.get(
  "/:id",
  checkPermissions("read-item"),
  ItemTransactionController.getOne
);

router.put(
  "/:id",
  checkPermissions("update-item"),
  body("qty").isInt().toInt().optional(),
  body("expiry_date").optional().toDate(),
  body("date_received").optional().toDate(),
  ItemTransactionController.update
);

router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-item"),
  ItemTransactionController.deleteMany
);

router.delete(
  "/:id",
  checkPermissions("delete-item"),
  ItemTransactionController.delete
);

export default router;
