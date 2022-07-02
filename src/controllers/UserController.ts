import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

class UserController {
  static index = async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();

    res.json(users);
  };
}

export default UserController;
