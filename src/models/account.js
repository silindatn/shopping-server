let mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
  name: { type: String, required: true},
  owner: {  type: Schema.ObjectId, ref: 'user'},
  balance: { type: Number, required: false, default: 0},
  lastTopUpDate: { type: Date, required: false, default: null}
});

AccountSchema.options.toJSON = AccountSchema.options.toJSON || {};

const Account = mongoose.model('account', AccountSchema);

module.exports = Account;
