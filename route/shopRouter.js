import { Router } from "express";

import {
  addNewProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getShopStats,
  getProduct,
  addProductImage,

  // Protect Routes
  protectRoute,
  restrictRoute,

  //middleware
  productData,
  checkPartsExist,
} from "./../controller/shopCarPartsController";

export const shopRouter = Router();

shopRouter
  .route("/addNewProduct")
  .post(
    protectRoute,
    restrictRoute("admin", "employee"),
    productData,
    addNewProduct
  );

shopRouter.route("/viewProducts").get(getProducts);

shopRouter.route("/viewProduct/:id").get(getProduct);

shopRouter
  .route("/updateProduct/:id")
  .patch(protectRoute, restrictRoute("admin", "employee"), updateProduct);

shopRouter
  .route("/deleteProduct/:id")
  .delete(protectRoute, restrictRoute("admin", "employee"), deleteProduct);

shopRouter.route("/getShopStats").get(getShopStats);
