function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

export const env = {
  port,
  host: process.env.HOST ?? "0.0.0.0",
  databaseUrl: requireEnv("DATABASE_URL")
};
