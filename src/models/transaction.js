let mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  name: { type: String, required: true},
  request: { type: Object, required: false, default: {}},
  response: { type: Object, required: false, default: {}},
  user: { type: Schema.ObjectId, ref: 'user'},
  product: { type: Schema.ObjectId, ref: 'product'},
  amount: {type: Number, default: 0},
  TransactionDate: { type: Date, required: false, default: Date.now()}
});

TransactionSchema.options.toJSON = TransactionSchema.options.toJSON || {};

const Transaction = mongoose.model('transaction', TransactionSchema);

module.exports = Transaction;
