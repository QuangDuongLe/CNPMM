const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  picture: {
    type: String,
  },
  isHide: {
    type: Boolean,
    default: false,
  },
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
