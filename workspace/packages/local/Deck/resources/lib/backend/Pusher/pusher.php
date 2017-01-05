<?php

require('vendor/pusher/pusher-php-server/lib/Pusher.php');

$pageId = $_POST[pageId];
$appUUID = $_POST[uuid];
$event = $_POST[event];

$channel = 'nouveau_' . $appUUID;

$key = '9f7625c09d92f0854c74';
$secret = 'f131f5bb7d5720dbba02';
$appId = '57863';

$pusher = new Pusher($key, $secret, $appId);
$pusher->trigger($channel, $event, array('id' => $pageId) );

echo("Channel = " . $channel . ", event = " . $event . ", data = [" . $pageId . "]");

?>

