const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  clientNumber: {
    type: Number,
    required: true,
    default: ""
  },
  billingName: {
    type: String,
    required: true,
    default: ""
  },
  billingAddress: {
    type: String,
    required: true,
    default: ""
  },
  billingCity: {
    type: String,
    required: true,
    default: ""
  },
  billingState: {
    type: String,
    required: true,
    default: ""
  },
  billingCountry: {
    type: String,
    required: true,
    default: ""
  },
  billingPostalCode: {
    type: String,
    required: true,
    default: ""
  },
  shippingName: {
    type: String,
    required: false,
    default: ""
  },
  shippingAddress: {
    type: String,
    required: false,
    default: ""
  },
  shippingCity: {
    type: String,
    required: false,
    default: ""
  },
  shippingState: {
    type: String,
    required: false,
    default: ""
  },
  shippingCountry: {
    type: String,
    required: false,
    default: ""
  },
  shippingPostalCode: {
    type: String,
    required: false,
    default: ""
  },
  contacts: [{
    contactFirstName: {
      type: String,
      required: false,
      default: ""
    },
    contactLastName: {
      type: String,
      required: false,
      default: ""
    },
    contactPhone: {
      type: String,
      required: false,
      default: ""
    },
    contactEmail: {
      type: String,
      required: false,
      default: ""
    }
  }]
});

const Client = mongoose.model("Client", clientSchema)

module.exports = Client

