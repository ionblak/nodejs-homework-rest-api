const express = require('express')
const router = express.Router()
const { listContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact } = require('../../model')
const { HTTP_CODE } = require('../../helpers/constants')
const { validateCreateContact, validateUpdateStatusContact, validateId, validateUpdateContact } = require('../../validation/validation_contacts')

router.get('/', async (_, res, next) => {
  try {
    const contacts = await listContacts()
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { contacts }
    })
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', validateId, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId)
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
})

router.post('/', validateCreateContact, async (req, res, next) => {
  try {
    const contact = await addContact(req.body)
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
})

router.delete('/:contactId', validateId, async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.contactId)
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
})

router.put('/:contactId', validateId, validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body)
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
})

router.patch('/:contactId/favorite', validateId, validateUpdateStatusContact, async (req, res, next) => {
  try {
    const contact = await updateStatusContact(req.params.contactId, req.body)
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
})

module.exports = router
