const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../src/routes/index");
const Application = require("../../../src/models/application");
const config = require("config");

describe("Application", () => {
  beforeEach(async () => {
    await mongoose.connect(config.get("database.mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Application.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create an application", async () => {
    const newApplication = {
      name: "Test App",
      description: "Test description",
      code: "90909",
    };

    const response = await request(app)
      .post("/api/v1/applications")
      .send(newApplication)
      .expect(200);

    const createdApplication = await Application.findById(response.body._id);
    expect(createdApplication).toBeTruthy();
    expect(createdApplication.name).toBe(newApplication.name);
    expect(createdApplication.description).toBe(newApplication.description);
  });

  it("should update an existing application", async () => {
    const newApplication = new Application({
      name: "Test Application",
      description: "Testing application update",
      code: "90909",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedApplication = await newApplication.save();

    const response = await request(app)
      .put(`api/v1/applications/${savedApplication._id}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app)
      .put("api/v1/applications/892278647823")
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
    const newApplication = new Application({
      name: "Test Application",
      description: "Testing application delete",
      code: "90909",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedApplication = await newApplication.save();

    const response = await request(app).delete(
      `api/v1/applications/${savedApplication._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app).delete(
      "api/v1/applications/892278647823"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The application with the given ID was not found."
    );
  });
  it("should get an existing application by ID", async () => {
    const newApplication = new Application({
      name: "Test Application",
      description: "Testing getApplication",
      code: "90909",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedApplication = await newApplication.save();

    const response = await request(app).get(
      `api/v1/applications/${savedApplication._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Application");
    expect(response.body.description).toBe("Testing getApplication");
  });

  it("should return an error if the application with the given ID is not found", async () => {
    const response = await request(app).get("api/v1/applications/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The application with the given ID was not found."
    );
  });
  it("should get all applications", async () => {
    const app1 = new Application({
      name: "App 1",
      description: "Application 1",
      code: "90909",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const app2 = new Application({
      name: "App 2",
      description: "Application 2",
      code: "90909",
      createdBy: "Jane Doe",
      createdDate: new Date(),
    });
    await Promise.all([app1.save(), app2.save()]);
    const response = await request(app).get("api/v1/applications");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
