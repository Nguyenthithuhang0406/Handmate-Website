//tao mot middleware cache cho ung dung express, su dung redis lam noi luu tru cache
const {expressRedisCache} = require('express-redis-cache');
const {redis} = require("./redis");
 
//bat dau edit
//tao doi tuong redis client
const redisClient = redis.createClient();

//kiem tra ket noi redis
redisClient.on('connect', () => {
    console.log('connected to redis');
});

//xu ly loi khi ket noi redis that bai
redisClient.on('error', (err) => {
    console.error('redis connection error:', err);
});
//het

//tao middleware cache
const cache = expressRedisCache({
    client: redis, // doi tuong redis client da duoc tao (redis)
    expire: 60,    //thoi gian song
});

module.exports = {cache};