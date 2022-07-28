import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListSpecificationsUseCase {
  constructor(
    @inject("SpecificationsRepository")
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute(): Promise<Specification[]> {
    return this.specificationsRepository.list();
  }
}

export { ListSpecificationsUseCase };
