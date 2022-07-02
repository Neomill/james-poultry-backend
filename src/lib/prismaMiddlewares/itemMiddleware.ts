import { Prisma } from "@prisma/client";
import { getStockStatus } from "../../helpers/itemHelper";
import prisma from "../prisma";

const itemMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if (params.model == "Item") {
    if (params.action == "create") {
      const data = params.args.data;
      if (data.qty !== undefined || data.stock_alert_ctr !== undefined) {
        let status = getStockStatus(
          Number(data.qty),
          Number(data.stock_alert_ctr)
        );
        params.args.data.status = status;
      }
    } else if (params.action == "update") {
      const id = params.args.where.id;
      const data = params.args.data;
      if (data.qty !== undefined || data.stock_alert_ctr !== undefined) {
        const item = await prisma.item.findFirst({
          where: {
            id: Number(id),
          },
        });
        if (item) {
          let status: any;
          if (data.qty !== undefined && data.stock_alert_ctr !== undefined) {
            let qty = Number(data.qty);
            let stock_alert_ctr = Number(data.stock_alert_ctr);
            status = getStockStatus(qty, stock_alert_ctr);
          } else if (data.qty !== undefined) {
            let qty = Number(data.qty);
            let stock_alert_ctr = Number(item.stock_alert_ctr);
            status = getStockStatus(qty, stock_alert_ctr);
          } else if (data.stock_alert_ctr !== undefined) {
            let stock_alert_ctr = Number(data.stock_alert_ctr);
            let qty = Number(item.qty);
            status = getStockStatus(qty, stock_alert_ctr);
            console.log(qty, stock_alert_ctr, status);
          }
          params.args.data.status = status;
        }
      }
      if (data.qty?.decrement !== undefined) {
        const item = await prisma.item.findFirst({
          where: {
            id: Number(id),
          },
        });
        if (item) {
          let status: any;
          let qty = Number(item.qty) - Number(data.qty.decrement);
          let stock_alert_ctr = Number(item.stock_alert_ctr);
          status = getStockStatus(qty, stock_alert_ctr);
          params.args.data.status = status;
        }
      } else if (data.qty?.increment !== undefined) {
        const item = await prisma.item.findFirst({
          where: {
            id: Number(id),
          },
        });
        if (item) {
          let status: any;
          let qty = Number(item.qty) + Number(data.qty.increment);
          let stock_alert_ctr = Number(item.stock_alert_ctr);
          status = getStockStatus(qty, stock_alert_ctr);
          params.args.data.status = status;
        }
      }
    } else if (params.action == "createMany") {
      const items = params.args.data;

      items.map((item: any, index: number) => {
        const data = item;
        if (data.qty !== undefined || data.stock_alert_ctr !== undefined) {
          let status = getStockStatus(
            Number(data.qty),
            Number(data.stock_alert_ctr)
          );
          params.args.data[index].status = status;
        }
      });
    }
  }
  const result = await next(params);
  return result;
};
export default itemMiddleware;
