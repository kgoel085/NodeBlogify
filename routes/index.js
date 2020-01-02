const express = require('express')
const router = express.Router()
const { hasOwnProperty } = require('./../helpers')

// User routes
const UserRoutes = require('./user')
router.use('/user', UserRoutes)

router.get('/', (req, res, nxt) => {
  res.send('Welcome back....!')
})

// --------------------------- Error Handling
// *** Not found page
router.use((req, res, nxt) => {
  const error = new Error('Not Found !')
  error.status = 404

  nxt(error)
})

// *** Unexpected errors
router.use((error, req, res, nxt) => {
  res.status(error.statusCode || 500)

  const errorObj = {
    error: true,
    message: (hasOwnProperty(error, 'message') && error.message) ? error.message : 'Error Occured !'
  }

  // If any error data is there
  if (hasOwnProperty(error, 'data')) errorObj.data = error.data

  // Return error
  res.json(errorObj)
})
module.exports = router