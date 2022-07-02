import { Prisma } from "@prisma/client";
import { getItemCondition } from "../../helpers/itemHelper";
import prisma from "../prisma";

const itemStockMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if (params.model == "ItemTransaction") {
    const data = params.args.data;
    if (params.action == "create") {
      if (data.qty !== undefined || data.stock_alert_ctr !== undefined) {
        let condition = getItemCondition(data.expiry_date);
        params.args.data.condition = condition;
      }
    } else if (params.action == "update") {
      const id = params.args.where.id;
      const itemTransaction = await prisma.itemTransaction.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (itemTransaction) {
        if (data.expiry_date !== undefined) {
          let expiry_date = data.expiry_date;
          let condition = getItemCondition(expiry_date);
          console.log("hello", expiry_date);
          params.args.data.condition = condition;
        }
      }
    } else if (params.action == "createMany") {
      data.map((item_transaction: any, index: number) => {
        let condition = getItemCondition(item_transaction.expiry_date);
        params.args.data[index].condition = condition;
      });
    }
  }

  const result = await next(params);
  return result;
};

export default itemStockMiddleware;
