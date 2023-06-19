const express = require('express')
const router = express.Router()
const profileController = require('../../controllers/profileController')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/:id')
  .get(profileController.getUserProfile)
  .put(profileController.updateUserProfile)

module.exports = router
