const Payee = require('../model/payeeModel')
const asyncHandler = require('express-async-handler')

// @desc    Create a payee
// @route   POST /payees
// @access  Private/Admin
const createPayee = asyncHandler(async (req, res) => {
  const payee = new Payee({
    name: req.body.name,
    addr1: req.body.addr1,
    addr2: req.body.addr2,
    addr3: req.body.addr3,
    isActive: req.body.isActive,
  })

  const createdPayee = await payee.save()
  res.status(201).json(createdPayee)
})

// @desc    Get payees using search criteria
// @route   GET /payees
// @access  Public
const getPayees = asyncHandler(async (req, res) => {
  const { name, isActive } = req.query

  let condition = {}
  if (name) {
    condition['name'] = { $regex: new RegExp(name), $options: 'i' }
  }
  if (isActive) {
    condition['isActive'] = isActive
  }

  const payees = await Payee.find(condition)

  res.json(payees)
})

// @desc    Get payee by id
// @route   GET /payees/:id
// @access  Public
const getPayee = asyncHandler(async (req, res) => {
  const payee = await Payee.findById(req.params.id)

  if (payee) {
    res.json(payee)
  } else {
    res.status(404)
    throw new Error('Payee not found')
  }
})

// @desc    Update a payee
// @route   PUT /payees/:id
// @access  Private/Admin
const updatePayee = asyncHandler(async (req, res) => {
  const { name, addr1, addr2, addr3, isActive } = req.body

  const payee = await Payee.findById(req.params.id)

  if (payee) {
    payee.name = name
    payee.addr1 = addr1
    payee.addr2 = addr2
    payee.addr3 = addr3
    payee.isActive = isActive

    const updatedPayee = await payee.save()
    res.json(updatedPayee)
  } else {
    res.status(404)
    throw new Error('Payee not found')
  }
})

// @desc    Delete a payee
// @route   DELETE payees/:id
// @access  Private/Admin
const deletePayee = asyncHandler(async (req, res) => {
  const payee = await Payee.findById(req.params.id)

  if (payee) {
    await payee.remove()
    res.json({ message: 'Payee removed' })
  } else {
    res.status(404)
    throw new Error('Payee not found')
  }
})

// @desc    Get payee lookup list
// @route   GET /payees/lookup
// @access  Public
const lookupPayee = asyncHandler(async (req, res) => {
  const payees = await Payee.find({ isActive: true }, { _id: 1, name: 1 }).sort(
    {
      name: 1,
    }
  )
  res.json(payees)
})

module.exports = {
  createPayee,
  getPayees,
  getPayee,
  deletePayee,
  updatePayee,
  lookupPayee,
}
