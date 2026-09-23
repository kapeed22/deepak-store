import Fastify from "fastify";
import { Pool } from "pg";
import { healthRoutes } from "./http/routes/health";

export function buildApp(pool: Pool) {
  const app = Fastify({
    logger: true
  });

  app.register(async (instance) => {
    await healthRoutes(instance, pool);
  });

  return app;
}
