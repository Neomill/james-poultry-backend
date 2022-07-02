import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.itemTransaction;

class ItemTransactionController {
  static search = async (req: Request, res: Response) => {
    const {
      query = "",
      page = 0,
      createdAt,
      updatedAt = 1,
      name,
      qty,
      price,
      id,
    } = req.query;
    const filters: any = [];
    let where: any = {
      OR: [
        {
          item: {
            name: {
              contains: query + "",
            },
          },
        },
      ],
      AND: filters,
    };
    let orderBy: any = {};
    if (updatedAt) {
      Object.assign(orderBy, {
        updatedAt: Number(updatedAt) ? "desc" : "asc",
      });
    } else if (id) {
      Object.assign(orderBy, {
        id: Number(id) ? "desc" : "asc",
      });
    } else if (name) {
      Object.assign(orderBy, {
        item: {
          name: Number(name) ? "desc" : "asc",
        },
      });
    } else if (price) {
      Object.assign(orderBy, {
        price: Number(price) ? "desc" : "asc",
      });
    } else if (qty) {
      Object.assign(orderBy, {
        qty: Number(qty) ? "desc" : "asc",
      });
    } else {
      Object.assign(orderBy, {
        createdAt: Number(createdAt) ? "desc" : "asc",
      });
    }
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany({
          skip: Number(page) * 10,
          take: TAKE,
          include: {
            item: {
              select: {
                name: true,
              },
            },
          },
          where,
          orderBy,
        }),
        model.count({ where }),
      ]);
      let totalPages = Math.ceil(Number(totalData) / Number(TAKE)) - 1;
      let hasMore = false;
      if (page < totalPages) {
        hasMore = true;
      }
      return res.status(200).send({ body: data, totalPages, hasMore });
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };

  static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
        include: {
          item: true,
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static update = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { qty, expiry_date, date_received } = req.body;
    try {
      const [originItemtransaction] = await prisma.$transaction([
        model.findFirst({
          where: {
            id: Number(req.params.id),
          },
          include: {
            item: {
              select: {
                id: true,
                qty: true,
              },
            },
          },
        }),
      ]);
      const finalQty =
        qty -
        Number(originItemtransaction?.qty) +
        Number(originItemtransaction?.item?.qty);
      const data = await prisma.$transaction([
        prisma.item.update({
          where: {
            id: Number(originItemtransaction?.item.id),
          },
          data: {
            qty: finalQty,
          },
        }),
        model.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            qty,
          },
        }),
      ]);
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [originItemtransaction] = await prisma.$transaction([
        model.findFirst({
          where: {
            id: Number(req.params.id),
          },
          include: {
            item: {
              select: {
                id: true,
                qty: true,
              },
            },
          },
        }),
      ]);
      const data = await prisma.$transaction([
        model.delete({
          where: {
            id: Number(req.params.id),
          },
        }),
        prisma.item.update({
          where: {
            id: Number(originItemtransaction?.item.id),
          },
          data: {
            qty: {
              decrement: Number(originItemtransaction?.qty),
            },
          },
        }),
      ]);

      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
  static deleteMany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await model.deleteMany({
        where: {
          id: {
            in: req.body,
          },
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}
export default ItemTransactionController;
