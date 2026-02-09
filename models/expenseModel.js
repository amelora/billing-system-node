const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
  expenseID: {
    type: String,
    required: true,
    default: ""
  },
  expenseDesc: {
    type: String,
    required: true,
    default: ""
  },
  expenseCategory: {
    type: String,
    required: true,
    default: ""
  },
  expenseDate: {
    type: String,
    required: true,
    default: ""
  },
  expenseAmount: {
    type: Number,
    required: true,
    default: 0
  },
  expenseGST: {
    type: Number,
    required: true,
    default: 0
  },
  expensePST: {
    type: Number,
    required: true,
    default: 0
  }
})

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense