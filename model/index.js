const fs = require('fs/promises')
const path = require('path')
// const contacts = require('./contacts.json')
const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.log(err)
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts()
    return contacts.find(({ id }) => id === Number(contactId))
  } catch (err) {
    console.log(err)
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts()
    const filteredContacts = await contacts.filter(({ id }) => id !== Number(contactId))
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts))
    return filteredContacts
  } catch (err) {
    console.log(err)
  }
}

const addContact = async (body) => {
  try {
    const contacts = await listContacts()
    const contact = { id: Date.now(), ...body }
    const changedContacts = [contact, ...contacts]
    await fs.writeFile(contactsPath, JSON.stringify(changedContacts))
    return contact
  } catch (err) {
    console.log(err)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts()
    const updatedContacts = await contacts.map((item) => item.id === Number(contactId) ? { ...item, ...body } : item)

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))

    return updatedContacts.find(({ id }) => id === Number(contactId))
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
