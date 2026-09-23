"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getActiveProducts() {
        return this.repository.findActiveProducts();
    }
    async getActiveProductBySlug(slug) {
        return this.repository.findActiveProductBySlug(slug);
    }
}
exports.ProductService = ProductService;
