"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
class CategoryRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findActiveCategories() {
        const result = await this.db.query(`
        SELECT
          id,
          name,
          slug,
          is_active AS "isActive"
        FROM categories
        WHERE is_active = true
        ORDER BY name ASC
      `);
        return result.rows;
    }
}
exports.CategoryRepository = CategoryRepository;
