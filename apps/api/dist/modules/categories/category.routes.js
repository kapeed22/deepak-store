"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = categoryRoutes;
async function categoryRoutes(app, service) {
    app.get("/categories", async () => {
        return service.getActiveCategories();
    });
}
