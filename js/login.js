<?php
session_start();
require 'vendor/autoload.php'; // Ensure you have installed Predis via Composer

use Predis\Client as PredisClient;

// Create a new Redis client
$redis = new PredisClient();

// Retrieve POST data
$username = $_POST['username'];
$password = $_POST['password'];

// Sample user validation (replace with actual validation logic)
if ($username === 'user' && $password === 'password') {
    // Generate a session ID and store it in Redis
    $sessionId = bin2hex(random_bytes(16));
    $redis->set("session:$sessionId", $username, 'EX', 3600); // 1-hour expiry

    // Return a JSON response
    echo json_encode([
        'success' => true,
        'sessionId' => $sessionId
    ]);
} else {
    // Return a JSON response for failed login
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
}
?>
#javascript
$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: { username, password },
            success: function(response) {
                response = JSON.parse(response);
                if (response.success) {
                    localStorage.setItem('sessionId', response.sessionId);
                    window.location.href = 'profile.html';
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error logging in.');
            }
        });
    });
});
