import { FastifyInstance } from "fastify";
import { CategoryService } from "./category.service";

export async function categoryRoutes(
  app: FastifyInstance,
  service: CategoryService
): Promise<void> {
  app.get("/categories", async () => {
    return service.getActiveCategories();
  });
}
