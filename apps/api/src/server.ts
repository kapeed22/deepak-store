import { env } from "./config/env";
import { pool } from "./db/pool";
import { buildApp } from "./app";

async function start(): Promise<void> {
  const app = buildApp(pool);

  try {
    await app.listen({
      host: env.host,
      port: env.port
    });
  } catch (error) {
    app.log.error(error);
    await pool.end();
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}. Shutting down...`);

    await app.close();
    await pool.end();

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
