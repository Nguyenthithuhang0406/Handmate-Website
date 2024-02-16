const OrderRoute = require('express').Router;

const { Create, List, GetMyOrders } = require("../controllers/order/index");

OrderRoute.post("/", Create);
OrderRoute.get("/", List);
OrderRoute.get("/my-orders", GetMyOrders);

module.exports = OrderRoute;
