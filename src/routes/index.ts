import { Router } from "express";
import users from "./users";
import representative from "./representative";
import items from "./items";
import brands from "./brands";
import category from "./category";
import storageLocation from "./storageLocation";
import company from "./company";
import po_requests from "./po-requests";
import employee from "./employee";
import position from "./position";
import menuitem from "./menuItem";
import menuitemcategory from "./menuItemCategory";
import itemTransaction from "./itemTransaction";
import auth from "./auth";
import overview from "./overview";
import passport from "passport";
import customer from "./customer";
import order from "./order";
import transaction from "./transaction";
import menuitemstock from "./menuItemStock";
import invoice from "./invoice";
import table from "./table";
import branch from "./branch";
import equipmentItem from "./equipmentItem"
import equipmentItemCategory from "./equipmentItemCategory"
import pullOut from "./pullOut"

const routes = Router();
routes.use("/auth", auth);
routes.use(
  "/overview",
  passport.authenticate("jwt", { session: false }),
  overview
);
routes.use("/users", passport.authenticate("jwt", { session: false }), users);
routes.use(
  "/representative",
  passport.authenticate("jwt", { session: false }),
  representative
);
routes.use("/items", passport.authenticate("jwt", { session: false }), items);
routes.use("/brands", passport.authenticate("jwt", { session: false }), brands);
routes.use(
  "/category",
  passport.authenticate("jwt", { session: false }),
  category
);
routes.use(
  "/storage",
  passport.authenticate("jwt", { session: false }),
  storageLocation
);
routes.use(
  "/company",
  passport.authenticate("jwt", { session: false }),
  company
);
routes.use(
  "/po-requests",
  passport.authenticate("jwt", { session: false }),
  po_requests
);
routes.use(
  "/position",
  passport.authenticate("jwt", { session: false }),
  position
);
routes.use(
  "/employee",
  passport.authenticate("jwt", { session: false }),
  employee
);
routes.use(
  "/customer",
  customer
);
routes.use("/order", passport.authenticate("jwt", { session: false }), order);
routes.use(
  "/transaction",
  passport.authenticate("jwt", { session: false }),
  transaction
);
routes.use(
  "/menu-item",
  passport.authenticate("jwt", { session: false }),
  menuitem
);
routes.use(
  "/menu-item-category",
  passport.authenticate("jwt", { session: false }),
  menuitemcategory
);
routes.use(
  "/item-transaction",
  passport.authenticate("jwt", { session: false }),
  itemTransaction
);

routes.use(
  "/menu-item-stock",
  passport.authenticate("jwt", { session: false }),
  menuitemstock
);
routes.use(
  "/invoices",
  passport.authenticate("jwt", { session: false }),
  invoice
);
routes.use("/tables", passport.authenticate("jwt", { session: false }), table);

routes.use(
  "/branch",
  passport.authenticate("jwt", { session: false }),
  branch
);

routes.use(
  "/equipment-item",
  passport.authenticate("jwt", { session: false }),
  equipmentItem
);

routes.use(
  "/equipment-item-category",
  passport.authenticate("jwt", { session: false }),
  equipmentItemCategory
);

routes.use(
  "/pull-out",
  passport.authenticate("jwt", { session: false }),
  pullOut
);

export default routes;
