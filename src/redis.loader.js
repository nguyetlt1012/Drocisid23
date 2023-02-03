const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({
    url: redisUrl,
});

function redisLoader() {
    redisClient.on('error', (err) => {
        console.log('Redis client error', err);
    });

    redisClient.connect().then(() => {
        console.log('Redis client connected');
    });
}

module.exports = { redisLoader, redisClient };
