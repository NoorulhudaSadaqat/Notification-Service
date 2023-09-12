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

  it("should create an message", async () => {
    const newMessage = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/message")
      .send(newMessage)
      .expect(200);

    const createdMessage = await knex("message")
      .where("id", response.body.id)
      .first();
    expect(createdMessage).toBeTruthy();
    expect(createdMessage.name).toBe(newMessage.name);
    expect(createdMessage.description).toBe(newMessage.description);
  });

  it("should update an existing message", async () => {
    const [messageId] = await knex("message").insert({
      name: "Test Message",
      description: "Testing message update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app)
      .put(`/messages/${messageId}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app).put("/messages/8080988080").send({
      description: "Updated description",
      modifiedBy: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });

  it("should delete an existing message", async () => {
    const [messageId] = await knex("message").insert({
      name: "Test Message",
      description: "Testing message delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app).delete(`/messages/${messageId}`);

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app).delete("/messages/79879879");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });
  it("should get an existing message by ID", async () => {
    const [messageId] = await knex("message").insert({
      name: "Test Message",
      description: "Testing getMessage",
      createdBy: "John Doe",
      createdDate: new Date(),
    });

    const response = await request(app).get(`/messages/${messageId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Message");
    expect(response.body.description).toBe("Testing getMessage");
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app).get("/messages/70978789789");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });
  it("should get all messages", async () => {
    await knex("message").insert([
      {
        name: "App 1",
        description: "Message 1",
        createdBy: "John Doe",
        createdDate: new Date(),
      },
      {
        name: "App 2",
        description: "Message 2",
        createdBy: "Jane Doe",
        createdDate: new Date(),
      },
    ]);
    const response = await request(app).get("/messages");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
