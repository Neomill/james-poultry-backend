import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.representative;

class RepresentativeController {
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
      phone,
      address,
      createdAt,
      updatedAt = 1,
      company,
    } = req.query;
    const filters: any = [];
    phone &&
      filters.push({
        phone: {
          contains: phone + "",
        },
      });
    address &&
      filters.push({
        address: {
          contains: address + "",
        },
      });
    company &&
      filters.push({
        company: {
          id: Number(company),
        },
      });
    let where: any = {
      OR: [
        {
          fname: {
            contains: query + "",
          },
        },
        {
          lname: {
            contains: query + "",
          },
        },
        {
          mname: {
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
    } else {
      Object.assign(orderBy, {
        updatedAt: Number(createdAt) ? "desc" : "asc",
      });
    }
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany({
          skip: Number(page) * 10,
          include: { company: true },
          take: TAKE,
          where,
          orderBy,
        }),
        model.count({ where }),
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
          company: true,
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
    const { lname, fname, mname, phone, address, company_id } = req.body;
    try {
      // const data = await model.create({
      //   data: {
      //     lname,
      //     fname,
      //     mname,
      //     phone,
      //     address,
      //   },
      // });
      // res.json(data);
      return res.status(200).send("");
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { lname, fname, mname, phone, address } = req.body;
    try {
      const data = await model.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          lname,
          fname,
          mname,
          phone,
          address,
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

export default RepresentativeController;
