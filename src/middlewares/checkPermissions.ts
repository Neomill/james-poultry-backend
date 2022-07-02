import { NextFunction, Request, Response } from "express";

const checkPermissions = (...permittedPermissions: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authUser: any = req.user;

    const found = authUser?.roles?.some((role: any) =>
      role.permissions?.some((permission: any) =>
        permittedPermissions.includes(permission.name)
      )
    );

    if (authUser && found) {
      next();
    } else {
      return res.status(403).send({
        message: "You do not have permission to access to access this route.",
      });
    }
  };
};

export default checkPermissions;
