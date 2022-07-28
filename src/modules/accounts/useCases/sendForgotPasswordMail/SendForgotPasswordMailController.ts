import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      body: { email },
    } = request;
    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase
    );

    await sendForgotPasswordMailUseCase.execute(email);

    return response.send();
  }
}

export { SendForgotPasswordMailController };
