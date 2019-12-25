const User = require('../models/user');
const admin = require("firebase-admin");

exports.sendCall = async (req, res, next) => {
	let topic = req.body.recipient;
	let friend = await User.findOne({_id: req.userData.userId, friends: topic });

	if (friend) {
		let message = {
			android: {
				priority: 'high'
			},
			 data: {
				callType: 'wakeup'
			  },
			  topic: topic
			};
			admin.messaging().send(message)
				.then((response) => {
				// Response is a message ID string.
				console.log('Successfully sent message:', response);
				res.status(201).json({
					 message: 'Call sent!'
				 });
			  })
			  .catch((error) => {
				console.log('Error sending message:', error);
				res.status(500).json({
						 err: error
				 });
			  });
	} else {
		res.status(401).json({
			message: 'No friend with given ID'
		});
	}
}