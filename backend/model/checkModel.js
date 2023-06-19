const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkSchema = new Schema(
  {
    number: Number,
    date: Date,
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payee',
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
    },
    amount: Number,
    memo: String,
  },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Check', checkSchema)
