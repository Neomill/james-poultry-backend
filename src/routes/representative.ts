import { Router } from "express";
import RepresentativeController from "../controllers/RepresentativeController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get(
  "/",
  checkPermissions("read-supplier"),
  RepresentativeController.getAll
);
router.get(
  "/search",
  checkPermissions("read-supplier"),
  RepresentativeController.search
);
router.get(
  "/:id",
  checkPermissions("read-supplier"),
  RepresentativeController.getOne
);
router.post(
  "/",
  body("lname").isString().notEmpty(),
  body("fname").isString().notEmpty(),
  body("mname").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("company_id").isInt().notEmpty().toInt(),
  checkPermissions("create-supplier"),
  RepresentativeController.create
);
router.put(
  "/:id",
  body("lname").isString().optional(),
  body("fname").isString().optional(),
  body("mname").isString().optional(),
  body("phone").isString().optional(),
  body("address").isString().optional(),
  body("company_id").isInt().optional().toInt(),
  checkPermissions("update-supplier"),
  RepresentativeController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-supplier"),
  RepresentativeController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-supplier"),
  RepresentativeController.delete
);

export default router;
