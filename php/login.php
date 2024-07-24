#pecl install redis
<?php
require_once "../_config/db.php";
require 'vendor/autoload.php'; // Ensure Redis client is loaded (if using Composer)

use Predis\Client as PredisClient;

// Create a new Redis client
$redis = new PredisClient();

// Retrieve POST data
$email = $_POST['gmail'];
$password = $_POST['gpassword'];

// Prepare and execute SQL query to check user credentials
$sql = "SELECT * FROM user_details WHERE email=? and password=?";
$stmt = $con->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    // Generate a session ID
    $sessionId = bin2hex(random_bytes(16));

    // Store user session data in Redis
    $redis->hmset("session:$sessionId", [
        'email' => $email,
        'username' => $user['username'] // Assuming you have a username field
    ]);
    // Set session expiry (e.g., 1 hour)
    $redis->expire("session:$sessionId", 3600);

    exit(json_encode([
        'status' => 'success',
        'status_code' => 200,
        'message' => 'Logged in successfully.',
        'user' => $user,
        'sessionId' => $sessionId // Return the session ID to the client
    ]));
} else {
    exit(json_encode([
        'status' => 'error',
        'status_code' => 400,
        'message' => 'Invalid email or password.',
    ]));
}
?>
#composer require predis/predis
$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: { gmail: email, gpassword: password },
            success: function(response) {
                response = JSON.parse(response);
                if (response.status === 'success') {
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
