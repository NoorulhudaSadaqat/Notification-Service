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

  it("should create an event", async () => {
    const newEvent = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/event")
      .send(newEvent)
      .expect(200);

    const createdEvent = await knex("event")
      .where("id", response.body.id)
      .first();
    expect(createdEvent).toBeTruthy();
    expect(createdEvent.name).toBe(newEvent.name);
    expect(createdEvent.description).toBe(newEvent.description);
  });

  it("should update an existing event", async () => {
    const [eventId] = await knex("event").insert({
      name: "Test Event",
      description: "Testing event update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app)
      .put(`/events/${eventId}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).put("/events/8099999999908").send({
      description: "Updated description",
      modifiedBy: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });

  it("should delete an existing event", async () => {
    const [eventId] = await knex("event").insert({
      name: "Test Event",
      description: "Testing event delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app).delete(`/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).delete("/events/89898098080");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });
  it("should get an existing event by ID", async () => {
    const [eventId] = await knex("event").insert({
      name: "Test Event",
      description: "Testing getEvent",
      createdBy: "John Doe",
      createdDate: new Date(),
    });

    const response = await request(app).get(`/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Event");
    expect(response.body.description).toBe("Testing getEvent");
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).get("/events/80980980980");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });
  it("should get all events", async () => {
    await knex("event").insert([
      {
        name: "App 1",
        description: "Event 1",
        createdBy: "John Doe",
        createdDate: new Date(),
      },
      {
        name: "App 2",
        description: "Event 2",
        createdBy: "Jane Doe",
        createdDate: new Date(),
      },
    ]);
    const response = await request(app).get("/events");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
