import { Pool } from "pg";

export interface ProductRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  isActive: boolean;
}

export class ProductRepository {
  constructor(private readonly db: Pool) {}

  async findActiveProducts(): Promise<ProductRecord[]> {
    const result = await this.db.query<ProductRecord>(
      `
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
      `
    );

    return result.rows;
  }

  async findActiveProductBySlug(
    slug: string
  ): Promise<ProductRecord | null> {
    const result = await this.db.query<ProductRecord>(
      `
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
      `,
      [slug]
    );

    return result.rows[0] ?? null;
  }
}
