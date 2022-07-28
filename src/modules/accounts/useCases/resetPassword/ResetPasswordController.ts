import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      body: { password },
      query: { token },
    } = request;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute({ token: String(token), password });

    return response.send();
  }
}

export { ResetPasswordController };
