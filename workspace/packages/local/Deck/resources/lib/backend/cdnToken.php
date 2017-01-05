<?php

$form_url = 'http://cdn.sencha.com/auth/hook.php';

$fields   = array(
    'a' => '9aba43b64273091f0d04457f6da5edef',
    'e' => 'training@sencha.com',
    's' => TRUE,
    'u' => '/*'
);

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL            => $form_url,
    CURLOPT_HEADER         => FALSE,
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_FOLLOWLOCATION => TRUE,
    CURLOPT_POST           => TRUE,
    CURLOPT_POSTFIELDS     => $fields
));

$json = json_decode(curl_exec($curl));

setrawcookie('__tkn__', $json->token, time() + 60, '/', 'sencha.com');

curl_close($curl);


?>
