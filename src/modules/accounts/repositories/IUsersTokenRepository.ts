import { ICreateUsersTokenDTO } from "../dtos/ICreateUsersTokenDTO";
import { UsersToken } from "../infra/typeorm/entities/UsersToken";

interface IUsersTokenRepository {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUsersTokenDTO): Promise<UsersToken>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersToken>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(token: string): Promise<UsersToken>;
}

export { IUsersTokenRepository };
