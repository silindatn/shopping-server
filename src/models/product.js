let mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: { type: String, required: true},
  image: { type: String, required: false, default: null},
  price: { type: Number, required: false, default: 0},
  special_discount: { type: Number, required: false, default: 0}
});

ProductSchema.options.toJSON = ProductSchema.options.toJSON || {};

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
