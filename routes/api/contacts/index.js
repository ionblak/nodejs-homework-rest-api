const express = require('express')
const router = express.Router()
const {
  validateCreateContact,
  validateUpdateStatusContact,
  validateId,
  validateUpdateContact
} = require('./validation_contacts')
const ctrl = require('../../../controllers/contacts')
const guard = require('../../../helpers/guard')

router.get('/', guard, ctrl.getAll)

router.get('/:contactId', guard, validateId, ctrl.getById)

router.post('/', guard, validateCreateContact, ctrl.create)

router.delete('/:contactId', guard, validateId, ctrl.remove)

router.put('/:contactId', guard, validateId, validateUpdateContact, ctrl.update)

router.patch('/:contactId/favorite', guard, validateId, validateUpdateStatusContact, ctrl.update)

module.exports = router
