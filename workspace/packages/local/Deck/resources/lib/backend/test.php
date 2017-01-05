<?php
$oldFileId = "../../Data/pages/" . $_POST[fileId] . ".html";
$newFileId = "../../Data/archive/" . $_POST[fileId] . ".html";
rename($oldFileId, $newFileId);
echo($_POST[fileId] . " has been moved to " . $newFileId);
?>