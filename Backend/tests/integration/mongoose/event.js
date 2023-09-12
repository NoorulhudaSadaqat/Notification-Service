const request = require("supertest");
const app = require("../../../src/routes/index");
const mongoose = require("mongoose");
const Event = require("../../../src/models/event");

const config = require("config");

describe("Event", () => {
  beforeEach(async () => {
    await mongoose.connect(config.get("database.mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create an event", async () => {
    const newEvent = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/v1/events")
      .send(newEvent)
      .expect(200);

    const createdEvent = await Event.findById(response.body._id);
    expect(createdEvent).toBeTruthy();
    expect(createdEvent.name).toBe(newEvent.name);
    expect(createdEvent.description).toBe(newEvent.description);
  });

  it("should update an existing event", async () => {
    const newEvent = new Event({
      name: "Test Event",
      description: "Testing event update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedEvent = await newEvent.save();

    const response = await request(app)
      .put(`api/v1/events/${savedEvent._id}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).put("api/v1/events/892278647823").send({
      description: "Updated description",
      modifiedBy: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });
  it("should delete an existing event", async () => {
    const newEvent = new Event({
      name: "Test Event",
      description: "Testing event delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedEvent = await newEvent.save();

    const response = await request(app).delete(
      `api/v1/events/${savedEvent._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).delete("api/v1/events/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });
  it("should get an existing event by ID", async () => {
    const newEvent = new Event({
      name: "Test Event",
      description: "Testing getEvent",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedEvent = await newEvent.save();

    const response = await request(app).get(`api/v1/events/${savedEvent._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Event");
    expect(response.body.description).toBe("Testing getEvent");
  });

  it("should return an error if the event with the given ID is not found", async () => {
    const response = await request(app).get("api/v1/events/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The event with the given ID was not found."
    );
  });
  it("should get all events", async () => {
    const app1 = new Event({
      name: "App 1",
      description: "Event 1",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const app2 = new Event({
      name: "App 2",
      description: "Event 2",
      createdBy: "Jane Doe",
      createdDate: new Date(),
    });
    await Promise.all([app1.save(), app2.save()]);
    const response = await request(app).get("api/v1/events");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
