const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Create a Redis client
const client = redis.createClient();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submissions
app.post('/submit', (req, res) => {
    const { name, age, dob, contact, address } = req.body;

    // Validate input
    if (!name || !age || !dob || !contact || !address) {
        return res.json({ status: 'error', message: 'All fields are required' });
    }

    // Age validation (2 digits only)
    if (age.length !== 2 || isNaN(age)) {
        return res.json({ status: 'error', message: 'Enter 2 digits only for age' });
    }

    // Contact number validation (10 digits)
    if (contact.length !== 10 || isNaN(contact)) {
        return res.json({ status: 'error', message: 'Enter 10 digits only for contact number' });
    }

    // Check valid contact number starting digit
    const validStartDigits = ['6', '7', '8', '9'];
    if (!validStartDigits.includes(contact.charAt(0))) {
        return res.json({ status: 'error', message: 'Invalid contact number' });
    }

    // Address validation (up to 70 characters)
    if (address.length > 70) {
        return res.json({ status: 'error', message: 'Address cannot exceed 70 characters' });
    }

    // Save data to Redis
    client.hmset(`user:profile:${name}`, {
        age,
        dob,
        contact,
        address
    }, (err) => {
        if (err) {
            return res.json({ status: 'error', message: 'Error saving data to Redis' });
        }
        res.json({ status: 'success', message: 'Profile updated successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
