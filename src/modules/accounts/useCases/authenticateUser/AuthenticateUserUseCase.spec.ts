import { AppError } from "@shared/errors/AppError";
import { ICreateUsersDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate a existent user", async () => {
    const user: ICreateUsersDTO = {
      driver_license: "123",
      email: "teste@test.com",
      password: "1234",
      name: "Test User",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate an non-existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "1234",
      })
    ).rejects.toEqual(new AppError("Email or Password Incorrect"));
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const user: ICreateUsersDTO = {
      driver_license: "123",
      email: "teste@test.com",
      password: "1234",
      name: "Test User",
    };

    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password",
      })
    ).rejects.toEqual(new AppError("Email or Password Incorrect"));
  });
});
