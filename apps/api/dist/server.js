"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const pool_1 = require("./db/pool");
const app_1 = require("./app");
async function start() {
    const app = (0, app_1.buildApp)(pool_1.pool);
    try {
        await app.listen({
            host: env_1.env.host,
            port: env_1.env.port
        });
    }
    catch (error) {
        app.log.error(error);
        await pool_1.pool.end();
        process.exit(1);
    }
    const shutdown = async (signal) => {
        app.log.info(`Received ${signal}. Shutting down...`);
        await app.close();
        await pool_1.pool.end();
        process.exit(0);
    };
    process.on("SIGTERM", () => {
        void shutdown("SIGTERM");
    });
    process.on("SIGINT", () => {
        void shutdown("SIGINT");
    });
}
void start();
