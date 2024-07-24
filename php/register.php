<?php
session_start();
require_once "../_config/db.php";
require 'vendor/autoload.php'; // Ensure Redis client is loaded

use Predis\Client as PredisClient;

// Create a new Redis client
$redis = new PredisClient();

if (!isset($_POST['submit'])) {
    $name = $_POST['gname'];
    $email = $_POST['gmail'];
    $age = $_POST['gage'];
    $date_of_birth = $_POST['gdateofbirth'];
    $number = $_POST['gnumber'];
    $address = $_POST['gaddress'];
    $password = $_POST['gpassword'];

    // Check if the email is already in Redis
    $cacheKey = "user_email:$email";
    $cachedEmail = $redis->get($cacheKey);

    if ($cachedEmail) {
        exit(json_encode([
            'status' => 'error',
            'status_code' => 400,
            'message' => 'Email id already exists.'
        ]));
    } else {
        // Check the database if not in Redis
        $sql = "SELECT * FROM user_details WHERE email=?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            // Store email in Redis with a timeout to avoid frequent DB hits
            $redis->setex($cacheKey, 600, $email); // 10 minutes expiry
            exit(json_encode([
                'status' => 'error',
                'status_code' => 400,
                'message' => 'Email id already exists.'
            ]));
        }
    }

    $stmt = $con->prepare("INSERT INTO user_details (name, email, age, dob, contact, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $name, $email, $age, $date_of_birth, $number, $address, $password);

    if ($stmt->execute()) {
        // Store email in Redis after successful registration
        $redis->setex($cacheKey, 3600, $email); // 1 hour expiry
        exit(json_encode([
            'status' => 'success',
            'status_code' => 200,
            'message' => 'REGISTER successfully.',
        ]));
    } else {
        exit(json_encode([
            'status' => 'error',
            'status_code' => 500,
            'message' => 'Failed to insert data into the database.',
        ]));
    }
}
?>
