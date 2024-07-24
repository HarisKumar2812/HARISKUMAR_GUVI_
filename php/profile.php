<?php
require_once "../_config/db.php";
require 'vendor/autoload.php'; // Ensure Redis client is loaded

use Predis\Client as PredisClient;

// Create a new Redis client
$redis = new PredisClient();

// Get the email from POST data
$email = $_POST['gmail'];

// Check Redis cache first
$cacheKey = "user_details:$email";
$userDetails = $redis->get($cacheKey);

if ($userDetails) {
    // If cache hit, return the cached data
    header('Content-Type: application/json');
    echo $userDetails;
} else {
    // Fetch from the database if not in cache
    $sql = "SELECT name, age, dob, contact, address FROM user_details WHERE email=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        $name = $user['name'];
        $age = $user['age'];
        $dob = $user['dob'];
        $contact = $user['contact'];
        $address = $user['address'];

        $response = array(
            'value1' => $name,
            'value2' => $age,
            'value3' => $dob,
            'value4' => $contact,
            'value5' => $address
        );

        // Cache the result in Redis with an expiry time (e.g., 10 minutes)
        $redis->setex($cacheKey, 600, json_encode($response));

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        header('Content-Type: application/json');
        echo json_encode(array(
            'status' => 'error',
            'message' => 'User not found'
        ));
    }
}
?>
$(document).ready(function() {
    $('#fetchUserDetails').on('click', function() {
        const email = $('#email').val();

        $.ajax({
            type: 'POST',
            url: 'php/fetch_user_details.php',
            data: { gmail: email },
            success: function(response) {
                response = JSON.parse(response);
                if (response.status === 'error') {
                    alert(response.message);
                } else {
                    $('#userDetails').html(`
                        <p>Name: ${response.value1}</p>
                        <p>Age: ${response.value2}</p>
                        <p>Date of Birth: ${response.value3}</p>
                        <p>Contact: ${response.value4}</p>
                        <p>Address: ${response.value5}</p>
                    `);
                }
            },
            error: function() {
                alert('Error fetching user details.');
            }
        });
    });
});
