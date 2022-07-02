import { Router } from "express";
import InvoiceController from "../controllers/InvoiceController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-order"), InvoiceController.getAll);
router.get("/search", checkPermissions("read-order"), InvoiceController.search);
router.get("/:id", checkPermissions("read-order"), InvoiceController.getOne);
router.post(
  "/",
  checkPermissions("create-order"),
  body("fname").isString().optional(),
  body("lname").isString().optional(),
  body("mname").isString().optional(),
  body("phone").isString().optional(),
  body("address").isString().optional(),
  body("table_id").isInt().notEmpty().toInt(),
  body("*.orders.*.qty").isInt().notEmpty().toInt(),
  body("*.orders.*.menu_item_id").isInt().notEmpty().toInt(),
  InvoiceController.create
);
router.put(
  "/:id",
  checkPermissions("update-order"),
  body("status").isIn(["IN_PROGRESS", "READY", "VOID"]).optional(),
  body("payment_status").isIn(["PENDING", "PAID"]).optional(),
  InvoiceController.update
);
router.delete(
  "/:id",
  checkPermissions("delete-order"),
  InvoiceController.delete
);

export default router;
