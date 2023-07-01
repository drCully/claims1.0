const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chargeSchema = new Schema(
  {
    timekeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
    },
    date: Date,
    description: String,
    amount: Number,
    billable: Boolean,
    billed: Boolean,
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Charge', chargeSchema)
