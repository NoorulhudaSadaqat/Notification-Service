const request = require("supertest");
const app = require("../../../src/routes/index");
const knex = require("../../../src/knex");

describe("Knex.js Controller Tests", () => {
  beforeEach(async () => {
    await knex.migrate.latest();
  });

  afterEach(async () => {
    // await knex.migrate.rollback();
    // await knex.destroy();
  });

  it("should create an application", async () => {
    const newApplication = {
      name: "Test App",
      description: "Test description",
      code: "10923",
    };

    const response = await request(app)
      .post("/api/v1/applications")
      .send(newApplication)
      .expect(200);

    const createdApplication = await knex("application")
      .where("id", response.body.id)
      .first();
    expect(createdApplication).toBeTruthy();
    expect(createdApplication.name).toBe(newApplication.name);
    expect(createdApplication.description).toBe(newApplication.description);
  });

  it("should update an existing application", async () => {
    const [applicationId] = await knex("application").insert({
      name: "Test Application",
      description: "Testing application update",
      code: "898989",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app)
      .put(`api/v1/applications/${applicationId}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app)
      .put("api/v1/applications/909090909090")
      .send({
        description: "Updated description",
        modifiedBy: "Jane Doe",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The application with the given ID was not found."
    );
  });

  it("should delete an existing application", async () => {
    const [applicationId] = await knex("application").insert({
      name: "Test Application",
      description: "Testing application delete",
      code: "0238h",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app).delete(
      `api/v1/applications/${applicationId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app).delete(
      "api/v1/applications/8908080980808080"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The application with the given ID was not found."
    );
  });
  it("should get an existing application by ID", async () => {
    const [applicationId] = await knex("application").insert({
      name: "Test Application",
      description: "Testing getApplication",
      code: "12e34",
      createdBy: "John Doe",
      createdDate: new Date(),
    });

    const response = await request(app).get(
      `api/v1/applications/${applicationId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Application");
    expect(response.body.description).toBe("Testing getApplication");
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app).get("api/v1/applications/9080797707");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The application with the given ID was not found."
    );
  });
  it("should get all applications", async () => {
    await knex("application").insert([
      {
        name: "App 1",
        description: "Application 1",
        createdBy: "John Doe",
        code: "78787",
        createdDate: new Date(),
      },
      {
        name: "App 2",
        description: "Application 2",
        createdBy: "Jane Doe",
        code: "78787",
        createdDate: new Date(),
      },
    ]);
    const response = await request(app).get("api/v1/applications");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
