import { Request, Response } from "express";
import { container } from "tsyringe";
import { ProfileUserUseCase } from "./ProfileUserUseCase";

class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      user: { id },
    } = request;

    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const userInfo = await profileUserUseCase.execute(id);

    return response.json(userInfo);
  }
}

export { ProfileUserController };
