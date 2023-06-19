const Claim = require('../model/claimModel')
const asyncHandler = require('express-async-handler')

// @desc    Create a claim
// @route   POST /claims
// @access  Private/Admin
const createClaim = asyncHandler(async (req, res) => {
  const claim = new Claim({
    number: req.body.number,
    name: req.body.name,
    claimant: req.body.claimant,
    manager: req.body.manager,
    reference: req.body.reference,
    vessel: req.body.vessel,
    dol: req.body.dol,
    isActive: req.body.isActive,
  })

  const createdClaim = await claim.save()
  res.status(201).json(createdClaim)
})

// @desc    Get claims using search criteria
// @route   GET /claims
// @access  Public
const getClaims = asyncHandler(async (req, res) => {
  const { name, isActive } = req.query

  let condition = {}
  if (name) {
    condition['name'] = { $regex: new RegExp(name), $options: 'i' }
  }
  if (isActive) {
    condition['isActive'] = isActive
  }

  const claims = await Claim.find(condition)

  res.json(claims)
})

// @desc    Get claim by id
// @route   GET /claims/:id
// @access  Public
const getClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate([
    {
      path: 'manager',
      select: 'firstname',
    },
    {
      path: 'client',
      select: ['name', 'addr1', 'addr2', 'addr3'],
    },
  ])

  if (claim) {
    res.json(claim)
  } else {
    res.status(404)
    throw new Error('Claim not found')
  }
})

// @desc    Update a claim
// @route   PUT /claims/:id
// @access  Private/Admin
const updateClaim = asyncHandler(async (req, res) => {
  const { number, name, claimant, manager, reference, vessel, dol, isActive } =
    req.body

  const claim = await Claim.findById(req.params.id)

  if (claim) {
    claim.number = number
    claim.name = name
    claim.claimant = claimant
    claim.manager = manager
    claim.reference = reference
    claim.vessel = vessel
    claim.dol = dol
    claim.isActive = isActive

    const updatedClaim = await claim.save()
    res.json(updatedClaim)
  } else {
    res.status(404)
    throw new Error('Claim not found')
  }
})

// @desc    Delete a claim
// @route   DELETE /claims/:id
// @access  Private/Admin
const deleteClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)

  if (claim) {
    await claim.remove()
    res.json({ message: 'Claim removed' })
  } else {
    res.status(404)
    throw new Error('Claim not found')
  }
})

// @desc    Get claim lookup list
// @route   GET /claims/lookup
// @access  Public
const lookupClaim = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ isActive: true }, { _id: 1, name: 1 }).sort(
    {
      name: 1,
    }
  )
  res.json(claims)
})

module.exports = {
  createClaim,
  getClaims,
  getClaim,
  deleteClaim,
  updateClaim,
  lookupClaim,
}
