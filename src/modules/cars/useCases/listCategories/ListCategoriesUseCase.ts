import { Category } from "@modules/cars/infra/typeorm/entities/Category";
import { ICategoriesReposiory } from "@modules/cars/repositories/ICategoriesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesReposiory
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoriesRepository.list();
  }
}

export { ListCategoriesUseCase };
