const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const boolParser = require('express-query-boolean')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const { HTTP_CODE } = require('./helpers/constants')
const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    return res.status(HTTP_CODE.BAD_REQUEST).json(
      {
        status: 'error',
        code: HTTP_CODE.BAD_REQUEST,
        message: 'Too many requests, please try again later.'
      }
    )
  }
})

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
  res.status(HTTP_CODE.NOT_FOUND).json({ status: 'error', code: 404, message: 'Not found' })
})

app.use((err, req, res, next) => {
  err.status = err.status
    ? err.status
    : HTTP_CODE.INTERNAL_SERVER_ERROR
  res.status(err.status).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data
  })
})

module.exports = app
