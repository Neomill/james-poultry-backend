import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from "../lib/prisma";
const model = prisma.user;
import argon2 from "argon2";

class AuthController {
  static signIn = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Oh no, something is not right!",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.send(err);
        }
        if (process.env.JWT_SECRET) {
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              roles: user.roles,
              employee: user.employee,
            },
            process.env.JWT_SECRET
          );
          return res.json({ user, token });
        }
        return res.status(401).send({
          message: "Something went wrong! Please contact the administrator.",
        });
      });
    })(req, res);
  };
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      username,
      password,
      fname,
      lname,
      mname,
      phone,
      address,
      position_id,
    } = req.body;
    try {
      const hashedPassword = await argon2.hash(password);
      await model.create({
        data: {
          username,
          password: hashedPassword,
          employee: {
            create: {
              fname,
              lname,
              mname,
              phone,
              address,
              position_id: Number(position_id),
            },
          },
        },
      });
      return res.status(200).send("Registered");
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static profile = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      return res.status(200).send({
        user: req.user,
      });
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { oldPassword, newPassword } = req.body;

    try {
      const authUser: any = req.user;
      const user = await model.findFirst({
        where: {
          id: Number(authUser?.id),
        },
      });

      if (!user) {
        return res.status(401).send("Cannot find user");
      }
      if (!(await argon2.verify(user.password, oldPassword))) {
        return res.status(401).send("Incorrect password.");
      }

      const hashedPassword = await argon2.hash(newPassword);

      const updatedUser = await model.update({
        where: {
          id: Number(authUser?.id),
        },
        data: {
          password: hashedPassword,
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
          employee: true,
        },
      });

      req.login(updatedUser, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        if (process.env.JWT_SECRET) {
          const token = jwt.sign(
            {
              id: updatedUser.id,
              username: updatedUser.username,
            },
            process.env.JWT_SECRET
          );
          return res.json({
            user: {
              id: updatedUser.id,
              username: updatedUser.username,
              roles: updatedUser.roles,
              employee: updatedUser.employee,
            },
            token,
          });
        }
        return res.status(401).send({
          message: "Something went wrong! Please contact the administrator.",
        });
      });
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static changeProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username } = req.body;
    try {
      const authUser: any = req.user;
      const updatedUser = await model.update({
        where: {
          id: Number(authUser?.id),
        },
        data: {
          username,
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
          employee: true,
        },
      });
      if (updatedUser) {
        req.login(updatedUser, { session: false }, (err) => {
          if (err) {
            return res.status(400).send(err);
          }
          if (process.env.JWT_SECRET) {
            const token = jwt.sign(
              {
                id: updatedUser.id,
                username: updatedUser.username,
                roles: updatedUser.roles,
                employee: updatedUser.employee,
              },
              process.env.JWT_SECRET
            );
            return res.json({
              user: {
                id: updatedUser.id,
                username: updatedUser.username,
                roles: updatedUser.roles,
              },
              token,
            });
          }
          return res.status(401).send({
            message: "Something went wrong! Please contact the administrator.",
          });
        });
      }
      return;
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  };
}

export default AuthController;
