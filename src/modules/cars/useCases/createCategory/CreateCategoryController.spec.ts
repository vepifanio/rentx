import request from "supertest";
import { Connection } from "typeorm";
import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, is_admin, created_at)
    values('${id}', 'admin', 'admin@rentx.com', '${password}', '1234567', 'true', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const {
      body: { refreshToken },
    } = responseToken;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${refreshToken}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new category with a existent name", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    const {
      body: { refreshToken },
    } = responseToken;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Supertest",
      })
      .set({
        Authorization: `Bearer ${refreshToken}`,
      });

    expect(response.status).toBe(400);
  });
});
