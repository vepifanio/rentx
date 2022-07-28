import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

class CreateCarSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      params: { id: car_id },
      body: { specifications_ids },
    } = request;

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase
    );

    const specificationsCar = await createCarSpecificationUseCase.execute({
      car_id,
      specifications_ids,
    });

    return response.json(specificationsCar);
  }
}

export { CreateCarSpecificationController };
