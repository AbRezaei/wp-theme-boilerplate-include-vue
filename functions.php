<?php

define('THEME_BASE_PATH', __DIR__);

/** Importing timber and twig */
require __DIR__ . '/functions/timber.php';

/** Importing Custom Fields for ACF Pro */
require __DIR__ . '/functions/customFields.php';

/** Importing Theme Settings */
require __DIR__ . '/functions/themeSettings.php';

if (file_exists(THEME_BASE_PATH . '/.env')) {
    $dotenv = Dotenv\Dotenv::createUnsafeImmutable(THEME_BASE_PATH);
    $dotenv->load();
}

