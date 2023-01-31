const { createClient } = require('redis');

const redisClient = createClient();

function redisLoader() {
    redisClient.on('error', (err) => {
        console.log('Redis client error', err);
    });

    redisClient.connect().then(() => {
        console.log('Redis client connected');
    });
}

module.exports = { redisLoader, redisClient };
