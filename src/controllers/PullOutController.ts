import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.pullOut;

class PullOutController {
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
      sortById,
      updatedAt = 1,
      createdAt,
      id,
    } = req.query;
    const filters: any = [];
    let where: any = {
      OR: [
        {
          id: {
            gte:0
          }
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
    }else if (sortById) {
      Object.assign(orderBy, {
        id: Number(sortById) ? "desc" : "asc",
      });
    } else {
      Object.assign(orderBy, {
        createdAt: Number(createdAt) ? "desc" : "asc",
      });
    }
    try {
      let data = await model.findMany(
        {
          include: {
            menu_item: {
              select: {
                name: true,
              },
            },
          },
        }
      )
        // model.count({ where }),
  
      let totalPages = Math.ceil(Number(2) / Number(TAKE)) - 1;
      return res.status(200).send({ body: data, totalPages });
      // return res.status(200)
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };
  static getOne = async (req: Request, res: Response) => {
    try {
      const data = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
        include: {
          menu_item: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  };

  static create = async (req: Request, res: Response) => {
    const { menu_item, description, qty } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const validData = {
        menu_item: {
          connect: {
            id: menu_item?.value,
          }
        },
        reason: description,
        qty: qty
      }

      const data = await model.create({
        data: validData
      });

      console.log(data)

      let [datum] = await prisma.$transaction([
        prisma.menuItem.update({
          where: {
           id: Number(data.id),
          },
          data: {
            qty: {
              decrement: Number(qty),
            },
          }
        })
      ]);  

      return res.status(200).send(data);
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };
  static update = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body)
    try {
      const { reqdata } = req.body;
      const id = req.params.id;
      const data = await model.update({
        where: { id: Number(id) },
        data: 
          reqdata
      });
      return res.status(200).send(data);
    } catch (e: any) {
      console.log(e)
      return res.status(400).send(e.message);
    }
  };
  static delete = async (req: Request, res: Response) => {
    try {
      const data = await model.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(400).send(error.message);
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
export default PullOutController;
