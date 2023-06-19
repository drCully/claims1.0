const express = require('express')
const router = express.Router()
const claimController = require('../../controllers/claimController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route('/')
  .get(claimController.getClaims)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    claimController.createClaim
  )
router.route('/lookup').get(claimController.lookupClaim)
router
  .route('/:id')
  .get(claimController.getClaim)
  .delete(verifyRoles(ROLES_LIST.Admin), claimController.deleteClaim)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    claimController.updateClaim
  )

module.exports = router
