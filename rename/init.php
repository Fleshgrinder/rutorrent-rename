<?php

if (!isset($plugin) || !isset($pInfo)) {
    throw new RuntimeException('$plugin or $pInfo is not set.');
}

$theSettings->registerPlugin($plugin['name'], $pInfo['perms']);
