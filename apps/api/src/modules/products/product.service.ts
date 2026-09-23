import {
  ProductRecord,
  ProductRepository
} from "./product.repository";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getActiveProducts(): Promise<ProductRecord[]> {
    return this.repository.findActiveProducts();
  }

  async getActiveProductBySlug(
    slug: string
  ): Promise<ProductRecord | null> {
    return this.repository.findActiveProductBySlug(slug);
  }
}
