<?php

require_once __DIR__.'/utils.php';

$dir = getStateDir();
$ids = jsonDecodeRequestBody();
checkNotFalse(is_array($ids), 'Expected array, got: '.gettype($ids));

foreach ($ids as $id) {
    unlink("$dir/$id.name");
}

http_response_code(204);
exit();
