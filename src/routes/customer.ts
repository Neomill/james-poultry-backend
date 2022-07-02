import { Router } from "express";
import CustomerController from "../controllers/CustomerController";
import { body } from "express-validator";
const router = Router();

router.get(
  "/",

  CustomerController.getAll
);
router.get(
  "/search",

  CustomerController.search
);
router.get(
  "/:id",

  CustomerController.getOne
);
router.post(
  "/",
  body("lname").isString().notEmpty(),
  body("fname").isString().notEmpty(),
  body("mname").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  CustomerController.create
);
router.put(
  "/:id",
  body("lname").isString().optional(),
  body("fname").isString().optional(),
  body("mname").isString().optional(),
  body("phone").isString().optional(),
  body("address").isString().optional(),
  CustomerController.update
);
router.delete(
  "/:id",
  CustomerController.delete
);

export default router;
