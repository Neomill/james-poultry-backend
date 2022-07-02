import { Router } from "express";
import EquipmentCategoryController from "../controllers/EquipmentItemCategoryController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-equipment-item-category"), EquipmentCategoryController.getAll);
router.get("/search", checkPermissions("read-equipment-item-category"), EquipmentCategoryController.search);
router.get("/:id", checkPermissions("read-equipment-item-category"), EquipmentCategoryController.getOne);
router.post(
  "/",
  checkPermissions("create-equipment-item-category"),
  body("name").isString().notEmpty(),
  EquipmentCategoryController.create
);
router.put(
  "/:id",
  checkPermissions("update-equipment-item-category"),
  body("name").isString().optional(),
  EquipmentCategoryController.update
);
router.delete(
  "/:id",
  checkPermissions("delete-equipment-item-category"),
  EquipmentCategoryController.delete
);

export default router;
