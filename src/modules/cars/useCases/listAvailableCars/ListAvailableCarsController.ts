import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      query: { name, brand, category_id },
    } = request;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );

    const availableCars = await listAvailableCarsUseCase.execute({
      name: name as string,
      brand: brand as string,
      category_id: category_id as string,
    });

    return response.json(availableCars);
  }
}

export { ListAvailableCarsController };
