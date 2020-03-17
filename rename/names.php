<?php

/** @noinspection PhpIncludeInspection */
require_once __DIR__.'/../../php/settings.php';

$session_dir = rTorrentSettings::get()->session;
header('Content-Type: application/json');
echo '{';
if ($session_dir !== null) {
    $i = -1;
    foreach (new GlobIterator("$session_dir/*.name", FilesystemIterator::CURRENT_AS_PATHNAME) as $path) {
        if (++$i !== 0) {
            echo ',';
        }

        echo '"', basename($path, '.name'), '":', json_encode(file_get_contents($path));
    }
}
echo '}';
