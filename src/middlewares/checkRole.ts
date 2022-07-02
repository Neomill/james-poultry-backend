import { NextFunction, Request, Response } from "express";

const checkRole = (...permittedRoles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authUser: any = req.user;
    const found = authUser?.roles?.some((role: any) =>
      permittedRoles.includes(role.name)
    );
    if (authUser && found) {
      next();
    } else {
      return res.status(403).send({ message: "Forbidden" });
    }
  };
};

export default checkRole;
