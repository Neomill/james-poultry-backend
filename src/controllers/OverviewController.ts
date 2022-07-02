import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

class OverviewController {
  static index = async (req: Request, res: Response, next: NextFunction) => {
    const authUser: any = req.user;
    try {
      let [
        totalItems,

        totalNoOfPurchase,
        totalPullout,
        totalCustomers,
        totalSuppliers,
        totalAggregateRevenue,
        menuItems,
        totalTransactions,
        totalequipment,
        totalequipmentSum,
      ] = await prisma.$transaction([
        prisma.menuItem.count(

        ),
        prisma.transaction.findMany({
          where:{
            branch_id : Number(authUser?.employee?.branch_id)
          }
        }),
        prisma.pO_Request.count(),
        prisma.customer.count(),
        prisma.branch.count(),
        prisma.transaction.aggregate({
          where:{
            branch_id : Number(authUser?.employee?.branch_id)
          },
          _sum: {
            price: true,
          },
        }),
        prisma.menuItem.findMany({
          where:{
            branch_id : Number(authUser?.employee?.branch_id)
          },
          select: {
            cost_price: true,
            qty: true,
          },
        }),
        prisma.transaction.count(
        ),
        prisma.equipment.findMany(
          {   
            where:{
              branch_id : Number(authUser?.employee?.branch_id)
            },
          }
        ),
        prisma.equipment.aggregate({
          where:{
            branch_id : Number(authUser?.employee?.branch_id)
          },
          _sum: {
            cost_price: true,
          },
        }),
      ]);
      let totalequipmentitems = totalequipment.length 
      const totalCost = menuItems.reduce(
        (partialSum, menuItem) =>
          partialSum + Number(menuItem.cost_price) * Number(menuItem.qty),
        0
      );
      const totalRevenue = totalAggregateRevenue._sum.price;
      const totalProfit = Number(totalRevenue) - Number(totalCost);
      return res.status(200).send({
        totalItems,
        totalNoOfPurchase,
        totalPullout,
        totalCustomers,
        totalSuppliers,
        totalRevenue,
        totalCost,
        totalProfit,
        totalTransactions,
        totalequipment,
        totalequipmentitems,
        totalequipmentSum
      });
    } catch (error: any) {
      return res.status(404).send(error.message);
    }
  };
}

export default OverviewController;
