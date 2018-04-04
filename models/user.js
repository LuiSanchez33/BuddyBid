const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValid = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a permitted rol'
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'The name is required'] },
  email: { type: String, unique: true, required: [true, 'The email is required'] },
  password: { type: String, required: [true, 'The password is required'] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValid }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
module.exports = mongoose.model('User', userSchema);