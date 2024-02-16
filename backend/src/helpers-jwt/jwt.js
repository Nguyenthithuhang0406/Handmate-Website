//xác thực và tạo token JWT trong ứng dụng
const JWT = require('jsonwebtoken');
const Boom = require('boom');

const redis = require('../clients/redis');

//tạo access Token (JWT) từ dữ liệu vào(data)
const signAccessToken = (data) => {
  return new Promise((resolve, reject) => {
    //payload là đối tượng chứa dữ liệu đưa vào token
    const payload = {
      ...data,
    };

    //option là các tuỳ chọn cho việc tạo token
    const options = {
      expiresIn: "10d", //thời gian sống
      issuer: "handmate.app", //người tạo token
    };

    //sử dụng JWT để ký và tạo token, trả về promise, resolve nếu thành công, reject nếu có lỗi
    JWT.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      if (err) {
        console.error(err);
        reject(Boom.internal());
      }
      resolve(token);
    });
  });
};

//middleware để xác thực accessToken
const verifyAccessToken = (req, res, next) => {
  //kiểm tra xem có tồn tại trong header "authorization" hay không
  const authorizationToken = req.headers["authorization"];
  if (!authorizationToken) {
    return next(Boom.unauthorized());
  }

  //sử dụng thư viện jsonwebtoken để xác thực token
  //nếu không hợp lệ , middleware trả về lỗi "Boom.unauthorization"
  JWT.verify(authorizationToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(
        Boom.unauthorized(
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
        )
      );
    }

    //nếu token hợp lệ, dễ liệu payload vaò req  và chuyển sang middleware tiếp theo
    req.payload = payload;
    next();
  });
};

//tạo refresh token  (JWT) cho user đó
const signRefreshToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = { user_id };
    const options = {
      expiresIn: "180d",
      issuer: "handmate.app",
    };

    JWT.sign(payload, process.env.JWT_REFRESH_SECRET, options, (err, token) => {
      if (err) {
        console.log(err);
        reject(Boom.internal());
      }

      //tạo thành công thì lưu token trong Redis với thời gian sống là 180 ngày
      redis.set(user_id, token, "EX", 180 * 24 * 60 * 60);

      resolve(token);
    });
  });
};

//xác thực refresh Token
const verifyRefreshToken = async (refresh_token) => {
  return new Promise(async (resolve, reject) => {
    JWT.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET,
      async (err, payload) => {
        if (err) {
          return reject(Boom.unauthorized());
        }

        const { user_id } = payload;
        const user_token = await redis.get(user_id);

        if (!user_token || refresh_token !== user_token) {
          return reject(Boom.unauthorized());
        }

        if (refresh_token === user_token) {
          return resolve(user_id);
        }
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
