import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description",
      daily_rate: 100,
      license_plate: "ACB-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("Should not be able to create a car with a existent license_plate", async () => {
    await createCarUseCase.execute({
      name: "Car 1",
      description: "Description",
      daily_rate: 100,
      license_plate: "ACB-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    await expect(
      createCarUseCase.execute({
        name: "Car 2",
        description: "Description",
        daily_rate: 100,
        license_plate: "ACB-1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      })
    ).rejects.toEqual(new AppError("Car Already Exists!"));
  });

  it("Should not be able to create a car with a available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car Available",
      description: "Description",
      daily_rate: 100,
      license_plate: "ABCD-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    expect(car).toHaveProperty("available");
    expect(car.available).toBe(true);
  });
});
