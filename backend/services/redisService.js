const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient = null;
let isConnecting = false;

async function getRedisClient() {
    if (redisClient?.isOpen) {
        return redisClient;
    }

    if (isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getRedisClient();
    }

    isConnecting = true;

    redisClient = createClient({
        url: REDIS_URL
    });

    redisClient.on("error", (error) => {
        console.error("Redis bağlantı hatası:", error.message);
    });

    redisClient.on("connect", () => {
        console.log("Redis bağlantısı kuruluyor...");
    });

    redisClient.on("ready", () => {
        console.log("Redis bağlantısı hazır.");
    });

    redisClient.on("end", () => {
        console.log("Redis bağlantısı kapandı.");
    });

    try {
        await redisClient.connect();
        return redisClient;
    } finally {
        isConnecting = false;
    }
}

async function getCache(key) {
    try {
        const client = await getRedisClient();
        const value = await client.get(key);

        if (!value) {
            console.log("Redis cache MISS:", key);
            return null;
        }

        console.log("Redis cache HIT:", key);
        return JSON.parse(value);
    } catch (error) {
        console.error("Redis getCache hatası:", error.message);
        return null;
    }
}

async function setCache(key, value, ttlSeconds = 900) {
    try {
        const client = await getRedisClient();

        await client.set(key, JSON.stringify(value), {
            EX: ttlSeconds
        });

        console.log("Redis cache SET:", key, "TTL:", ttlSeconds);
    } catch (error) {
        console.error("Redis setCache hatası:", error.message);
    }
}

module.exports = {
    getCache,
    setCache
};