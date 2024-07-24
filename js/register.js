mkdir myapp
cd myapp
npm init -y
npm install express redis body-parser
const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a Redis client
const client = redis.createClient();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., your HTML, CSS, and JS files)
app.use(express.static('public'));

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Check if user already exists
    client.hgetall(`user:${username}`, (err, user) => {
        if (err) {
            return res.json({ success: false, message: 'Error checking user.' });
        }

        if (user) {
            return res.json({ success: false, message: 'User already exists.' });
        }

        // Store user data in Redis
        client.hmset(`user:${username}`, { password, email }, (err) => {
            if (err) {
                return res.json({ success: false, message: 'Error registering user.' });
            }

            res.json({ success: true, message: 'User registered successfully.' });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();

        $.ajax({
            type: 'POST',
            url: '/register', // Make sure this matches the endpoint in your server.js
            data: JSON.stringify({ username, password, email }), // Send data as JSON
            contentType: 'application/json', // Specify content type
            success: function(response) {
                response = JSON.parse(response);
                if (response.success) {
                    window.location.href = 'login.html';
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error registering.');
            }
        });
    });
});
