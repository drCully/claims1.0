const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const invoiceSchema = new Schema(
  {
    number: Number,
    date: Date,
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    timeAmount: Number,
    chargeAmount: Number,
    status: {
      type: String,
      default: 'posted',
    },
  },

  { timestamps: true }
)

invoiceSchema.plugin(AutoIncrement, {
  inc_field: 'number',
  id: 'invoiceNums',
  start_seq: 22030,
})

module.exports = mongoose.model('Invoice', invoiceSchema)
