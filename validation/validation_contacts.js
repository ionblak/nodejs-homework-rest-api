const Joi = require('joi')
const { HTTP_CODE } = require('../helpers/constants')

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  phone: Joi.string().min(3).max(11).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional(),
  phone: Joi.string().min(3).max(11).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).optional(),
}).min(1)

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

module.exports.validateCreateContact = (req, res, next) => {
  return validate(schemaCreateContact, res.body, next)
}
module.exports.validateUpdateContact = (req, res, next) => {
  return validate(schemaUpdateContact, res.body, next)
}
