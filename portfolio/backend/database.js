const mongoose = require('mongoose');

async function connectDatabase() {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		throw new Error('MONGODB_URI is not set. Add it to your environment variables.');
	}

	await mongoose.connect(mongoUri);
	console.log('Connected to MongoDB Atlas');
}

module.exports = {
	connectDatabase
};
