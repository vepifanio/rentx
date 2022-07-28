import auth from "@config/auth";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refreshToken: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokenRepository")
    private usersTokenRepository: IUsersTokenRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;

    const { email, sub: user_id } = verify(
      token,
      secretRefreshToken
    ) as IPayload;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!");
    }

    await this.usersTokenRepository.deleteById(userToken.id);

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      expiresRefreshTokenDays
    );

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: user_id,
      expiresIn: expiresInRefreshToken,
    });

    await this.usersTokenRepository.create({
      user_id,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    });

    const newToken = sign({}, auth.secretToken, {
      subject: user_id,
      expiresIn: auth.expiresInToken,
    });

    return {
      token: newToken,
      refreshToken,
    };
  }
}

export { RefreshTokenUseCase };
