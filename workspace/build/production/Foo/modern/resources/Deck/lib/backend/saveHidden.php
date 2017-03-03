<?php
$filename = "../../resources/Data/SlideContent/hidden/hidden.json";
$file = fopen( $filename, "w+" );
if ($file){
	fputs($file,$_POST["content"]);
	fclose( $file );
} else {
	echo("Unable to open file " + $filename);
}
?>
