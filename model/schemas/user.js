const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')

const { SUBSCRIPTION, SALT_FACTOR } = require('../../helpers/constants')

const UserSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/gi
      return re.test(String(value).toLowerCase())
    },
  },
  subscription: {
    type: String,
    enum: [SUBSCRIPTION.STARTER, SUBSCRIPTION.PRO, SUBSCRIPTION.BUSINESS],
    default: SUBSCRIPTION.STARTER,
  },
  avatar: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: 250 }, true)
    },
  },
  userIdImg: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
}, {
  versionKey: false,
  timestamps: true,
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

UserSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password)
}

const User = mongoose.model('user', UserSchema)
module.exports = User
