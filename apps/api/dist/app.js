"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const health_1 = require("./http/routes/health");
const category_repository_1 = require("./modules/categories/category.repository");
const category_service_1 = require("./modules/categories/category.service");
const category_routes_1 = require("./modules/categories/category.routes");
const product_repository_1 = require("./modules/products/product.repository");
const product_service_1 = require("./modules/products/product.service");
const product_routes_1 = require("./modules/products/product.routes");
function buildApp(pool) {
    const app = (0, fastify_1.default)({
        logger: true
    });
    const categoryRepository = new category_repository_1.CategoryRepository(pool);
    const categoryService = new category_service_1.CategoryService(categoryRepository);
    const productRepository = new product_repository_1.ProductRepository(pool);
    const productService = new product_service_1.ProductService(productRepository);
    app.register(async (instance) => {
        await (0, health_1.healthRoutes)(instance, pool);
    });
    app.register(async (instance) => {
        await (0, category_routes_1.categoryRoutes)(instance, categoryService);
    });
    app.register(async (instance) => {
        await (0, product_routes_1.productRoutes)(instance, productService);
    });
    return app;
}
