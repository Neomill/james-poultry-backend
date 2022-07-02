import { Router } from "express";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import EmployeeController from "./../controllers/EmployeeController";
const router = Router();

router.get("/", checkPermissions("read-employee"), EmployeeController.getAll);
router.get(
  "/search",
  checkPermissions("read-employee"),
  EmployeeController.search
);
router.get(
  "/:id",
  checkPermissions("read-employee"),
  EmployeeController.getOne
);
router.post(
  "/",
  checkPermissions("create-employee"),
  body("fname").isString().notEmpty(),
  body("lname").isString().notEmpty(),
  body("mname").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("position_id").isInt().notEmpty().toInt(),
  EmployeeController.createEmployee
);
router.put(
  "/:id",
  body("id").isInt().optional().toInt(),
  checkPermissions("update-employee"),
  body("fname").isString().optional(),
  body("lname").isString().optional(),
  body("mname").isString().optional(),
  body("phone").isString().optional(),
  body("address").isString().optional(),
  body("position_id").isInt().optional().toInt(),
  EmployeeController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-employee"),
  EmployeeController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-employee"),
  EmployeeController.delete
);
export default router;
