const User = require('./schemas/user')

const findById = async (id) => {
  return await User.findById(id)
}

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const create = async (options) => {
  const user = new User(options)
  return await user.save()
}

const update = async (id, body) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { ...body }, { new: true })
  return result
}

module.exports = { findById, findByEmail, create, update }
