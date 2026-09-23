import { Pool } from "pg";

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export class CategoryRepository {
  constructor(private readonly db: Pool) {}

  async findActiveCategories(): Promise<CategoryRecord[]> {
    const result = await this.db.query<CategoryRecord>(
      `
        SELECT
          id,
          name,
          slug,
          is_active AS "isActive"
        FROM categories
        WHERE is_active = true
        ORDER BY name ASC
      `
    );

    return result.rows;
  }
}
