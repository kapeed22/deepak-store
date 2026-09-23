import {
  CategoryRecord,
  CategoryRepository
} from "./category.repository";

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getActiveCategories(): Promise<CategoryRecord[]> {
    return this.repository.findActiveCategories();
  }
}
