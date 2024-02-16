//tao middleware gioi han toc do cho express.js, sd redis lam noi luu tru thong tin gioi han toc do
const {RateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const redis = require('./redis');
const Boom = require('boom');

// //edit
// //tao doi tuong redis client
// const redisClient = redis.createClient();

// //kiem tra ket noi redis
// redisClient.on('connect', () => {
//     console.log('connect to redis!');
// });

// //xu ly khi ket noi that bai
// redisClient.on('error', (err) => {
//     console.error('redis connection error:', err);
// });
// //het

const limiter = new RateLimit({
    store: new RedisStore({
        client: redis,
        resetExpiryOnChange: true, //thiet lap lai thoi gian song khi thongtin gioi han toc do thay doi
        expiry: 30, //thoi gian song cua thongo tin gioi han toc do
    }),
    max: 1000, //so luong yeu cau toi da trong khoang thoi gian gioi han
    //ham xu ly khi so luong yeu cau vuot qua gioi han
    handler: (req, res, next) => {
        next(Boom.tooManyRequests()); //tao loi 429
    },
});

module.exports = {limiter};
