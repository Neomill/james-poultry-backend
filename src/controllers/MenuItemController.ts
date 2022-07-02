import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { TAKE } from "../lib/constants";
import prisma from "../lib/prisma";
import { unlink } from "fs/promises";
const model = prisma.menuItem;
const dummyImage = "http://loremflickr.com/640/480/food";


class MenuItemController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let [data, totalData] = await prisma.$transaction([
        model.findMany({
          include: {
            menu_item_category: {
              select: {
                name: true,
              },
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
      query = "",
      page = 0,
      createdAt,
      updatedAt = 1,
      menu_item_category,
      name,
      id,
      qty,
      price,
    } = req.query;
    const authUser: any = req.user;
  
    const filters: any = [];
    const notThis: any = [];

    notThis.push({
      qty: {
        lte: 0
      }
    });

    menu_item_category &&
      filters.push({
        menu_item_category: {
          id: Number(menu_item_category),
        },
      });

      filters.push({
        branch_id: Number(authUser.employee.branch_id),
      });

    let where: any = {
      OR: [
        {
          name: {
            contains: query + "",
          },
        },
      ],
      AND: filters,
      NOT: notThis,
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
    } else if (price) {
      Object.assign(orderBy, {
        cost_price: Number(price) ? "desc" : "asc",
      });
    } else if (qty) {
      Object.assign(orderBy, {
        qty: Number(qty) ? "desc" : "asc",
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
            orders: {
              select: {
                id: true,
              },
            },
            // branch:{
            //   select:{
            //     name:true
            //   }
            // },
            menu_item_category: {
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
      console.log(e)
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
          orders: {
            select: {
              id: true,
            },
          },
          menu_item_category: {
            select: {
              name: true,
            },
          },

          menu_item_stock: true,
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
    const {
      name,
      desc,
      menu_category_name,
      menu_item_category_id,
      cost_price,
      selling_price,
      expiry_date,
      branch_id,
      qty,
    } = req.body;
    const authUser: any = req.user;

    console.log(req.body)
    try {

      let data: any = {
        name,
        desc,
        cost_price: Number(cost_price),
        selling_price: Number(selling_price),
        qty: Number(qty),
      };

      if (branch_id) {
        Object.assign(data, {
          branch: {
            connect: {
              id: Number(branch_id),
            },
          },
        });
      }

      if (menu_item_category_id) {
        Object.assign(data, {
          menu_item_category: {
            connect: {
              id: Number(menu_item_category_id),
            },
          },
        });
      } else {
        Object.assign(data, {
          menu_item_category: {
            create: {
              name: menu_category_name,
            },
          },
        });
      }

      const transaction = await model.create({
        data: {
          ...data,
          menu_item_stock: {
            create: {
              qty: Number(qty),
              // expiry_date,
            },
          },
        },
      });

      return res.status(200).send(transaction);
    } catch (error: any) {
      console.log(error)
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
        };
        return mod;
      });

      for (const u of sanitizedData) {
        // auto add menuItemStock on menuItem on create many
        u.menu_item_stock = {
          create: {
            qty: Number(u.qty),
            expiry_date: u.expiry_date,
          },
        };

        await model.create({
          data: u,
        });
      }
      return res.status(200).send("Success");
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };

  static updateImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!process.env.API_URL) {
      return res.status(400).json("Please add an API_URL to your env");
    }

    const API_URL = process.env.API_URL;
    
    // line 275:276 added for image url encoding
    const rawUrl: string = API_URL + req.file?.filename    
    const encodedImgUrlBToA = Buffer.from(rawUrl).toString('base64')

    try {
      const originData = await model.findFirst({
        where: {
          id: Number(req.params.id),
        },
      });

      // get image url that needs to unlink(delete)
      let imgUrl = originData?.image_url
      
      // if image url is empty just add the encoded imgUrl to database
      if (imgUrl == null) {
        const data = await model.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            image_url: encodedImgUrlBToA,
          },
        });
      } 
      // else if imgUrl is not empty check if it contains dummy image url
      // no need to delete dummy image url this is stored somewhere in the internet
      else {
        if (imgUrl != dummyImage) {
          //if imgUrl is encoded to base64, decode imgUrl before unlink(delete)
          let base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
          if(imgUrl.match(base64Pattern)){
            let bufferObj = Buffer.from(imgUrl, "base64")
            imgUrl = bufferObj.toString('utf-8')
          }

          const imgToDelete = imgUrl.replace(
            API_URL,
            "public/"
          );

          try {
            if (imgToDelete) await unlink(imgToDelete);
          } catch (error) {}
        }
        await model.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            image_url: encodedImgUrlBToA,  
          },
        });
      }

      return res.status(200).send(req.file);
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
      const data = await model.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
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

      const API_URL = process.env.API_URL + "";
      // get image url that needs to unlink(delete)
      let imgUrl = data?.image_url || "";
      // if image url is not null and not a dummy url, check if img url is 
      // encoded to base64 if true decode first before replace and unlink
      if (imgUrl != null && imgUrl != dummyImage) {
        let base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
        if(imgUrl.match(base64Pattern)){
          let bufferObj = Buffer.from(imgUrl, "base64")
          imgUrl = bufferObj.toString('utf-8')
        }

        const imgToDelete = imgUrl.replace(
          API_URL,
          "public/"
        );
        
        const linkedImage = imgToDelete.replace(API_URL, "public/");
        try {
          if (linkedImage) await unlink(linkedImage);
        } catch (error) {}
      }

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
    const qty = req.body.qty;
    const expiry_date = req.body.expiry_date;

    try {
      const data = await model.update({
        where: {
          id: Number(id),
        },
        data: {
          qty: {
            increment: qty,
          },
          menu_item_stock: {
            create: {
              qty: Number(qty),
              expiry_date: expiry_date,
            },
          },
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
      const API_URL = process.env.API_URL + "";
      const array = req.body;
      let data = [];
      for (let i = 0; i < array.length; i++) {
        data.push(
          await model.delete({
            where: {
              id: array[i],
            },
          })
        );

        let imgUrl = data[i]?.image_url;

        if (imgUrl != null && imgUrl != dummyImage) {
          let base64Pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
          if(imgUrl.match(base64Pattern)){
            let bufferObj = Buffer.from(imgUrl, "base64")
            imgUrl = bufferObj.toString('utf-8')
          }
          
          const linkedImage = imgUrl.replace(API_URL, "public/");
          try {
            if (linkedImage) await unlink(linkedImage);
          } catch (error) {}
        }
      }
      return res.status(200).send(data);
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}

export default MenuItemController;
