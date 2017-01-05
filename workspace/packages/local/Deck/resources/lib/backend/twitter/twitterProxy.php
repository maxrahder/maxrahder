<?php
require 'twitterCredentials.php';
require 'tmhOAuth/tmhOAuth.php';
$query = htmlspecialchars($_GET['query']);
if (empty($query)) {
    $query = "extjs";
}
$connection = new tmhOAuth(array(
    'consumer_key' => $consumer_key,
    'consumer_secret' => $consumer_secret,
    'user_token' => $user_token,
    'user_secret' => $user_secret
));

$http_code = $connection->request('GET',
    'https://api.twitter.com/1.1/search/tweets.json',
    array('q' => $query, 'lang' => 'en')
);

if ($http_code == 200) {
    $response = $connection->response['response'];
    print($response);
}
else {
    if ($http_code == 429) {
        print 'Error: Twitter API rate limit reached';
    }
    else {
        $response = json_decode($connection->response['response'],true);
        print $response;
        print 'Error: Twitter was not able to process that request';
    }
} 
?>
