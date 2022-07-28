import { ICreateUsersTokenDTO } from "@modules/accounts/dtos/ICreateUsersTokenDTO";
import { UsersToken } from "@modules/accounts/infra/typeorm/entities/UsersToken";
import { IUsersTokenRepository } from "../IUsersTokenRepository";

class UsersTokenRepositoryInMemory implements IUsersTokenRepository {
  usersTokenRepository: UsersToken[] = [];

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUsersTokenDTO): Promise<UsersToken> {
    const userToken = new UsersToken();

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token,
    });

    this.usersTokenRepository.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersToken> {
    return this.usersTokenRepository.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokenRepository.find(
      (userToken) => userToken.id === id
    );

    this.usersTokenRepository.splice(
      this.usersTokenRepository.indexOf(userToken)
    );
  }

  async findByRefreshToken(token: string): Promise<UsersToken> {
    return this.usersTokenRepository.find(
      (userToken) => userToken.refresh_token === token
    );
  }
}

export { UsersTokenRepositoryInMemory };
