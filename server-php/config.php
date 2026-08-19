<?php
/**
 * Loads configuration from server-php/.env (never committed) with a fallback
 * to real environment variables set on the host. Fails fast on missing secrets
 * instead of falling back to a hardcoded default.
 */

function load_env(string $path): void {
    if (!is_file($path)) {
        return;
    }
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
            $value = trim($value, "\"'");
        }
        if (getenv($key) === false) {
            putenv("$key=$value");
        }
    }
}

load_env(__DIR__ . '/.env');

function env(string $key, ?string $default = null): ?string {
    $value = getenv($key);
    return $value === false ? $default : $value;
}

function require_env(string $key): string {
    $value = env($key);
    if ($value === null || $value === '') {
        http_response_code(500);
        echo json_encode(['message' => "Server misconfigured: missing $key"]);
        exit;
    }
    return $value;
}
