const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String,
    enum: ['active', 'inactive','deleted'],
    default: 'active' 
  },
  deletedAt:{
    type: Date,
    default: null,
  }
},{timestamps:true}

);

module.exports = mongoose.model('Category', categorySchema);
