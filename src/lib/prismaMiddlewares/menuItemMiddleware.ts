import { Prisma } from "@prisma/client";
import prisma from "../prisma";

const menuItemMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if (params.model == "MenuItem") {
    if (params.action == "create") {
      const data = params.args.data;
    } else if (params.action == "update") {
    } else if (params.action == "createMany") {
      const menuItems = params.args.data;
      console.log("hgh", menuItems);
    }
  }
  const result = await next(params);
  return result;
};
export default menuItemMiddleware;
