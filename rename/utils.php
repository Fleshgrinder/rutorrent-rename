<?php

/** @noinspection PhpIncludeInspection */
require_once __DIR__.'/../../php/settings.php';

function respondJson($data, int $status, ?string $message = null) {
    if ($message === null) {
        http_response_code($status);
    } else {
        header("{$_SERVER['SERVER_PROTOCOL']} $status $message");
    }
    header('Content-Type: application/json');
    exit(json_encode($data));
}

function check(bool $condition, string $message, int $status): void {
    if ($condition === false) {
        respondJson(['status' => $status, 'message' => $message], $status, $message);
    }
}

function checkNotNull($value, string $message, int $status = 400) {
    check($value !== null, $message, $status);

    return $value;
}

function checkNotFalse($value, string $message, int $status = 400) {
    check($value !== false, $message, $status);

    return $value;
}

function checkNotBlank(string $value, string $message, int $status = 400): string {
    $value = trim($value);
    check($value !== '', $message, $status);

    return $value;
}

function getNotBlank(array $data, string $property, string $description = 'request'): string {
    checkNotFalse(isset($data[$property]), "Missing required `$property` from $description");

    return checkNotBlank($data[$property], "Property `$property` must not be blank.");
}

function getRequestBody(): string {
    return checkNotFalse(file_get_contents('php://input'), 'Could not read request body');
}

function jsonDecodeRequestBody(): array {
    $body = getRequestBody();

    return checkNotNull(json_decode($body, true), "Could not JSON decode request body: $body");
}

function getStateDir(): string {
    return checkNotNull(
        rTorrentSettings::get()->session,
        'rTorrent session directory is not set, cannot store data anywhere.'
    );
}
