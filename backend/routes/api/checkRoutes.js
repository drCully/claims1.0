const express = require('express')
const router = express.Router()
const checkController = require('../../controllers/checkController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(checkController.getChecks)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    checkController.createCheck
  )
router.route('/lookup').get(checkController.lookupCheck)
router
  .route('/:id')
  .get(checkController.getCheck)
  .delete(verifyRoles(ROLES_LIST.Admin), checkController.deleteCheck)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    checkController.updateCheck
  )

module.exports = router
