import { ICreateUsersTokenDTO } from "@modules/accounts/dtos/ICreateUsersTokenDTO";
import { IUsersTokenRepository } from "@modules/accounts/repositories/IUsersTokenRepository";
import { getRepository, Repository } from "typeorm";
import { UsersToken } from "../entities/UsersToken";

class UsersTokenRepository implements IUsersTokenRepository {
  private repository: Repository<UsersToken>;

  constructor() {
    this.repository = getRepository(UsersToken);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUsersTokenDTO): Promise<UsersToken> {
    const userToken = await this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersToken> {
    return this.repository.findOne({ user_id, refresh_token });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRefreshToken(token: string): Promise<UsersToken> {
    return this.repository.findOne({ refresh_token: token });
  }
}

export { UsersTokenRepository };
