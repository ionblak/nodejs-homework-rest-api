const app = require('../app')
const db = require('../model/db')
const createFolderIsNotExist = require('../helpers/create-dir')

require('dotenv').config()

const UPLOAD_DIR = process.env.UPLOAD_DIR
const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async() => {
    await createFolderIsNotExist(UPLOAD_DIR)
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error message: ${err.message}`)
  process.exit(1)
})
