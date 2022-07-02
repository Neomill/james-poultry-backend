import { Router } from "express";
import { body } from "express-validator";
import PORequestController from "../controllers/PORequestController";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/",
  checkPermissions("read-po-request"),
  PORequestController.getAll
);
router.get(
  "/search",
  checkPermissions("read-po-request"),
  PORequestController.search
);
router.get(
  "/:id",
  checkPermissions("read-po-request"),
  PORequestController.getOne
);
router.post(
  "/",
  checkPermissions("create-po-request"),
  body("remarks").isString().notEmpty(),
  body("reason").isString().notEmpty(),
  // body("request_no").isString().notEmpty(),
  body("qty").notEmpty().toInt().isInt(),
  body("item_transaction_id").isInt().notEmpty().toInt(),
  body("storage_location_id").isInt().notEmpty().toInt(),
  PORequestController.create
);

router.post(
  "/bulk",
  checkPermissions("create-item"),
  // body("*.request_no").isString().notEmpty(),
  body("*.remarks").isString().notEmpty(),
  body("*.reason").isString().notEmpty(),
  body("*.qty").isInt().notEmpty().toInt(),
  // body("*.item.*.value").isInt().notEmpty().toInt(),
  PORequestController.createMany
);
router.put(
  "/:id",
  checkPermissions("update-po-request"),
  body("remarks").isString().optional(),
  body("reason").isString().optional(),
  body("request_no").isString().optional(),
  body("qty").optional().toInt().isInt(),
  body("item_transaction_id").isInt().optional().toInt(),
  body("storage_location_id").isInt().optional().toInt(),
  PORequestController.update
);

// router.delete(
//   "/bulk",
//   body("*.*").isInt().optional().toInt(),
//   checkPermissions("delete-po-request"),
//   PORequestController.deleteMany
// );

// router.delete(
//   "/:id",
//   checkPermissions("delete-po-request"),
//   PORequestController.delete
// );

export default router;
