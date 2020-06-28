// Model
import { Shop } from "../model/shopModel";

// Factory Handler
import {
  createDocument,
  updateDocumentByID,
  deleteDocument,
  readAllDocument,
  readDocumentByID,
} from "./../handlers/factoryHandler";

// Stats
import { getCollectionStatistics } from "./../handlers/statsHandler";

import { processDataWithMultipleImage } from "./../middleware/imageProcessing";

// Protect Routes
export { protectRoute, restrictRoute } from "./userController";

// Middleware
export const productData = processDataWithMultipleImage(
  "productImages",
  "mongoshopproducts",
  3
);
export const addNewProduct = createDocument(Shop, {
  message: "New Product Added",
});

export const getProducts = readAllDocument(Shop, {
  message: "List Of Car Parts",
});

export const getProduct = readDocumentByID(
  Shop,
  {
    message: "Requested Product",
  },
  ["+productDetails", "+productBy"]
);

export const updateProduct = updateDocumentByID(Shop, {
  message: "Product Details Updated",
});

export const deleteProduct = deleteDocument(Shop, {
  message: "Product Deleted",
});

export const getShopStats = getCollectionStatistics(
  Shop,
  {
    productQuantity: { $gte: 1 },
  },
  {
    _id: { $toUpper: "$productCategory" },
    NoOfParts: { $sum: "$productQuantity" },
    PartPriceAvg: { $avg: "$partPrice" },
    PartPriceMin: { $min: "$partPrice" },
    PartPriceMax: { $max: "$partPrice" },
  }
);
