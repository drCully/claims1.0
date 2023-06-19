const mongoose = require('mongoose')
const Schema = mongoose.Schema

const payeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    addr1: {
      type: String,
      required: false,
    },
    addr2: {
      type: String,
      required: false,
    },
    addr3: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Payee', payeeSchema)
