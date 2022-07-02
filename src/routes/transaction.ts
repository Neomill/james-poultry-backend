import { Router } from "express";
import TransactionController from "../controllers/TransactionController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/",
  checkPermissions("read-transaction"),
  TransactionController.getAll
);
router.get(
  "/search",
  checkPermissions("read-transaction"),
  TransactionController.search
);
router.get(
  "/:id",
  checkPermissions("read-transaction"),
  TransactionController.getOne
);
router.post(
  "/",
  checkPermissions("create-transaction"),
  body("transaction_code").isString().notEmpty(),
  body("invoice_id").isInt().notEmpty().toInt(),
  body("cash").isFloat().notEmpty().toFloat(),
  TransactionController.create
);

// router.delete(
//   "/bulk",
//   body("*.*").isInt().optional().toInt(),
//   checkPermissions("delete-item"),
//   TransactionController.deleteMany
// );

// router.delete(
//   "/:id",
//   checkPermissions("delete-transaction"),
//   TransactionController.delete
// );

export default router;
