const request = require("supertest");
const app = require("../../../src/routes/index");
const mongoose = require("mongoose");
const Tag = require("../../../src/models/tag");
const config = require("config");

describe("Tag", () => {
  beforeEach(async () => {
    await mongoose.connect(config.get("database.mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Tag.deleteMany({});
    await mongoose.connection.close();
  });

  it("should create an tag", async () => {
    const newTag = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/v1/tags")
      .send(newTag)
      .expect(200);

    const createdTag = await Tag.findById(response.body._id);
    expect(createdTag).toBeTruthy();
    expect(createdTag.name).toBe(newTag.name);
    expect(createdTag.description).toBe(newTag.description);
  });

  it("should update an existing tag", async () => {
    const newTag = new Tag({
      name: "Test Tag",
      description: "Testing tag update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedTag = await newTag.save();

    const response = await request(app)
      .put(`/api/v1/tags/${savedTag._id}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).put("/api/v1/tags/892278647823").send({
      description: "Updated description",
      modifiedBy: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });
  it("should delete an existing tag", async () => {
    const newTag = new Tag({
      name: "Test Tag",
      description: "Testing tag delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedTag = await newTag.save();

    const response = await request(app).delete(`/api/v1/tags/${savedTag._id}`);

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).delete("/api/v1/tags/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });
  it("should get an existing tag by ID", async () => {
    const newTag = new Tag({
      name: "Test Tag",
      description: "Testing getTag",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const savedTag = await newTag.save();

    const response = await request(app).get(`/api/v1/tags/${savedTag._id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Tag");
    expect(response.body.description).toBe("Testing getTag");
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).get("/api/v1/tags/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });
  it("should get all tags", async () => {
    const app1 = new Tag({
      name: "App 1",
      description: "Tag 1",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const app2 = new Tag({
      name: "App 2",
      description: "Tag 2",
      createdBy: "Jane Doe",
      createdDate: new Date(),
    });
    await Promise.all([app1.save(), app2.save()]);
    const response = await request(app).get("/api/v1/tags");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
