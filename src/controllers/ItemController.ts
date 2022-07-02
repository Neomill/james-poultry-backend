import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { getItemCondition } from "../helpers/itemHelper";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.item;

class ItemController {
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
    const {
      query = "",
      page = 0,
      qty,
      desc,
      status,
      condition,
      stock_alert_ctr,
      brand,
      category,
      company,
      storage_location,
      date_received,
      expiry_date,
      updatedAt = 1,
      createdAt,
      minPrice = 0,
      maxPrice,
      price,
      name,
      id,
    } = req.query;
    const filters: any = [];
    minPrice &&
      maxPrice &&
      filters.push({
        price: {
          lte: maxPrice,
          gte: minPrice,
        },
      });
    brand &&
      filters.push({
        brand: {
          id: Number(brand),
        },
      });
    category &&
      filters.push({
        category: {
          id: Number(category),
        },
      });

    condition &&
      filters.push({
        condition,
      });
    status &&
      filters.push({
        status,
      });
    company &&
      filters.push({
        company: {
          id: Number(company),
        },
      });
    storage_location &&
      filters.push({
        storage_location: {
          id: Number(storage_location),
        },
      });

    let where: any = {
      OR: [
        {
          name: {
            contains: query + "",
          },
        },
        {
          brand: {
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
    } else if (name) {
      Object.assign(orderBy, {
        name: Number(name) ? "desc" : "asc",
      });
    } else if (id) {
      Object.assign(orderBy, {
        id: Number(id) ? "desc" : "asc",
      });
    } else if (date_received) {
      Object.assign(orderBy, {
        date_received: Number(date_received) ? "desc" : "asc",
      });
    } else if (price) {
      Object.assign(orderBy, {
        cost_price: Number(price) ? "desc" : "asc",
      });
    } else if (expiry_date) {
      Object.assign(orderBy, {
        expiry_date: Number(expiry_date) ? "desc" : "asc",
      });
    } else if (qty) {
      Object.assign(orderBy, {
        qty: Number(qty) ? "desc" : "asc",
      });
    } else if (desc) {
      Object.assign(orderBy, {
        desc: Number(desc) ? "desc" : "asc",
      });
    } else if (stock_alert_ctr) {
      Object.assign(orderBy, {
        stock_alert_ctr: Number(stock_alert_ctr) ? "desc" : "asc",
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
            item_transactions: true,
            brand: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            company: {
              select: {
                name: true,
              },
            },
            storage_location: {
              select: {
                name: true,
              },
            },
          },
          where,
          orderBy,
        }),
        model.count({
          where,
        }),
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
          brand: {
            select: {
              name: true,
            },
          },
          item_transactions: true,
          category: {
            select: {
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
          storage_location: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static createMany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sanitizedData = req.body.map((d: any) => {
        delete d.id;
        const mod = {
          ...d,
          cost_price: d.cost_price,
          selling_price: d.selling_price,
          item_transactions: {
            create: {
              expiry_date: d.expiry_date,
              date_received: d.date_received,
              qty: d.qty,
            },
          },
        };
        delete mod.expiry_date;
        delete mod.date_received;
        return mod;
      });

      for (const u of sanitizedData) {
        await model.create({
          data: u,
        });
      }
      // const data = await model.createMany({
      //   data: sanitizedData,
      // });
      return res.status(200).send("Success");
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let d = req.body;
      delete d.expiry_date;
      delete d.date_received;
      const data = await model.create({
        data: {
          ...d,
          cost_price: req.body.cost_price,
          selling_price: req.body.selling_price,
          item_transactions: {
            create: {
              date_received: req.body.date_received,
              expiry_date: req.body.expiry_date,
              qty: req.body.qty,
            },
          },
        },
      });
      console.log(data);
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
    const id = req.params.id;
    try {
      const data = await model.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static restock = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const { qty, expiry_date, date_received } = req.body;
    try {
      const data = await model.update({
        where: {
          id: Number(id),
        },
        data: {
          qty: {
            increment: qty,
          },
          item_transactions: {
            create: {
              condition: getItemCondition(new Date(expiry_date)),
              expiry_date,
              date_received,
              qty: qty,
            },
          },
        },
      });

      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

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

export default ItemController;
