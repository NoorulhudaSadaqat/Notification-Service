const request = require("supertest");
const app = require("../../../src/routes/index");
const mongoose = require("mongoose");
const NotificationType = require("../../../src/models/notificationType");
const config = require("config");

describe("NotificationType", () => {
  beforeEach(async () => {
    await mongoose.connect(config.get("database.mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await NotificationType.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create an notificationType", async () => {
    const newNotificationType = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/v1/notification-types")
      .send(newNotificationType)
      .expect(200);

    const createdNotificationType = await NotificationType.findById(
      response.body._id
    );
    expect(createdNotificationType).toBeTruthy();
    expect(createdNotificationType.name).toBe(newNotificationType.name);
    expect(createdNotificationType.description).toBe(
      newNotificationType.description
    );
  });

  it("should update an existing notificationType", async () => {
    const newNotificationType = new NotificationType({
      name: "Test NotificationType",
      description: "Testing notificationType update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedNotificationType = await newNotificationType.save();

    const response = await request(app)
      .put(`/api/v1/notification-types/${savedNotificationType._id}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app)
      .put("/api/v1/notification-types/892278647823")
      .send({
        description: "Updated description",
        modifiedBy: "Jane Doe",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The notificationType with the given ID was not found."
    );
  });
  it("should delete an existing notificationType", async () => {
    const newNotificationType = new NotificationType({
      name: "Test NotificationType",
      description: "Testing notificationType delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedNotificationType = await newNotificationType.save();

    const response = await request(app).delete(
      `/api/v1/notification-types/${savedNotificationType._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app).delete(
      "/api/v1/notification-types/892278647823"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The notificationType with the given ID was not found."
    );
  });
  it("should get an existing notificationType by ID", async () => {
    const newNotificationType = new NotificationType({
      name: "Test NotificationType",
      description: "Testing getNotificationType",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedNotificationType = await newNotificationType.save();

    const response = await request(app).get(
      `/api/v1/notification-types/${savedNotificationType._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test NotificationType");
    expect(response.body.description).toBe("Testing getNotificationType");
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app).get(
      "/api/v1/notification-types/892278647823"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The notificationType with the given ID was not found."
    );
  });
  it("should get all notificationTypes", async () => {
    const app1 = new NotificationType({
      name: "App 1",
      description: "NotificationType 1",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const app2 = new NotificationType({
      name: "App 2",
      description: "NotificationType 2",
      createdBy: "Jane Doe",
      createdDate: new Date(),
    });
    await Promise.all([app1.save(), app2.save()]);
    const response = await request(app).get("/api/v1/notification-types");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
