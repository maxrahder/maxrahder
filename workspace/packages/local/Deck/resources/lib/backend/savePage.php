<?php

$filePath = '../../' . $_POST["filePath"];
$fileId = $_POST["fileId"];
$fileType = $_POST["fileType"];

$fullName = $filePath . $fileId . $fileType;

$content = $_POST["content"];

echo("Saving " . $fullName . ':\n' . $content);

$file = fopen( $fullName , "w+" );

if ($file) {
	fputs($file,$content);
	fclose( $file );
} else {
	echo("Could not open " + $fileId);
}
?>