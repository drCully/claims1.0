const express = require('express')
const router = express.Router()
const payeeController = require('../../controllers/payeeController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(payeeController.getPayees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    payeeController.createPayee
  )
router.route('/lookup').get(payeeController.lookupPayee)
router
  .route('/:id')
  .get(payeeController.getPayee)
  .delete(verifyRoles(ROLES_LIST.Admin), payeeController.deletePayee)
  .put(payeeController.updatePayee)

module.exports = router
