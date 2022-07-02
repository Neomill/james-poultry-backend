import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.order;

class OrderController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany(),
        model.count(),
      ]);
      return res.status(200).send({ body: data, totalData });
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static search = async (req: Request, res: Response) => {
    const { query = "", page = 0, createdAt, updatedAt = 1, id } = req.query;
    const filters: any = [];
    let where: any = {
      AND: filters,
    };
    let orderBy: any = {};
    if (updatedAt) {
      Object.assign(orderBy, {
        updatedAt: Number(updatedAt) ? "desc" : "asc",
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
            invoice: {
              select: {
                id: true,
                transaction:true
              },
            },
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
          invoice: true,
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { menu_item_id, qty, fname, lname, mname, phone, address, table_id } =
      req.body;
    try {
      let [menuitem] = await prisma.$transaction([
        prisma.menuItem.findFirst({
          where: {
            id: Number(menu_item_id),
          },
          select: {
            id: true,
            cost_price: true,
            selling_price: true,
          },
        }),
      ]);
      const customer = await prisma.customer.create({
        data: {
          fname,
          lname,
          mname,
          phone,
          address,
        },
      });
      // const order = await model.create({
      //   data: {

      //     qty: Number(qty),
      //     price: Number(qty) * Number(menuitem?.selling_price),
      //     menu_item_id: Number(menu_item_id),
      //     table_id: Number(table_id),
      //   },
      // });

      // return res.status(200).send(order);
      return res.status(200).send("Nice");
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  // static update = async (req: Request, res: Response, next: NextFunction) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  //   const { menu_item_id, customer_id, qty, price } = req.body;
  //   try {
  //     const data = await model.update({
  //       where: {
  //         id: Number(req.params.id),
  //       },
  //       data: {
  //         menu_item_id,
  //         customer_id,
  //         qty,
  //         price,
  //       },
  //     });
  //     return res.status(200).send(data);
  //   } catch (error: any) {
  //     return res.status(404).send(error.message);
  //   }
  // };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await model.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}

export default OrderController;
