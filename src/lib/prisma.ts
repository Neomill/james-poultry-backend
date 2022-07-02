import { PrismaClient } from "@prisma/client";
import itemMiddleware from "./prismaMiddlewares/itemMiddleware";
import itemStockMiddleware from "./prismaMiddlewares/itemStockMiddleware";
import menuItemMiddleware from "./prismaMiddlewares/menuItemMiddleware";
import poRequestMiddleware from "./prismaMiddlewares/poRequestMiddleware";
import equipmentItemMiddleware from "./prismaMiddlewares/equipmentItemMiddleware";
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({});
  }
  prisma = globalWithPrisma.prisma;
}

prisma.$use(async (params, next) => poRequestMiddleware(params, next));
prisma.$use(async (params, next) => itemMiddleware(params, next));
prisma.$use(async (params, next) => itemStockMiddleware(params, next));
prisma.$use(async (params, next) => menuItemMiddleware(params, next));
prisma.$use(async (params, next) => equipmentItemMiddleware(params, next));

export default prisma;
