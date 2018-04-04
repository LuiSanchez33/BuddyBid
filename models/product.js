const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema({
  sku: { type: String, unique: true, required: [true, 'the sku is required'] },
  name: { type: String, required: [true, 'the name is required'] },
  description: { type: String, required: [true, 'the description is required'] },
  image: { type: String, required: false },
  price: { type: String, required: [true, 'the price is required'] },
  available: { type: String, required: [true, 'the available is required'] },
  user: { type: ObjectId, ref: 'User', required: true },
  category: { type: ObjectId, ref: 'Category', required: true }

}, { collection: 'products' });

const Product = module.exports = mongoose.model('Product', ProductSchema);
