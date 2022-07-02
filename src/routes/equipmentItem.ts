import { Router } from "express";
import equipmentItemController from "../controllers/EquipmentItemController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import uploadImage from "../middlewares/uploadImage";
const router = Router();

router.get("/", checkPermissions("read-equipment-item"), equipmentItemController.getAll);
router.get(
  "/search",
  checkPermissions("read-equipment-item"),
  equipmentItemController.search
);
router.get(
  "/:id",
  checkPermissions("read-equipment-item"),
  equipmentItemController.getOne
);
router.post(
  "/",
  checkPermissions("create-equipment-item"),
  uploadImage("menuItem"),
  body("name").isString().notEmpty(),    
  body("cost_price").isNumeric().toFloat().notEmpty(),
  body("selling_price").isNumeric().toFloat().notEmpty(),
  body("qty").isInt().toInt().notEmpty(),
  body("equipment_category_id").isInt().toInt().notEmpty(),
  equipmentItemController.create
);

router.post(
  "/bulk",
  checkPermissions("create-equipment-item"),
  body("*.name").isString().notEmpty(),
  body("*.qty").isInt().notEmpty().toInt(),
  body("*.cost_price").isNumeric().notEmpty().toFloat(),
  body("*.selling_price").isNumeric().notEmpty().toFloat(),
  equipmentItemController.createMany
);

router.put(
  "/upload-image/:id",
  checkPermissions("update-equipment-item"),
  uploadImage("menuItem"),
  body("image"),
  equipmentItemController.updateImage
);
router.put(
  "/:id",
  checkPermissions("update-equipment-item"),
  body("name").isString().optional(),
  body("remark").isString().optional(),
  body("cost_price").isFloat().toFloat().optional(),
  body("selling_price").isFloat().toFloat().optional(),
  body("qty").isInt().toInt().optional(),
  body("equipment_category_id").isInt().toInt().optional(),
  equipmentItemController.update
);

router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-equipment-item"),
  equipmentItemController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-equipment-item"),
  equipmentItemController.delete
);

router.put(
  "/:id/restock",
  checkPermissions("update-equipment-item"),
  body("qty").isInt().optional().toInt(),
  equipmentItemController.restock
);

export default router;
