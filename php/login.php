<?php
require_once "../_config/db.php";

$email = $_POST['gmail'];
$password = $_POST['gpassword'];
$sql = "SELECT * FROM user_details WHERE email=? and password = ?"; // SQL with parameters
$stmt = $con->prepare($sql); 
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result(); 
$user = $result->fetch_assoc(); 

if ($user) {
    exit(json_encode([
        'status' => 'success',
        'status_code' => 200,
        'message' => 'logged in successfully.',
        'user' => $user
    ]));
} else {
    exit(json_encode([
        'status' => 'error',
        'status_code' => 400,
        'message' => 'Invalid email or password.',
    ])); 
}
?>
