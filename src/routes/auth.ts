import { Router } from "express";
import { body } from "express-validator";
import passport from "passport";
import AuthController from "../controllers/AuthController";
import checkPermissions from "../middlewares/checkPermissions";
const router = Router();
router.post(
  "/sign-in",
  body("username").isString().notEmpty(),
  body("password").isString().notEmpty(),
  AuthController.signIn
);
router.post(
  "/sign-up",
  passport.authenticate("jwt", { session: false }),
  checkPermissions("create-employee"),
  body("username").isString().notEmpty(),
  body("password").isLength({ min: 8 }).notEmpty(),
  body("fname").isString().notEmpty(),
  body("lname").isString().notEmpty(),
  body("mname").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("position_id").isInt().notEmpty().toInt(),
  AuthController.signUp
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  AuthController.profile
);
router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  body("oldPassword").isString().notEmpty(),
  body("newPassword").isLength({ min: 8 }).notEmpty(),
  AuthController.changePassword
);
router.put(
  "/change-profile",
  passport.authenticate("jwt", { session: false }),
  body("username").isString().optional(),
  body("password").isEmpty(),
  AuthController.changeProfile
);

export default router;
