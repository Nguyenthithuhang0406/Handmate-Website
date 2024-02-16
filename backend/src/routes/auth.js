//xac thuc va quan li nguoi dung
const AuthRoute= require('express').Router;

const { verifyAccessToken } = require("../helpers-jwt/jwt");
const {
  Register,
  Login,
  RefreshToken,
  Logout,
  Me,
} = require("../controllers/auth/index");

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);
AuthRoute.post("/refresh_token", RefreshToken);
AuthRoute.post("/logout", Logout);
AuthRoute.get("/me", verifyAccessToken, Me);

module.exports = AuthRoute;
