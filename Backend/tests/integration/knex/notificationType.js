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

  it("should create an notificationType", async () => {
    const newNotificationType = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/notificationType")
      .send(newNotificationType)
      .expect(200);

    const createdNotificationType = await knex("notificationType")
      .where("id", response.body.id)
      .first();
    expect(createdNotificationType).toBeTruthy();
    expect(createdNotificationType.name).toBe(newNotificationType.name);
    expect(createdNotificationType.description).toBe(
      newNotificationType.description
    );
  });

  it("should update an existing notificationType", async () => {
    const [notificationTypeId] = await knex("notificationType").insert({
      name: "Test NotificationType",
      description: "Testing notificationType update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app)
      .put(`/notificationTypes/${notificationTypeId}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app)
      .put("/notificationTypes/892278647823")
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
    const [notificationTypeId] = await knex("notificationType").insert({
      name: "Test NotificationType",
      description: "Testing notificationType delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app).delete(
      `/notificationTypes/${notificationTypeId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app).delete(
      "/notificationTypes/892278647823"
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The notificationType with the given ID was not found."
    );
  });
  it("should get an existing notificationType by ID", async () => {
    const [notificationTypeId] = await knex("notificationType").insert({
      name: "Test NotificationType",
      description: "Testing getNotificationType",
      createdBy: "John Doe",
      createdDate: new Date(),
    });

    const response = await request(app).get(
      `/notificationTypes/${notificationTypeId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test NotificationType");
    expect(response.body.description).toBe("Testing getNotificationType");
  });

  it("should return an error if the notificationType with the given ID is not found", async () => {
    const response = await request(app).get("/notificationTypes/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The notificationType with the given ID was not found."
    );
  });
  it("should get all notificationTypes", async () => {
    await knex("notificationType").insert([
      {
        name: "App 1",
        description: "NotificationType 1",
        createdBy: "John Doe",
        createdDate: new Date(),
      },
      {
        name: "App 2",
        description: "NotificationType 2",
        createdBy: "Jane Doe",
        createdDate: new Date(),
      },
    ]);
    const response = await request(app).get("/notificationTypes");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
