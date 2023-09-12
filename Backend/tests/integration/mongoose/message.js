const request = require("supertest");
const app = require("../../../src/routes/index");
const mongoose = require("mongoose");
const Message = require("../../../src/models/message");

const config = require("config");

describe("Message", () => {
  beforeEach(async () => {
    await mongoose.connect(config.get("database.mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Message.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create an message", async () => {
    const newMessage = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/v1/messages")
      .send(newMessage)
      .expect(200);

    const createdMessage = await Message.findById(response.body._id);
    expect(createdMessage).toBeTruthy();
    expect(createdMessage.name).toBe(newMessage.name);
    expect(createdMessage.description).toBe(newMessage.description);
  });

  it("should update an existing message", async () => {
    const newMessage = new Message({
      name: "Test Message",
      description: "Testing message update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedMessage = await newMessage.save();

    const response = await request(app)
      .put(`api/v1/messages/${savedMessage._id}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app)
      .put("api/v1/messages/892278647823")
      .send({
        description: "Updated description",
        modifiedBy: "Jane Doe",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });
  it("should delete an existing message", async () => {
    const newMessage = new Message({
      name: "Test Message",
      description: "Testing message delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedMessage = await newMessage.save();

    const response = await request(app).delete(
      `api/v1/messages/${savedMessage._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app).delete("api/v1/messages/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });
  it("should get an existing message by ID", async () => {
    const newMessage = new Message({
      name: "Test Message",
      description: "Testing getMessage",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedMessage = await newMessage.save();

    const response = await request(app).get(
      `api/v1/messages/${savedMessage._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Message");
    expect(response.body.description).toBe("Testing getMessage");
  });

  it("should return an error if the message with the given ID is not found", async () => {
    const response = await request(app).get("api/v1/messages/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The message with the given ID was not found."
    );
  });
  it("should get all messages", async () => {
    const app1 = new Message({
      name: "App 1",
      description: "Message 1",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const app2 = new Message({
      name: "App 2",
      description: "Message 2",
      createdBy: "Jane Doe",
      createdDate: new Date(),
    });
    await Promise.all([app1.save(), app2.save()]);
    const response = await request(app).get("api/v1/messages");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
