import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.pO_Request;

class PORequestController {
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
      createdAt,
      updatedAt = 1,
      item,
      reason,
      status,
      attendant,
      request_no,
      item_name,
      id,
    } = req.query;
    const filters: any = [];
    status &&
      filters.push({
        status,
      });
    reason &&
      filters.push({
        reason,
      });
    item &&
      filters.push({
        item: {
          id: Number(item),
        },
      });
    attendant &&
      filters.push({
        attendant: {
          id: Number(attendant),
        },
      });
    let where: any = {
      OR: [
        {
          item_transaction: {
            item: {
              name: {
                contains: query + "",
              },
            },
          },
        },
        {
          request_no: {
            contains: query + "",
          },
        },
      ],
      AND: filters,
    };
    let orderBy: any = {};
    if (item_name) {
      Object.assign(orderBy, {
        item: {
          name: Number(item_name) ? "desc" : "asc",
        },
      });
    } else if (request_no) {
      Object.assign(orderBy, {
        request_no: Number(request_no) ? "desc" : "asc",
      });
    } else if (id) {
      Object.assign(orderBy, {
        id: Number(id) ? "desc" : "asc",
      });
    } else if (updatedAt) {
      Object.assign(orderBy, {
        updatedAt: Number(updatedAt) ? "desc" : "asc",
      });
    } else {
      Object.assign(orderBy, {
        updatedAt: Number(createdAt) ? "desc" : "asc",
      });
    }
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany({
          skip: Number(page) * 10,
          take: TAKE,
          where,
          include: {
            item_transaction: {
              select: {
                item: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            attendant: {
              select: {
                id: true,
                fname: true,
                mname: true,
                lname: true,
              },
            },
            storage_location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy,
        }),
        model.count({
          where,
        }),
      ]);
      let totalPages = Math.ceil(Number(totalData) / Number(TAKE)) - 1;
      return res.status(200).send({ body: data, totalPages });
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
          item_transaction: {
            include: {
              item: true,
            },
          },
          attendant: true,
          storage_location: true,
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
    const authUser: any = req.user;
    const attendant_id: number = Number(authUser?.employee?.id);

    try {
      const sanitizedData = req.body.map((d: any) => {
        const modified = {
          attendant_id,
          ...d,
        };
        delete modified.id;
        return modified;
      });
      console.log(sanitizedData);
      const data = await model.createMany({
        data: sanitizedData,
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
    const { remarks, reason, item_transaction_id, qty, storage_location_id } =
      req.body;

    const authUser: any = req.user;

    try {
      const data = await model.create({
        data: {
          remarks,
          reason,
          request_no:
            "POR-" +
            Date.now() +
            "-" +
            storage_location_id +
            item_transaction_id +
            authUser?.employee?.id,
          qty,
          item_transaction: {
            connect: {
              id: Number(item_transaction_id),
            },
          },
          storage_location: {
            connect: {
              id: Number(storage_location_id),
            },
          },
          attendant: {
            connect: {
              id: Number(authUser?.employee?.id),
            },
          },
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

  // static delete = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const data = await model.delete({
  //       where: {
  //         id: Number(req.params.id),
  //       },
  //     });
  //     return res.status(200).send(data);
  //   } catch (error: any) {
  //     return res.status(404).send(error.message);
  //   }
  // };
  // static deleteMany = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const data = await model.deleteMany({
  //       where: {
  //         id: {
  //           in: req.body,
  //         },
  //       },
  //     });
  //     return res.status(200).send(data);
  //   } catch (error: any) {
  //     return res.status(404).send(error.message);
  //   }
  // };
}

export default PORequestController;
