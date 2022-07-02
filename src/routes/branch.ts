import { Router } from "express";
import { body } from "express-validator";
import checkPermissions from "../middlewares/checkPermissions";
import BranchController from "./../controllers/BranchController";
const router = Router();

router.get("/", checkPermissions("read-branch"), BranchController.getAll);
router.get(
  "/search",
  checkPermissions("read-branch"),
  BranchController.search
);
router.get(
  "/:id",
  checkPermissions("read-branch"),
  BranchController.getOne
);
router.post(
  "/",
  checkPermissions("create-branch"),
  BranchController.createBranch
);
router.put(
  "/:id",
  checkPermissions("update-branch"),
  BranchController.updateBranch
);
router.delete(
  "/bulk",
  body("*.*").isInt().optional().toInt(),
  checkPermissions("delete-branch"),
  BranchController.deleteMany
);
router.delete(
  "/:id",
  checkPermissions("delete-branch"),
  BranchController.delete
);

export default router;
