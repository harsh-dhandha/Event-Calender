<?php
// update_event.php
include 'config.php';

$id = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];
$date = $_POST['date'];

$sql = "UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, date = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $title, $description, $start_time, $end_time, $date, $id);

if ($stmt->execute()) {
    echo "Event updated successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>