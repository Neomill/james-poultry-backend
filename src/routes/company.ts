import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-supplier"), CompanyController.getAll);
router.get(
  "/search",
  checkPermissions("read-supplier"),
  CompanyController.search
);
router.get("/:id", checkPermissions("read-supplier"), CompanyController.getOne);
router.post(
  "/",
  checkPermissions("create-supplier"),
  body("name").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("rep_fname").isString().notEmpty(),
  body("rep_lname").isString().notEmpty(),
  body("rep_mname").isString().notEmpty(),
  body("rep_phone").isString().notEmpty(),
  body("rep_address").isString().notEmpty(),
  CompanyController.create
);
router.put(
  "/:id",
  checkPermissions("update-supplier"),
  body("name").isString().optional(),
  body("address").isString().optional(),
  body("phone").isString().optional(),
  body("rep_fname").isString().optional(),
  body("rep_lname").isString().optional(),
  body("rep_mname").isString().optional(),
  body("rep_phone").isString().optional(),
  body("rep_address").isString().optional(),
  CompanyController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-supplier"),
  CompanyController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-supplier"),
  CompanyController.delete
);

export default router;
