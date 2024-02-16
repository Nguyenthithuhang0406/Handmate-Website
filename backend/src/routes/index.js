// const {Router} = require('express');
const routes = require("express").Router;

//helpers
const { verifyAccessToken } = require("../helpers-jwt/jwt"); //xac thuc token truy cap tu client

//routes
const { AuthRoute } = require("./auth");
const { ProductRoute } = require("./product");
const { OrderRoute } = require("./order");

// const router = Router(); //tao doi tuong route

routes.get("/", (req, res) => {
  res.end("Hello!");
});

//su dung cac route con
routes.use("/auth", AuthRoute);
routes.use("/product", ProductRoute);
routes.use("/order", verifyAccessToken, OrderRoute);

// //edit
// router.use(
//   "/order",
//   (req, res, next) => {
//     verifyAccessToken(req, res, (err, user) => {
//       if (err) {
//         //xac thuc that bai, tra ve loi
//         return res.status(401).json({ Error: "unauthorized" });
//       }
//       //xac thuc thanh cong, chuyen tiep toi route "/order"
//       next();
//     });
//   },
//   order
// );
// //het

module.exports = routes;
