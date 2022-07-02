import { Router } from "express";
import ItemController from "../controllers/ItemController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-item"), ItemController.getAll);
router.get("/search", checkPermissions("read-item"), ItemController.search);
router.get("/:id", checkPermissions("read-item"), ItemController.getOne);
router.post(
  "/",
  checkPermissions("create-item"),
  body("name").isString().notEmpty(),
  body("qty").isInt().notEmpty().toInt(),
  body("stock_alert_ctr").isInt().notEmpty().toInt(),
  body("cost_price").isNumeric().notEmpty().toFloat(),
  body("selling_price").isNumeric().notEmpty().toFloat(),
  body("date_received").notEmpty().toDate(),
  body("expiry_date").notEmpty().toDate(),
  body("company_id").isInt().notEmpty().toInt(),
  body("storage_location_id").isInt().notEmpty().toInt(),
  body("brand_id").isInt().notEmpty().toInt(),
  body("category_id").isInt().notEmpty().toInt(),
  body("status").isEmpty(),
  ItemController.create
);

router.post(
  "/bulk",
  checkPermissions("create-item"),
  body("*.name").isString().notEmpty(),
  body("*.qty").isInt().notEmpty().toInt(),
  body("*.stock_alert_ctr").isInt().notEmpty().toInt(),
  body("*.cost_price").isNumeric().notEmpty().toFloat(),
  body("*.selling_price").isNumeric().notEmpty().toFloat(),
  body("*.date_received").notEmpty().toDate(),
  body("*.expiry_date").notEmpty().toDate(),
  body("*.company_id").isInt().notEmpty().toInt(),
  body("*.storage_location_id").isInt().notEmpty().toInt(),
  body("*.brand_id").isInt().notEmpty().toInt(),
  body("*.category_id").isInt().notEmpty().toInt(),
  body("*.status").isEmpty(),
  ItemController.createMany
);
router.put(
  "/:id",
  checkPermissions("update-item"),
  body("name").isString().optional(),
  body("qty").isEmpty(),
  body("stock_alert_ctr").isInt().optional().toInt(),
  body("cost_price").isNumeric().optional().toFloat(),
  body("selling_price").isNumeric().optional().toFloat(),
  body("company_id").isInt().optional().toInt(),
  body("storage_location_id").isInt().optional().toInt(),
  body("brand_id").isInt().optional().toInt(),
  body("category_id").isInt().optional().toInt(),
  body("status").isEmpty(),
  ItemController.update
);

router.put(
  "/:id/restock",
  checkPermissions("update-item"),
  body("qty").isInt().optional().toInt(),
  ItemController.restock
);

router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-item"),
  ItemController.deleteMany
);
router.delete("/:id", checkPermissions("delete-item"), ItemController.delete);
//TEST TODO HIMOA HIN FRONTEND TEST HA POSTMAN

export default router;
