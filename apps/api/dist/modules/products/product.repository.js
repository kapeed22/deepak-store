"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findActiveProducts() {
        const result = await this.db.query(`
        SELECT
          p.id,
          p.category_id AS "categoryId",
          c.name AS "categoryName",
          p.name,
          p.slug,
          p.description,
          p.price::text AS price,
          p.is_active AS "isActive"
        FROM products p
        INNER JOIN categories c
          ON c.id = p.category_id
        WHERE p.is_active = true
          AND c.is_active = true
        ORDER BY p.name ASC
      `);
        return result.rows;
    }
    async findActiveProductBySlug(slug) {
        const result = await this.db.query(`
        SELECT
          p.id,
          p.category_id AS "categoryId",
          c.name AS "categoryName",
          p.name,
          p.slug,
          p.description,
          p.price::text AS price,
          p.is_active AS "isActive"
        FROM products p
        INNER JOIN categories c
          ON c.id = p.category_id
        WHERE p.slug = $1
          AND p.is_active = true
          AND c.is_active = true
        LIMIT 1
      `, [slug]);
        return result.rows[0] ?? null;
    }
}
exports.ProductRepository = ProductRepository;
