require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database');
const Contact = require('./models/Contact');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
	const { name, email, phone, subject, message } = req.body || {};

	if (!name || !email || !subject || !message) {
		return res.status(400).json({
			success: false,
			message: 'Name, email, subject, and message are required.'
		});
	}

	try {
		await Contact.create({
			name,
			email,
			phone: phone || '',
			subject,
			message
		});
	} catch (error) {
		console.error('Failed to store contact request:', error);
		return res.status(500).json({
			success: false,
			message: 'Unable to save your message right now. Please try again later.'
		});
	}

	res.status(200).json({
		success: true,
		message: 'Your message has been received successfully.'
	});
});

app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found.'
	});
});

module.exports = app;

async function startServer() {
	try {
		await connectDatabase();
		app.listen(port, () => {
			console.log(`Backend server running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error('Server startup failed:', error.message);
		process.exit(1);
	}
}

if (process.env.VERCEL !== '1') {
	startServer();
}
