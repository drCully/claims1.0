const express = require('express')
const router = express.Router()
const chargeController = require('../../controllers/chargeController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(chargeController.getCharges)
  .post(chargeController.createCharge)
router
  .route('/:id')
  .get(chargeController.getCharge)
  .delete(chargeController.deleteCharge)
  .put(chargeController.updateCharge)

module.exports = router
