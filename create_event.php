<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    exit;
}
// create_event.php
include 'config.php';
// Read the raw request body
$requestBody = file_get_contents('php://input');

// Decode the JSON data
$eventData = json_decode($requestBody, true);

$title = $eventData['title'];
$description = $eventData['description'];
$start_time = $eventData['start_time'];
$end_time = $eventData['end_time'];
$date = $eventData['date'];

$sql = "INSERT INTO events (title, description, start_time, end_time, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $title, $description, $start_time, $end_time, $date);

if ($stmt->execute()) {
    echo "Event created successfully";
} else {
    echo "Error: " . $stmt->error;
}
error_log(print_r($eventData, true)); 
$stmt->close();
$conn->close();
?>