const {
  update,
  getAll,
  getById,
  remove,
  create,
} = require("../controllers/contacts");
const Contacts = require("../model/contacts");

jest.mock("../model/contacts");

describe("Unit test contacts controllers", () => {
  describe("test function update", () => {
    const req = { user: { id: 1 }, body: {}, params: { id: 3 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    const next = jest.fn();
    it("without contact in Db", async () => {
      Contacts.updateContact = jest.fn();
      const result = await update(req, res, next);
      expect(result.status).toEqual("error");
      expect(result.code).toEqual(404);
      expect(result.message).toEqual("Not Found");
    });

    it("Db return an exception", async () => {
      Contacts.updateContact = jest.fn(() => {
        throw new Error("Ups");
      });
      await update(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("Db return new contact", async () => {
      Contacts.updateContact = jest.fn(() => {
        return {};
      });
      const result = await update(req, res, next);
      expect(result.status).toEqual("success");
      expect(result.code).toEqual(200);
      expect(result.data).toBeDefined();
    });

    describe("test function function next in controlers ", () => {
      it("Db return an exception in functiom update", async () => {
        Contacts.updateContact = jest.fn(() => {
          throw new Error("Ups");
        });
        await update(req, res, next);
        expect(next).toHaveBeenCalled();
      });
      it("Db return an exception in functiom getAll", async () => {
        Contacts.listContacts = jest.fn(() => {
          throw new Error("Ups");
        });
        await getAll(req, res, next);
        expect(next).toHaveBeenCalled();
      });
      it("Db return an exception in functiom getById", async () => {
        Contacts.getContactById = jest.fn(() => {
          throw new Error("Ups");
        });
        await getById(req, res, next);
        expect(next).toHaveBeenCalled();
      });
      it("Db return an exception in functiom remove", async () => {
        Contacts.removeContact = jest.fn(() => {
          throw new Error("Ups");
        });
        await remove(req, res, next);
        expect(next).toHaveBeenCalled();
      });
      it("Db return an exception in functiom create", async () => {
        Contacts.addContact = jest.fn(() => {
          throw new Error("Ups");
        });
        await create(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
