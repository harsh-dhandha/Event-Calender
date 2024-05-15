<?php
// fetch_events.php
include 'config.php';
header('Content-Type: application/json');

$date = $_GET['date'];
$events = array();

// Check if the date parameter is provided
if (!empty($date)) {
    $sql = "SELECT * FROM events WHERE date = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch the events and store them in the $events array
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    $stmt->close();
}

// Convert the $events array to JSON and output it
echo json_encode($events);

$conn->close();
?>