const mongoose = require('mongoose')
const { Schema, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

const ContactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  },
}, {
  versionKey: false,
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
},)
// ПОДКЛЮЧЕНИЕ ПОГИНАЦИИ
ContactSchema.plugin(mongoosePaginate)
const Contact = mongoose.model('contact', ContactSchema)
module.exports = Contact
