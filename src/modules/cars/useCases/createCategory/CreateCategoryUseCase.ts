import { AppError } from "@shared/errors/AppError";
import { ICategoriesReposiory } from "@modules/cars/repositories/ICategoriesRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesReposiory
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );

    if (categoryAlreadyExists) {
      throw new AppError("Category Already exists!");
    }

    await this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
