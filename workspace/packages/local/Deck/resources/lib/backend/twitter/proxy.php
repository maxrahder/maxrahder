<?php
echo(file_get_contents("http://search.twitter.com/search.json?limit=100&q=".$_GET["q"]));
?>