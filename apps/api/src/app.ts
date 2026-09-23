import Fastify from "fastify";
import { Pool } from "pg";

import { healthRoutes } from "./http/routes/health";
import { CategoryRepository } from "./modules/categories/category.repository";
import { CategoryService } from "./modules/categories/category.service";
import { categoryRoutes } from "./modules/categories/category.routes";

export function buildApp(pool: Pool) {
  const app = Fastify({
    logger: true
  });

  const categoryRepository = new CategoryRepository(pool);
  const categoryService = new CategoryService(categoryRepository);

  app.register(async (instance) => {
    await healthRoutes(instance, pool);
  });

  app.register(async (instance) => {
    await categoryRoutes(instance, categoryService);
  });

  return app;
}
