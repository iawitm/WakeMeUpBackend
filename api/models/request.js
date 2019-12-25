const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
	from: {type: mongoose.Schema.ObjectId, ref: 'User'},
    to: {type: mongoose.Schema.ObjectId, ref: 'User'},
    accepted: { type: Boolean, required: true }
});

module.exports = mongoose.model('Request', requestSchema);