const Charge = require('../model/chargeModel')
const asyncHandler = require('express-async-handler')

// @desc    Create an charge
// @route   POST /charges
// @access  Private/Admin
const createCharge = asyncHandler(async (req, res) => {
  const charge = new Charge({
    timekeeper: req.body.timekeeper,
    claim: req.body.claim,
    date: req.body.date,
    description: req.body.description,
    amount: req.body.amount,
    billable: req.body.billable,
    billed: req.body.billed,
    billing: req.body.billing,
  })

  const createdCharge = await charge.save()
  res.status(201).json(createdCharge)
})

// @desc    Get charges using search criteria
// @route   GET /charges
// @access  Public
const getCharges = asyncHandler(async (req, res) => {
  const { date, timekeeper, claim, lastdate, billable, billed, invoice } =
    req.query

  let condition = {}
  if (date) {
    condition['date'] = date
  }
  if (timekeeper) {
    condition['timekeeper'] = timekeeper
  }
  if (claim) {
    condition['claim'] = claim
  }
  if (lastdate) {
    condition['date'] = JSON.parse('{"$lte": "' + lastdate + '"}')
  }
  if (billable) {
    condition['billable'] = billable
  }
  if (billed) {
    condition['billed'] = billed
  }
  if (invoice) {
    condition['invoice'] = invoice
  }

  const charges = await Charge.find(condition).populate([
    {
      path: 'timekeeper',
      select: 'firstname',
    },
    { path: 'claim', select: 'name' },
  ])

  res.json(charges)
})

// @desc    Get charge by id
// @route   GET /charges/:id
// @access  Public
const getCharge = asyncHandler(async (req, res) => {
  const charge = await Charge.findById(req.params.id)

  if (charge) {
    res.json(charge)
  } else {
    res.status(404)
    throw new Error('Charge not found')
  }
})

// @desc    Update an charge
// @route   PUT /charges/:id
// @access  Private/Admin
const updateCharge = asyncHandler(async (req, res) => {
  const {
    timekeeper,
    claim,
    date,
    description,
    amount,
    billable,
    billed,
    billing,
    invoice,
  } = req.body

  const charge = await Charge.findById(req.params.id)

  if (charge) {
    charge.timekeeper = timekeeper
    charge.claim = claim
    charge.date = date
    charge.description = description
    charge.amount = amount
    charge.billable = billable
    charge.billed = billed
    charge.billing = billing
    charge.invoice = invoice

    const updatedCharge = await charge.save()
    res.json(updatedCharge)
  } else {
    res.status(404)
    throw new Error('Charge not found')
  }
})

// @desc    Delete a charge record
// @route   DELETE /api/charges/:id
// @access  Private/Admin
const deleteCharge = asyncHandler(async (req, res) => {
  const charge = await Charge.findById(req.params.id)

  if (charge) {
    await charge.remove()
    res.json({ message: 'Charge removed' })
  } else {
    res.status(404)
    throw new Error('Charge not found')
  }
})

module.exports = {
  createCharge,
  getCharges,
  getCharge,
  updateCharge,
  deleteCharge,
}
