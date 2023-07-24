const Check = require('../model/checkModel')
const asyncHandler = require('express-async-handler')

// @desc    Create a check
// @route   POST /checks
// @access  Private/User
const createCheck = asyncHandler(async (req, res) => {
  const check = new Check({
    number: req.body.number,
    date: req.body.date,
    payee: req.body.payee,
    claim: req.body.claim,
    amount: req.body.amount,
    memo: req.body.memo,
  })

  const createdCheck = await check.save()
  res.status(201).json(createdCheck)
})

// @desc    Get checks using search criteria
// @route   GET /checks
// @access  Public
const getChecks = asyncHandler(async (req, res) => {
  const { number, claim, billable, billed } = req.query

  let condition = {}
  if (number) {
    condition['number'] = { $regex: new RegExp(number), $options: 'i' }
  }
  if (claim) {
    condition['claim'] = claim
  }
  if (billable) {
    condition['billable'] = billable
  }
  if (billed) {
    condition['billed'] = billed
  }

  const checks = await Check.find(condition)
    .populate({
      path: 'payee',
      select: 'name',
    })
    .populate({
      path: 'claim',
      select: 'name',
    })

  res.json(checks)
})

// @desc    Get check by id
// @route   GET checks/:id
// @access  Public
const getCheck = asyncHandler(async (req, res) => {
  const check = await Check.findById(req.params.id)

  if (check) {
    res.json(check)
  } else {
    res.status(404)
    throw new Error('Check not found')
  }
})

// @desc    Update a check
// @route   PUT /checks/:id
// @access  Private/Admin
const updateCheck = asyncHandler(async (req, res) => {
  const { number, date, payee, claim, amount, memo } = req.body

  const check = await Check.findById(req.params.id)

  if (check) {
    check.number = number
    check.date = date
    check.payee = payee
    check.claim = claim
    check.amount = amount
    check.memo = memo

    const updatedCheck = await check.save()
    res.json(updatedCheck)
  } else {
    res.status(404)
    throw new Error('Check not found')
  }
})

// @desc    Delete a check
// @route   DELETE /checks/:id
// @access  Private/Admin
const deleteCheck = asyncHandler(async (req, res) => {
  const check = await Check.findById(req.params.id)

  if (check) {
    await check.remove()
    res.json({ message: 'Check removed' })
  } else {
    res.status(404)
    throw new Error('Check not found')
  }
})

// @desc    Get check lookup list
// @route   GET /checks/lookup
// @access  Public
const lookupCheck = asyncHandler(async (req, res) => {
  const checks = await Check.find({}, { _id: 1, number: 1 }).sort({
    name: 1,
  })
  res.json(checks)
})

module.exports = {
  createCheck,
  getChecks,
  getCheck,
  updateCheck,
  deleteCheck,
  lookupCheck,
}
