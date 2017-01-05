<?php
$filename = "../../Data/topics.js";
$file = fopen( $filename, "w+" );
if ($file){
	fputs($file,$_POST[content]);
	fclose( $file );
} else {
	echo("Unable to open file " + $filename);
}
?>