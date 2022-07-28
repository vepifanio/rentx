import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";

class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      body: { name, description },
    } = request;

    const createSpecificationUseCase = container.resolve(
      CreateSpecificationUseCase
    );

    await createSpecificationUseCase.execute({ name, description });

    return response.status(201).send();
  }
}

export { CreateSpecificationController };
