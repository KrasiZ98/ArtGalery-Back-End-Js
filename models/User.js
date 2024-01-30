const { Schema, model } = require('mongoose');

//const NAME_PATTERN = /^[A-Z][a-z]+\s[A-Z][a-z]+$/gm;

const userSchema = new Schema({
    username: {type: String, unique: true, minlength: [4, 'The username should be at least 4 characters long']},
    hashedPassword: {type: String, required: true,  minlength: [3, 'The password should be at least 3 characters long']},
    address: {type: String, required: true},
});


userSchema.index({username: 1}, {
    collation: {
        locale: 'en',
        strength: 2,
    },
});


const User = model('User', userSchema);
module.exports = User;

// • The username should be at least 4 characters long
// • The password should be at least 3 characters long
// • The repeat password should be equal to the password