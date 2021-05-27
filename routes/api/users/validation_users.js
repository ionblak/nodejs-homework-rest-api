const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const validate = require('../contacts/validation_contacts')
const { SUBSCRIPTION } = require('../../../helpers/constants')

const schemaUser = Joi.object({
  password: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).required(),

})

const schemaUdate = Joi.object({
  subscription: Joi.string().valid(SUBSCRIPTION.STARTER, SUBSCRIPTION.BUSINESS, SUBSCRIPTION.PRO).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'ru'] } }).optional(),
}).min(1)

module.exports.validateUser = (req, _res, next) => {
  return validate(schemaUser, req.body, next)
}

module.exports.validateUpdateUser = (req, _res, next) => {
  return validate(schemaUdate, req.body, next)
}
