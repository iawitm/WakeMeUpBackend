const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9A-Z]+/
    },
    password: { type: String, required: true },
    pictureURL: { type: String, required: true },
    friends: [{ type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', userSchema);