const multer = require("multer");
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const uploadImage = (path: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
      ) {
        callback(null, "public/");
      },
      filename: function (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
      ) {
        const guid = uuidv4();
        callback(null, path + "/" + guid + "." + file.mimetype.split("/")[1]);
      },
    }),
  }).single("image");

export default uploadImage;
