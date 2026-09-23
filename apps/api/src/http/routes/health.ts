import { FastifyInstance } from "fastify";
import { Pool } from "pg";

export async function healthRoutes(
  app: FastifyInstance,
  pool: Pool
): Promise<void> {
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
    } catch {
      return reply.status(503).send({
        status: "not_ready",
        database: "unavailable"
      });
    }
  });
}
