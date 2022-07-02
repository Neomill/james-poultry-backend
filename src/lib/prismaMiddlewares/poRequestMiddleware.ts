import { Prisma } from "@prisma/client";
import prisma from "../prisma";

const poRequestMiddleware = async (
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) => {
  if (params.model == "PO_Request") {
    if (params.action == "create") {
      const data = params.args.data;
      if (
        data.qty !== undefined &&
        data.item_transaction.connect.id !== undefined
      ) {
        const itemTransaction = await prisma.itemTransaction.update({
          where: {
            id: Number(data.item_transaction.connect.id),
          },
          data: {
            qty: {
              decrement: Number(data.qty),
            },
          },
        });
        await prisma.item.update({
          where: {
            id: Number(itemTransaction.item_id),
          },
          data: {
            qty: {
              decrement: Number(data.qty),
            },
          },
        });
      }
    } else if (params.action == "update") {
      const id = params.args.where.id;
      const data = params.args.data;
      if (data.qty !== undefined) {
        const po = await prisma.pO_Request.findFirst({
          where: {
            id: Number(id),
          },
          include: {
            item_transaction: {
              select: {
                item: {
                  select: {
                    selling_price: true,
                    cost_price: true,
                    qty: true,
                  },
                },
                qty: true,
              },
            },
          },
        });
        if (po) {
          const qtyToChange: number = Number(po.qty) - Number(data.qty);
          const itemTransaction = await prisma.itemTransaction.update({
            where: {
              id: Number(po.item_transaction_id),
            },
            data: {
              qty: {
                increment: qtyToChange,
              },
            },
          });
          await prisma.item.update({
            where: {
              id: Number(itemTransaction.item_id),
            },
            data: {
              qty: {
                increment: qtyToChange,
              },
            },
          });
        }
      }
    } else if (params.action == "delete") {
      const id = params.args.where.id;
      const po = await prisma.pO_Request.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (po?.status === "PENDING") {
        const itemTransaction = await prisma.itemTransaction.update({
          where: {
            id: Number(po.item_transaction_id),
          },
          data: {
            qty: {
              increment: Number(po.qty),
            },
          },
        });
        await prisma.item.update({
          where: {
            id: Number(itemTransaction.item_id),
          },
          data: {
            qty: {
              increment: Number(po.qty),
            },
          },
        });
      }
    } else if (params.action == "createMany") {
      const pors = params.args.data;
      let error = false;
      for (let i = 0; i < pors.length; i++) {
        let data = pors[i];
        if (data.qty !== undefined && data.item_transaction_id) {
          try {
            await prisma.itemTransaction.update({
              where: {
                id: Number(data.item_transaction_id),
              },
              data: {
                item: {
                  update: {
                    qty: {
                      decrement: Number(data.qty),
                    },
                  },
                },
                qty: {
                  decrement: Number(data.qty),
                },
              },
            });
          } catch (e: any) {
            error = true;
            break;
          }
        }
      }
      if (error) {
        throw new Error("Error processing your request.");
      }
    }
  }
  const result = await next(params);
  return result;
};

export default poRequestMiddleware;
