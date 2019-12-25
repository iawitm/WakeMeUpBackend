const Request = require('../models/request');
const User = require('../models/user');

exports.newRequest = (req, res, next) => {
	User.find({ login: req.body.query })
    .exec()
    .then(user => {
      if (user.length < 1) {
        	res.status(404).json({
          	message: "No such user"
        });
      } else {
      	const request = new Request({from: req.userData.userId, to: user[0]._id, accepted: false});
		request.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
			message: 'Request sent!',
			id: result._id });
		});
      }
    })
    .catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.getRequests = (req, res, next) => {
	Request.find({to: req.userData.userId})
	.select('_id from to accepted')
	.populate('from', ['_id', 'login', 'pictureURL'])
  	.populate('to', ['_id', 'login', 'pictureURL'])
	.exec()
	.then(requests => {
		res.status(200).json(requests);
	})
	.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
	});
}

exports.acceptRequest = async (req, res, next) => {
	if (req.userData.userId == req.body.to._id){
		Request.findOneAndDelete({_id: req.body._id})
			.exec()
			.then(async result =>{
				if (result) {
					console.log(result);
					await User.findOneAndUpdate({_id: req.body.from._id}, {$push: { friends: req.userData.userId}})
					await User.findOneAndUpdate({_id: req.userData.userId}, {$push: { friends: req.body.from._id}})
					res.status(201).json({ message: 'Friend added!' });
				} else {
					res.status(404).json({
          				message: "No such request"
        			});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
				error: err
			});
		});
	} else {
		res.status(401).json({ error: "Invalid Token for this request" })
	}
}

exports.rejectRequest = (req, res, next) => {
	Request.findOneAndDelete({_id: req.body._id})
			.exec()
			.then(result => {
				if (result) {
						res.status(200).json({
						message: 'Request rejected'
					});
				} else {
					res.status(404).json({
          				message: "No such request"
        			});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
				error: err
			});
	});
}
