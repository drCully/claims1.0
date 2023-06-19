const mongoose = require('mongoose')
const Schema = mongoose.Schema

const claimSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    claimant: {
      type: String,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    reference: {
      type: String,
    },
    vessel: {
      type: String,
    },
    dol: {
      type: Date,
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Claim', claimSchema)
