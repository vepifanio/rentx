import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("Should be able to add a new specification to a car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Name Car",
      description: "Description",
      daily_rate: 100,
      license_plate: "ACB-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: "test",
      description: "test",
    });

    const specifications_ids = [specification.id];

    const specificationsCar = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_ids,
    });

    expect(specificationsCar).toHaveProperty("specifications");
    expect(specificationsCar.specifications.length).toBe(1);
  });

  it("Should not be able to add a new specification to a non existent car", async () => {
    const car_id = "1234";
    const specifications_ids = ["54321"];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_ids,
      })
    ).rejects.toEqual(new AppError("Car does not exists!"));
  });
});
