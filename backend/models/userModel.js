const mongoose= require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const passwordValidator = require('password-validator');

const pwdSchema = new passwordValidator();

pwdSchema
.is().min(6, "password should be at least 6 characters long")
.has().uppercase(2, "password should contain at least 2 uppercase characters")
.has().digits(2, "password, should contain at least 2 digits");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);