const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { HTTP_CODE } = require('../../../helpers/constants')

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  phone: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).required(),
  favorite: Joi.boolean().optional(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).optional(),
  favorite: Joi.boolean().optional(),
}).min(1)

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemaId = Joi.object({ id: Joi.objectId().required() })

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HTTP_CODE.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Request',
    })
  }
  next()
}

module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next)
}
module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
module.exports.validateUpdateStatusContact = (req, _res, next) => {
  return validate(schemaUpdateStatusContact, req.body, next)
}
module.exports.validateId = (req, _res, next) => {
  return validate(schemaId, { id: req.params.contactId }, next)
}
