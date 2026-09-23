import { FastifyInstance } from "fastify";
import { ProductService } from "./product.service";

export async function productRoutes(
  app: FastifyInstance,
  service: ProductService
): Promise<void> {
  app.get("/products", async () => {
    return service.getActiveProducts();
  });

  app.get<{ Params: { slug: string } }>(
    "/products/:slug",
    async (request, reply) => {
      const product = await service.getActiveProductBySlug(
        request.params.slug
      );

      if (!product) {
        return reply.status(404).send({
          error: "PRODUCT_NOT_FOUND"
        });
      }

      return product;
    }
  );
}
