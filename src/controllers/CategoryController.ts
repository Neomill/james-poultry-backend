import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.category;

class CategoryController {
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
      createdAt,
      updatedAt = 1,
      name,
      id,
    } = req.query;
    const filters: any = [];
    let where: any = {
      OR: [
        {
          name: {
            contains: query + "",
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
        name: Number(name) ? "desc" : "asc",
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
            items: {
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
          items: true,
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
    const { name } = req.body;
    try {
      const isExisted = await model.findFirst({
        where: {
          name: {
            contains: name,
          },
        },
      });
      if (isExisted) {
        return res.status(400).send("Category Already Existed");
      }
      const data = await model.create({
        data: {
          name,
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
    const { name } = req.body;
    try {
      const data = await model.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          name,
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

export default CategoryController;
