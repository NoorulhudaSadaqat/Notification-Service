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

  it("should create an tag", async () => {
    const newTag = {
      name: "Test App",
      description: "Test description",
    };

    const response = await request(app)
      .post("/api/tag")
      .send(newTag)
      .expect(200);

    const createdTag = await knex("tag").where("id", response.body.id).first();
    expect(createdTag).toBeTruthy();
    expect(createdTag.name).toBe(newTag.name);
    expect(createdTag.description).toBe(newTag.description);
  });

  it("should update an existing tag", async () => {
    const [tagId] = await knex("tag").insert({
      name: "Test Tag",
      description: "Testing tag update",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app)
      .put(`/tags/${tagId}`)
      .send({ description: "Updated description", modifiedBy: "Jane Doe" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated description");
    expect(response.body.modifiedBy).toBe("Jane Doe");
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).put("/tags/892278647823").send({
      description: "Updated description",
      modifiedBy: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });

  it("should delete an existing tag", async () => {
    const [tagId] = await knex("tag").insert({
      name: "Test Tag",
      description: "Testing tag delete",
      createdBy: "John Doe",
      createdDate: new Date(),
    });
    const response = await request(app).delete(`/tags/${tagId}`);

    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).delete("/tags/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });
  it("should get an existing tag by ID", async () => {
    const [tagId] = await knex("tag").insert({
      name: "Test Tag",
      description: "Testing getTag",
      createdBy: "John Doe",
      createdDate: new Date(),
    });

    const response = await request(app).get(`/tags/${tagId}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Test Tag");
    expect(response.body.description).toBe("Testing getTag");
  });

  it("should return an error if the tag with the given ID is not found", async () => {
    const response = await request(app).get("/tags/892278647823");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "The tag with the given ID was not found."
    );
  });
  it("should get all tags", async () => {
    await knex("tag").insert([
      {
        name: "App 1",
        description: "Tag 1",
        createdBy: "John Doe",
        createdDate: new Date(),
      },
      {
        name: "App 2",
        description: "Tag 2",
        createdBy: "Jane Doe",
        createdDate: new Date(),
      },
    ]);
    const response = await request(app).get("/tags");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("App 1");
    expect(response.body[1].name).toBe("App 2");
  });
});
