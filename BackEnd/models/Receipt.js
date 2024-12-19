const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: null,
  },
  storeName:{
    type: String,
    default:'GULAY-FARM',
    required: true,
  },
  storeAdress:{
    type: String,
    default: 'Store Address',
  },
  storeSecondAddress:{
    type: String,
    default: 'Second Address',
  },
  contact:{
    type: String,
    default: null
  },
  message:{
    type: String,
    default: null,
  },
  description:{
    type: String,
    default: null,
  },
  status:{
    type: Boolean,
    default: true,
  }
 
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
