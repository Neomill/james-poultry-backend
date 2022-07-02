import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-order"), OrderController.getAll);
router.get("/search", checkPermissions("read-order"), OrderController.search);
router.get("/:id", checkPermissions("read-order"), OrderController.getOne);
// router.post(
//   "/",
//   checkPermissions("create-order"),
//   body("menu_item_id").isInt().notEmpty().toInt(),
//   body("menu_category_name").isInt().optional().toInt(),
//   body("fname").isString().notEmpty(),
//   body("lname").isString().notEmpty(),
//   body("mname").isString().notEmpty(),
//   body("phone").isString().notEmpty(),
//   body("address").isString().notEmpty(),
//   body("qty").isInt().notEmpty().toInt(),
//   OrderController.create
// );
// router.put(
//   "/:id",
//   checkPermissions("update-order"),
//   body("qty").isInt().optional().toInt(),
//   OrderController.update
// );
// router.delete("/:id", checkPermissions("delete-order"), OrderController.delete);

export default router;
