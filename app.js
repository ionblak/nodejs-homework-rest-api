const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const boolParser = require('express-query-boolean')
const helmet = require('helmet')

const limiter = require('./helpers/limiter')
const { HTTP_CODE } = require('./helpers/constants')
const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())
app.use(limiter)
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 15000 }))
app.use(boolParser())

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res
    .status(HTTP_CODE.NOT_FOUND)
    .json({ status: 'error', code: 404, message: 'Not found' })
})

app.use((err, req, res, next) => {
  err.status = err.status ? err.status : HTTP_CODE.INTERNAL_SERVER_ERROR
  res.status(err.status).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data,
  })
})

module.exports = app
