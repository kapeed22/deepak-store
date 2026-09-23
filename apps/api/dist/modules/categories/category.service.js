"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
class CategoryService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getActiveCategories() {
        return this.repository.findActiveCategories();
    }
}
exports.CategoryService = CategoryService;
