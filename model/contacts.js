const Contact = require('./schemas/contact')

const listContacts = async (userId, query) => {
  // Конфигурация пагинации
  const { limit = 5, page = 1, sortBy, sortByDesc, filter, favorite = null } = query
  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }

  const result = await Contact.paginate(optionsSearch, {
    limit,
    page,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    }
  })
  const { docs: contacts, totalDocs: total } = result

  return {
    contacts,
    total,
    limit,
    page,
  }
}

const getContactById = async (userId, contactId) => {
  const result = await Contact.findById({ _id: contactId, owner: userId }).populate({ path: 'owner', select: 'email subscription -_id' })
  return result
}

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({ _id: contactId, owner: userId })
  return result
}

const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: userId }, { ...body }, { new: true })
  return result
}

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: userId }, { ...body }, { new: true })
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
