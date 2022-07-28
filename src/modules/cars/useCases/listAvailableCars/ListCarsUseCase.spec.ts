import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("Should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 1",
      description: "Car Description",
      daily_rate: 140,
      license_plate: "CBA-123",
      fine_amount: 100,
      brand: "Car Brand",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 2",
      description: "Car Description",
      daily_rate: 140,
      license_plate: "CBA-123",
      fine_amount: 100,
      brand: "car_brand_test",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "car_brand_test",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 3",
      description: "Car Description",
      daily_rate: 140,
      license_plate: "CBA-123",
      fine_amount: 100,
      brand: "car_brand_test",
      category_id: "category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car 3",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 4",
      description: "Car Description",
      daily_rate: 140,
      license_plate: "CBA-123",
      fine_amount: 100,
      brand: "car_brand_test",
      category_id: "123345",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "123345",
    });

    expect(cars).toEqual([car]);
  });
});
