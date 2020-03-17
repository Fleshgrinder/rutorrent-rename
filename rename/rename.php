<?php

function check($value, string $message, int $status = 400) {
    if ($value === null || $value === false || $value === '') {
        header("{$_SERVER['SERVER_PROTOCOL']} $status $message");
        exit(json_encode(['status' => $status, 'message' => $message]));
    }

    return $value;
}

check(
    $_SERVER['REQUEST_METHOD'] === 'POST',
    "Only POST requests are allowed, got: {$_SERVER['REQUEST_METHOD']}",
    415
);

$input = check(file_get_contents('php://input'), 'Could not read request body');
$data = check(json_decode($input, true), "Could not decode request body: $input");
$id = check(trim($data['id'] ?? ''), "Missing required id property (or it is blank).");
$name = check(trim($data['name'] ?? ''), 'Missing required name property (or it is blank).');

/** @noinspection PhpIncludeInspection */
require_once __DIR__.'/../../php/settings.php';
$session_dir = rTorrentSettings::get()->session;
check($session_dir !== null, 'rTorrent session directory is not set, cannot store data anywhere.');
check(file_put_contents("$session_dir/$id.name", $name), 'Writing to rTorrent session directory failed, make sure it is writable for the ruTorrent user.');

http_response_code(204);
exit();
