"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
async function healthRoutes(app, pool) {
    app.get("/health", async () => {
        return {
            status: "ok"
        };
    });
    app.get("/ready", async (_request, reply) => {
        try {
            await pool.query("SELECT 1");
            return {
                status: "ready",
                database: "ok"
            };
        }
        catch {
            return reply.status(503).send({
                status: "not_ready",
                database: "unavailable"
            });
        }
    });
}
