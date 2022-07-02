import { Prisma } from "@prisma/client";
import prisma from "../prisma";

const equipmentItemMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if (params.model == "Equipment") {
    if (params.action == "create") {
      const data = params.args.data;
    } else if (params.action == "update") {
    } else if (params.action == "createMany") {
      const equipmentItems = params.args.data;
      console.log("hgh", equipmentItems);
    }
  }
  const result = await next(params);
  return result;
};
export default equipmentItemMiddleware;
