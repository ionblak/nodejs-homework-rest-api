const request = require("supertest");
const fs = require("fs/promises");
const { newTestUser } = require("./data/data");
const db = require("../model/db");
const app = require("../app");

jest.mock("cloudinary");
const User = require("../model/schemas/user");
const {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
} = require("../model/users");

describe("E2E test the routes api/users", () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newTestUser.email });
  });
  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newTestUser.email });
    await mongo.disconnect();
  });
  it("should response 201 status registration user", async () => {
    const res = await request(app).post("/api/users/signup").send(newTestUser);
    expect(res.status).toEqual(201);
    expect(res.body).toBeDefined();
  });
  it("should response 409 status registration user", async () => {
    const res = await request(app).post("/api/users/signup").send(newTestUser);
    expect(res.status).toEqual(409);
    expect(res.body).toBeDefined();
  });
  it("should response 200 status login user", async () => {
    const res = await request(app).post("/api/users/login").send(newTestUser);
    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    token = res.body.data.token;
  });
  it("should response 401 status login user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "fake@mail.com", password: "dfghj" });
    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
  });
  it("should response 400 status login user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "fake@mail/com", password: "dfghj" });
    expect(res.status).toEqual(400);
    expect(res.body).toBeDefined();
  });
  it("should response 200 status avatar user", async () => {
    const buf = await fs.readFile("./test/data/Deadpool_Textless.jpg");
    const res = await request(app)
      .patch("/api/users/avatars")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buf, "Deadpool_Textless.jpg");
    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
    expect(res.body.data.avatarUrl).toBe("avatar");
  });

  it("should response 200 status getUser user", async () => {
    const res = await request(app)
      .get("/api/users/current")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
  });
  it("should response 200 status update user", async () => {
    const res = await request(app)
      .patch("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ subscription: "business" });
    expect(res.status).toEqual(200);
    expect(res.body).toBeDefined();
  });
  it("should response 204 status logout user", async () => {
    const res = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toEqual(204);
    expect(res.body).toBeDefined();
  });
});
