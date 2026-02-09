const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
  billingName: {
    type: String,
    required: false,
    default: ""
  },
  billingAddress: {
    type: String,
    required: false,
    default: ""
  },
  billingCity: {
    type: String,
    required: false,
    default: ""
  },
  billingState: {
    type: String,
    required: false,
    default: ""
  },
  billingCountry: {
    type: String,
    required: false,
    default: ""
  },
  billingPostalCode: {
    type: String,
    required: false,
    default: ""
  },
  invoiceItemsList: [{
    type: String,
    required: true,
    default: ""
  }],
  invoiceID: {
    type: String,
    required: true,
    default: ""
  },
  invoiceNumber: {
    type: Number,
    required: true,
    default: 0
  },
  invoiceDate: {
    type: String,
    required: true,
    default: ""
  },
  invoiceTerm: {
    type: Number,
    required: true,
    default: 0
  },
  clientNumber: {
    type: Number,
    required: true,
    default: 0
  },
  amountPaid: {
    type: Number,
    required: false,
    default: 0
  }

});

const Invoice = mongoose.model("Invoice", invoiceSchema)

module.exports = Invoice

