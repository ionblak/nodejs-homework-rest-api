const Contacts = require("../model/contacts");
const { HTTP_CODE } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, page } = await Contacts.listContacts(
      userId,
      req.query
    );
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: { contacts, total, limit, page },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: "success",
        code: HTTP_CODE.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: "error",
        message: "Not Found",
        code: HTTP_CODE.NOT_FOUND,
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    res.status(HTTP_CODE.CREATED).json({
      status: "success",
      code: HTTP_CODE.CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: "success",
        code: HTTP_CODE.OK,
        message: "contact deleted",
      });
    } else {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: "error",
        code: HTTP_CODE.NOT_FOUND,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: "success",
        code: HTTP_CODE.OK,
        data: {
          contact,
        },
      });
    }
    return res.status(HTTP_CODE.NOT_FOUND).json({
      status: "error",
      code: HTTP_CODE.NOT_FOUND,
      message: "Not Found",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getAll, getById, create, remove, update };
