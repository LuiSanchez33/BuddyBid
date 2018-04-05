const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const categorySchema = new mongoose.Schema({
  type: { type: String, unique: true, required: [true, 'the category is required'] },
  img: { type: String, required: false },
  user: { type: ObjectId, ref: 'User', required: true }
}, { collection: 'categories' });

module.exports = mongoose.model('Category', categorySchema);

