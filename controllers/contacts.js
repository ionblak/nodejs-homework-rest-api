const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact
} = require('../model/contacts')
const { HTTP_CODE } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contacts, total, limit, page } = await listContacts(userId, req.query)
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { contacts, total, limit, page }
    })
  } catch (e) {
    next(e)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await (await getContactById(userId, req.params.contactId))
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        data: {
          contact
        }
      })
    } else {
      return next({
        status: HTTP_CODE.NOT_FOUND,
        message: 'Not Found',
        data: 'Not Found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await addContact({ ...req.body, owner: userId })
    res.status(HTTP_CODE.CREATED).json({
      status: 'success',
      code: HTTP_CODE.CREATED,
      data: {
        contact
      }
    })
  } catch (e) {
    next(e)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await removeContact(userId, req.params.contactId)
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        message: 'contact deleted',
        code: HTTP_CODE.OK,
      })
    } else {
      return next({
        status: HTTP_CODE.NOT_FOUND,
        message: 'Not Found',
        data: 'Not Found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await updateContact(userId, req.params.contactId, req.body)
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        data: {
          contact
        }
      })
    } else {
      return next({
        status: HTTP_CODE.NOT_FOUND,
        message: 'Not Found',
        data: 'Not Found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await updateStatusContact(userId, req.params.contactId, req.body)
    if (contact) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        data: {
          contact
        }
      })
    }
    return next({
      status: HTTP_CODE.NOT_FOUND,
      message: 'Not Found',
      data: 'Not Found',
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { getAll, getById, create, remove, update, updateStatus }
