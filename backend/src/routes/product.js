const ProductRoute = require('express').Router;

const {
  Create,
  Get,
  GetList,
  Update,
  Delete,
} = require("../controllers/product/index");

const { grantAccess } = require("../middlewares/grantAccess");
const { verifyAccessToken } = require("../helpers-jwt/jwt");

//truoc khi thuc hien can kiem tra va xac thuc token truy cap va kiem tra quyen truy cap (tao mot hanh dong moi) doi voi doi tuong product
ProductRoute.post(
  "/",
  verifyAccessToken,
  grantAccess("createAny", "product"),
  Create
);
ProductRoute.get("/:product_id", Get);

ProductRoute.get("/", GetList);
ProductRoute.put(
  "/:product_id",
  verifyAccessToken,
  grantAccess("updateAny", "product"),
  Update
);
ProductRoute.delete(
  "/:product_id",
  verifyAccessToken,
  grantAccess("deleteAny", "product"),
  Delete
);

module.exports = ProductRoute;
