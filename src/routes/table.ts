import { Router } from "express";
import TableController from "../controllers/TableController";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();

router.get("/", checkPermissions("read-category"), TableController.getAll);
router.get(
  "/search",
  checkPermissions("read-category"),
  TableController.search
);
router.get("/:id", checkPermissions("read-category"), TableController.getOne);
router.post(
  "/",
  checkPermissions("create-category"),
  body("name").isString().notEmpty(),
  TableController.create
);
router.put(
  "/:id",
  checkPermissions("update-category"),
  body("name").isString().optional(),
  TableController.update
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-category"),
  TableController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-category"),
  TableController.delete
);

export default router;
