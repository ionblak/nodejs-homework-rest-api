const passport = require('passport')
const guard = require('../helpers/guard')

const { HTTP_CODE } = require('../helpers/constants')


describe('Unit test funtion guard',()=>{
    const user = { token: '11111111' }
    const req = { get: jest.fn((header) => `Bearer ${user.token}`), user }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    }
    const next = jest.fn()
    it('Run guard with user', async ()=>{
        passport.authenticate = jest.fn(
            (strategy,options, cb)=>(req, res, next)=>{
            cb(null, user)
        })
        guard(req, res, next)
        expect(next).toHaveBeenCalled()
    })
    it('Run guard without user', async ()=>{
        passport.authenticate = jest.fn(
            (strategy,options, cb)=>(req, res, next)=>{
            cb(null, false)
        })
        guard(req, res, next)
        expect(req.get).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.json).toHaveReturnedWith({
            status: 'error',
            code: HTTP_CODE.UNAUTHORIZED,
            message: 'Not authorized'
          })
    })
    it('Run guard with wrong token', async ()=>{ 
         passport.authenticate = jest.fn(
        (strategy,options, cb)=>(req, res, next)=>{
        cb(null, {token: '22222222'})
    })
    guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.json).toHaveReturnedWith({
        status: 'error',
        code: HTTP_CODE.UNAUTHORIZED,
        message: 'Not authorized'
      })
    })
    it('Run guard with error', async ()=>{ 
        passport.authenticate = jest.fn(
       (strategy,options, cb)=>(req, res, next)=>{
       cb(new Error('Ups'), {})
   })
   guard(req, res, next)
   expect(req.get).toHaveBeenCalled()
   expect(res.status).toHaveBeenCalled()
   expect(res.json).toHaveBeenCalled()
   expect(res.json).toHaveReturnedWith({
       status: 'error',
       code: HTTP_CODE.UNAUTHORIZED,
       message: 'Not authorized'
     })
   })


})