const mongoose = require("mongoose")

const workDoneSchema = new mongoose.Schema({
  clientNumber: {
    type: Number,
    required: true,
    default: 0
  },
  itemDesc: {
    type: String,
    required: true,
    default: ""
  },
  itemDate: {
    type: String,
    required: true,
    default: ""
  },
  itemCost: {
    type: Number,
    required: true,
    default: 0
  },
  itemQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  tasks: [{
    taskDesc: {
      type: String,
      required: true,
      default: ""
    }
  }],
  isBilled: { // Is item already on an invoice?
    type: Boolean,
    required: true,
    default: false
  },
  workID: { // Is item already on an invoice?
    type: String,
    required: true,
    default: ""
  }
});

const WorkDone = mongoose.model("WorkDone", workDoneSchema)

module.exports = WorkDone
