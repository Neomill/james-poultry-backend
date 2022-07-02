import cron from "node-cron";
import prisma from "./prisma";
// 6 hrs = 0 0 */6 * * *4
const cronJob = () =>
  cron.schedule("* * * * *", async () => {
    const itemTransactions = await prisma.itemTransaction.findMany({
      where: {
        AND: [
          {
            expiry_date: {
              lte: new Date(),
            },
          },
          {
            OR: [
              {
                condition: {
                  not: "EXPIRED",
                },
              },
              {
                qty: {
                  gt: 0,
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        qty: true,
      },
    });
    if (itemTransactions.length > 0) {
      const itemTransactionIdsToUpdate = itemTransactions.map(
        (itemTransaction) => itemTransaction.id
      );
      // const poRequestToSubmit: Prisma.PO_RequestCreateManyInput[] = items.map(
      //   (item) => ({
      //     remarks: "Expired Item",
      //     reason: "EXPIRED",
      //     request_no: faker.phone.phoneNumber(
      //       "POR-###-####" + `-${item.id}${new Date().getTime()}`
      //     ),
      //     qty: item.qty,
      //     item_id: Number(item.id),
      //     attendant_id: Number(1),
      //   })
      // );
      if (itemTransactionIdsToUpdate.length > 0) {
        try {
          await prisma.$transaction([
            // prisma.pO_Request.createMany({
            //   data: poRequestToSubmit,
            // }),
            prisma.itemTransaction.updateMany({
              where: {
                AND: [
                  {
                    id: {
                      in: itemTransactionIdsToUpdate,
                    },
                  },
                ],
              },
              data: {
                condition: "EXPIRED",
              },
            }),
          ]);
        } catch (error: any) {}
      }
    }

    // ----------------

    // const items = await prisma.item.findMany({
    //   where: {
    //     AND: [
    //       {
    //         item_transactions: {
    //           some: {
    //             expiry_date: {
    //               lte: new Date(),
    //             },
    //           },
    //         },
    //       },
    //       {
    //         OR: [
    //           {
    //             condition: {
    //               not: "EXPIRED",
    //             },
    //           },
    //           {
    //             qty: {
    //               gt: 0,
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   select: {
    //     id: true,
    //     qty: true,
    //   },
    // });
    // if (items.length > 0) {
    //   const itemIdsToUpdate = items.map((item) => item.id);
    //   // const poRequestToSubmit: Prisma.PO_RequestCreateManyInput[] = items.map(
    //   //   (item) => ({
    //   //     remarks: "Expired Item",
    //   //     reason: "EXPIRED",
    //   //     request_no: faker.phone.phoneNumber(
    //   //       "POR-###-####" + `-${item.id}${new Date().getTime()}`
    //   //     ),
    //   //     qty: item.qty,
    //   //     item_id: Number(item.id),
    //   //     attendant_id: Number(1),
    //   //   })
    //   // );
    //   if (itemIdsToUpdate.length > 0) {
    //     try {
    //       await prisma.$transaction([
    //         // prisma.pO_Request.createMany({
    //         //   data: poRequestToSubmit,
    //         // }),
    //         prisma.item.updateMany({
    //           where: {
    //             AND: [
    //               {
    //                 id: {
    //                   in: itemIdsToUpdate,
    //                 },
    //               },
    //             ],
    //           },
    //           data: {
    //             condition: "EXPIRED",
    //           },
    //         }),
    //       ]);
    //     } catch (error: any) {}
    //   }
    // }
  });

export default cronJob;
