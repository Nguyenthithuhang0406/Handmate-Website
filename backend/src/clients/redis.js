const Redis = require('ioredis');
//tao doi tuong redis client
const redis = new Redis();

//edit
//kiem tra ket noi redis
redis.on('connect', () => {
    console.log('connect to redis!');
});

//xu ly loi khi ket noi redis that bai
redis.on('err', (err) => {
    console.error("redis connection error:", err);
});
//het

module.exports = {redis};