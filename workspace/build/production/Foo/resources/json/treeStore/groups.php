<?php
$group = $_GET[node];
$groupFile = $group . ".json" ;
echo(file_get_contents($groupFile   ));
?>