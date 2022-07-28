import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/inMemory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("Send Forgot Password Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProviderInMemory = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dateProvider,
      mailProviderInMemory
    );
  });

  it("Should be able to send a forgot password mail to a user", async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, "sendMail");

    await usersRepositoryInMemory.create({
      name: "Helen Simpson",
      email: "ruzjihpu@fo.mt",
      driver_license: "367561",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("ruzjihpu@fo.mt");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not be able to send an email if a user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("ruzjihpu@fo.mt")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("Should be able to create a new user token", async () => {
    const createUsersToken = jest.spyOn(usersRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      name: "Helen Simpson",
      email: "ruzjihpu@fo.mt",
      driver_license: "367561",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("ruzjihpu@fo.mt");

    expect(createUsersToken).toHaveBeenCalled();
  });
});
