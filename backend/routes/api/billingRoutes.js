const express = require('express')
const router = express.Router()
const billingController = require('../../controllers/billingController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    billingController.getBillable
  )

module.exports = router
