import { Request, Response } from "express";
import { container } from "tsyringe";
import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);

    const {
      params: { id },
      user: { id: user_id },
    } = request;

    const rental = await devolutionRentalUseCase.execute({ id, user_id });

    return response.json(rental);
  }
}

export { DevolutionRentalController };
