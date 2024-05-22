<?php
require 'db.php';
require 'session.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = 'SELECT id, password FROM users WHERE username = ?';
$stmt = $pdo->prepare($sql);
$stmt->execute([$username]);

$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    $sessionId = createSession($user['id']);
    echo json_encode(['success' => true, 'sessionId' => $sessionId]);
} else {
    echo json_encode(['success' => false,
