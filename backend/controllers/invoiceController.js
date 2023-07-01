const Invoice = require('../model/invoiceModel')
const asyncHandler = require('express-async-handler')

// @desc    Create an invoice
// @route   POST /invoices
// @access  Private/Admin
const createInvoice = asyncHandler(async (req, res) => {
  const invoice = new Invoice({
    date: req.body.date,
    claim: req.body.claim,
    client: req.body.client,
    timeAmount: req.body.timeAmount,
    chargeAmount: req.body.chargeAmount,
    hours: req.body.hours,
  })

  const createdInvoice = await invoice.save()
  res.status(201).json(createdInvoice)
})

// @desc    Get invoices using search criteria
// @route   GET /invoices
// @access  Public
const getInvoices = asyncHandler(async (req, res) => {
  const { number, client, status } = req.query

  let condition = {}
  if (number) {
    condition['number'] = { $regex: new RegExp(number), $options: 'i' }
  }
  if (client) {
    condition['client'] = { $regex: new RegExp(client), $options: 'i' }
  }
  if (status) {
    condition['status'] = status
  }

  const invoices = await Invoice.find(condition).populate([
    { path: 'client', select: 'name' },
  ])

  res.json(invoices)
})

// @desc    Get invoice by id
// @route   GET /invoices/:id
// @access  Public
const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate([
    {
      path: 'client',
      select: ['name', 'addr1', 'addr2', 'addr3'],
    },
    { path: 'claim', select: ['name', 'number', 'claimant', 'vessel', 'dol'] },
  ])

  if (invoice) {
    res.json(invoice)
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

// @desc    Update an invoice
// @route   PUT /invoices/:id
// @access  Private/Admin
const updateInvoice = asyncHandler(async (req, res) => {
  const { number, date, claim, client, timeAmount, chargeAmount, status } =
    req.body

  const invoice = await Invoice.findById(req.params.id)

  if (invoice) {
    invoice.number = number
    invoice.date = date
    invoice.claim = claim
    invoice.client = client
    invoice.timeAmount = timeAmount
    invoice.chargeAmount = chargeAmount
    invoice.status = status
    const updatedInvoice = await invoice.save()
    res.json(updatedInvoice)
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

// @desc    Delete an invoice
// @route   DELETE /invoices/:id
// @access  Private/Admin
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)

  if (invoice) {
    await invoice.remove()
    res.json({ message: 'Invoice removed' })
  } else {
    res.status(404)
    throw new Error('Invoice not found')
  }
})

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
}
