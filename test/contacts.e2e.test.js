const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { newContact, newUser } = require("./data/data");
const db = require("../model/db");
const app = require("../app");

const Contact = require("../model/schemas/contact");
const User = require("../model/schemas/user");
const {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
} = require("../model/users");

describe("E2E test the routes api/contacts", () => {
  let user, token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await create(newUser);
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, JWT_SECRET_KEY);
    await updateToken(user._id, token);
  });
  beforeEach(async () => {
    await Contact.deleteMany();
  });
  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });
  describe("Should handle get request", () => {
    it("should response 200 status for get all contacts", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
    });
    it("should response 200 status for get contact by id", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const res = await request(app)
        .get(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.id).toBe(String(contact._id));
    });
    it("should response 400 status for get contact by id", async () => {
      const res = await request(app)
        .get("/api/contacts/123")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should response 404 status for get contact by id", async () => {
      const res = await request(app)
        .get("/api/contacts/609a6600cd65ed15182b869a")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
  describe("Should handle post request", () => {
    it("should response 201 status created contact", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send(newContact);

      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe(String(newContact.name));
    });
    it("should response 400 status created contact without field name ", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ email: "bable@bable.com" });

      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
  describe("Should handle delete request", () => {
    it("should response 200 status deleted contact", async () => {
      const contact = await Contact.create({
        ...newContact,
        owner: user._id,
      });
      const res = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    it("should response 404 status for delete contact", async () => {
      const res = await request(app)
        .delete("/api/contacts/609a6600cd65ed15182b869a")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
  describe("Should handle update request", () => {
    it("should response 404 status for update contact by id", async () => {
      const res = await request(app)
        .put("/api/contacts/609a6600cd65ed15182b869a")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ name: "b" });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    it("should response 404 status for update contact by id", async () => {
      const res = await request(app)
        .patch("/api/contacts/609a6600cd65ed15182b869a/favorite")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ favorite: "no" });
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
});
