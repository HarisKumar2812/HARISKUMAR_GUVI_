#sudo apt-get install redis-server
#sudo apt install nodejs npm
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

// Endpoint to get user profile
app.post('/profile', (req, res) => {
    const sessionId = req.body.sessionId;

    client.get(`session:${sessionId}`, (err, username) => {
        if (err || !username) {
            return res.json({ success: false, message: 'Session expired or invalid.' });
        }

        // Sample profile data (replace with actual user data retrieval logic)
        const profileData = {
            username: username,
            email: 'user@example.com' // Dummy email
        };

        res.json({ success: true, data: profileData });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
$(document).ready(function() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        window.location.href = 'login.html';
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/profile',
        data: { sessionId },
        success: function(response) {
            if (response.success) {
                $('#profileInfo').html(`
                    <p>Username: ${response.data.username}</p>
                    <p>Email: ${response.data.email}</p>
                `);
            } else {
                alert(response.message);
                window.location.href = 'login.html';
            }
        },
        error: function() {
            alert('Error fetching profile.');
        }
    });

    $('#logoutBtn').on('click', function() {
        localStorage.removeItem('sessionId');
        window.location.href = 'login.html';
    });
});
