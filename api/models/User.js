const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
  favorites: [{type: Schema.Types.ObjectId, ref: 'Place'}],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
