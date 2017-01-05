<?php

$filePath = '../../' . $_POST["filePath"];
$fileId = $_POST["fileId"];
$fileType = $_POST["fileType"];

$fullName = $filePath . $fileId . $fileType;
$status = unlink( $fullName );
if ($status){
	echo($fullName . " deleted ");
} else {
	echo("Unable to delete file " . $fullName);
}
?>
