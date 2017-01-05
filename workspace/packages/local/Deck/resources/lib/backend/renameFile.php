<?php

$oldName = '../../' . $_POST['oldName'];
$newName = '../../' . $_POST['newName'];

rename($oldName, $newName);
echo($oldName . " has been moved to " . $newName);

?>
