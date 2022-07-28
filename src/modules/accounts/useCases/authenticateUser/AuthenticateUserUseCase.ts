import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUsersTokenRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    const {
      secretToken,
      expiresInToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;

    if (!user) {
      throw new AppError("Email or Password Incorrect");
    }
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Email or Password Incorrect");
    }

    const token = sign({}, secretToken, {
      subject: user.id,
      expiresIn: expiresInToken,
    });

    const refreshToken = sign(
      {
        email,
      },
      secretRefreshToken,
      {
        subject: user.id,
        expiresIn: expiresInRefreshToken,
      }
    );

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      expiresRefreshTokenDays
    );

    await this.usersTokenRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    });

    const tokenReturn: IResponse = {
      token,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
