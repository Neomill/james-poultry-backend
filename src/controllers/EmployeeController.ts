import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
const model = prisma.employee;

class EmployeeController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany({
          where: {
            NOT: {
              id: 1, //SHYDAN BOT
            },
          },
        }),
        model.count(),
      ]);
      return res.status(200).send({ body: data, totalData });
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static search = async (req: Request, res: Response) => {
    const {
      branch,
      position,
      query = "",
      page = 0,
      address,
      createdAt,
      updatedAt = 1,
      user,
      fname,
      lname,
      id,
    } = req.query;
    const filters: any = [
      {
        NOT: {
          id: 1, //SHYDAN BOT
        },
      },
    ];

    position &&
      filters.push({
        position: {
          id: Number(position),
        },
      });

    branch &&
      filters.push({
        branch: {
          id: Number(branch),
        },
      });

    address &&
      filters.push({
        address: {
          contains: address,
        },
      });
    user &&
      filters.push({
        user: {
          id: Number(user),
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
    } else if (id) {
      Object.assign(orderBy, {
        id: Number(id) ? "desc" : "asc",
      });
    } else if (fname) {
      Object.assign(orderBy, {
        fname: Number(fname) ? "desc" : "asc",
      });
    } else if (lname) {
      Object.assign(orderBy, {
        lname: Number(lname) ? "desc" : "asc",
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
            position: {
              select: {
                name: true,
              },
            },
            branch:{
              select:{
                name:true,
                id:true
              }
            },
          },

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
  static getOne = async (req: Request, res: Response) => {
    try {
      const data = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
        include: {
          branch:{
            select:{
              name:true,
              id:true
            }
          },
          position: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static createEmployee = async (req: Request, res: Response) => {
    if(req.body.position_id === NaN){
      delete req.body["position_id"]
    }
    console.log(req.body)

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { fname, lname, mname, phone, address, position_2, branch_id} = req.body;
    try {
      const data = await model.create({
        data: {
          lname,
          fname,
          mname,
          phone,
          address,
          position: {
            connect: {
              id: position_2
            }
          },
          branch: {
            connect: {
              id: branch_id.value
            }
          }
        },
      });

      return res.status(200).json();
    } catch (e: any) {
      console.log(e)
      return res.status(400).send(e.message);
    }
  };
  static update = async (req: Request, res: Response) => {

    
    if(req.body.position_id === NaN){
      delete req.body["position_id"]
    }
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    if(req.body.position_id === NaN){
      delete req.body["position_id"]
    }
    try {
      const { fname, lname, mname, phone, address, position_id } = req.body;
      const updating = await model.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          fname,
          lname,
          mname,
          phone,
          address,
          position_id: position_id ? Number(position_id) : undefined,
        },
      });
      return res.status(200).json(updating);
    } catch (e: any) {
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
export default EmployeeController;
