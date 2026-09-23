"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = productRoutes;
async function productRoutes(app, service) {
    app.get("/products", async () => {
        return service.getActiveProducts();
    });
    app.get("/products/:slug", async (request, reply) => {
        const product = await service.getActiveProductBySlug(request.params.slug);
        if (!product) {
            return reply.status(404).send({
                error: "PRODUCT_NOT_FOUND"
            });
        }
        return product;
    });
}
