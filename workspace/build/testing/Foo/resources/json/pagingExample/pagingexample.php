<?php


$earthquakes = json_decode(file_get_contents('earthquakes.json'));

$response = array();
$start = $_GET["start"];
$limit = $_GET["limit"];
$count = count($earthquakes);

for ($i = 0 ; $i < $limit ; $i++){
    $index = $start + $i;
    if ($index >= $count){
    	break;
    }
    array_push($response, $earthquakes[$index]);
}

// Package response json: success, total and data

$r = new stdClass;
$r->success = true;
$r->total = $count;
$r->data = $response;

$encoded = json_encode($r);

echo $encoded ;

?>