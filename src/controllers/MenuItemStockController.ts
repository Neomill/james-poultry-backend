import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.menuItemStock;

class MenuItemStockController {
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
            menu_item: {
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
          menu_item: true,
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
    try {
      const menutItemToUdpate = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
        include: {
          menu_item: {
            select: {
              id: true,
              qty: true,
            },
          },
        },
      });

      // set default value for qty and expiray_data to their current value  if not set
      const currentMenuItemStockQty: number =
        Number(menutItemToUdpate?.qty) || 0;
      const currentMenuItemStockExpiry_date =
        req.body.expiry_date || menutItemToUdpate?.expiry_date;

      // total menutItemQty
      const relatedMenuItemQty = menutItemToUdpate?.menu_item?.qty || 0;

      const qtyToUpdate = req.body.qty || currentMenuItemStockQty;
      const menuItemQtyToUpdate =
        relatedMenuItemQty + (qtyToUpdate - currentMenuItemStockQty);

      const data = await prisma.$transaction([
        prisma.menuItem.update({
          where: {
            id: menutItemToUdpate?.menu_item_id,
          },
          data: {
            qty: menuItemQtyToUpdate,
          },
        }),
        model.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            qty: req.body.qty,
            expiry_date: currentMenuItemStockExpiry_date,
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
      const [itemToDelete] = await prisma.$transaction([
        model.findFirst({
          where: {
            id: Number(req.params.id),
          },
        }),
      ]);

      const data = await prisma.$transaction([
        model.delete({
          where: {
            id: Number(req.params.id),
          },
        }),
        prisma.menuItem.update({
          where: {
            id: Number(itemToDelete?.menu_item_id),
          },
          data: {
            qty: {
              decrement: Number(itemToDelete?.qty),
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
      const [menuItemStocksToDelete] = await prisma.$transaction([
        model.findMany({
          where: {
            id: { in: req.body },
          },
          include: {
            menu_item: {
              select: {
                id: true,
                qty: true,
              },
            },
          },
        }),
      ]);

      for (const menuItemStocks of menuItemStocksToDelete) {
        const data = await prisma.$transaction([
          model.delete({
            where: {
              id: Number(menuItemStocks.id),
            },
          }),
          prisma.menuItem.update({
            where: {
              id: menuItemStocks.menu_item_id,
            },
            data: {
              qty: {
                decrement: Number(menuItemStocks.qty),
              },
            },
          }),
        ]);
      }

      return res.status(200).send(menuItemStocksToDelete);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}
export default MenuItemStockController;
