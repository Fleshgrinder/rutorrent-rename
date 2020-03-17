<?php

require_once __DIR__.'/utils.php';

check(
    $_SERVER['REQUEST_METHOD'] === 'POST',
    "Only POST requests are allowed, got: {$_SERVER['REQUEST_METHOD']}",
    415
);

$data = jsonDecodeRequestBody();
$id = getNotBlank($data, 'id');
$name = getNotBlank($data, 'name');
$dir = getStateDir();

checkNotFalse(
    file_put_contents("$dir/$id.name", $name),
    'Writing to rTorrent session directory failed, make sure it is writable for the ruTorrent user.'
);

http_response_code(204);
exit();
