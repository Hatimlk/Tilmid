<?php
/**
 * Schema validation for request bodies and parameters. Mirrors server/validation.js.
 *
 * A schema maps field names to rules (built with the R_* helpers in schemas.php). Each known field is
 * checked for type, length, range or allowed values; fields not in the schema are dropped. A request
 * that breaks a rule gets 400 with code VALIDATION_FAILED and a list of every problem.
 */

const V_CONTROL_CHARS = '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/';
const V_PHONE = '/^\+?[0-9 ()\-.]{6,25}$/';
const V_DATE = '/^\d{4}-\d{2}-\d{2}$/';
const V_TIME = '/^([01]\d|2[0-3]):[0-5]\d$/';
const V_INTEGER = '/^-?\d+$/';

// Returns [ok, value, message]. Absent optional values come back as null and are left out of the result.
function v_check($raw, array $rule): array {
    $required = !empty($rule['required']);
    $nullable = !empty($rule['nullable']);

    if ($raw === null) {
        if ($required && !$nullable) return [false, null, 'est requis'];
        return [true, null, null];
    }

    switch ($rule['type']) {
        case 'text': {
            if (!is_string($raw)) return [false, null, 'doit être une chaîne de caractères'];
            if (preg_match(V_CONTROL_CHARS, $raw)) return [false, null, 'contient des caractères de contrôle interdits'];
            $value = trim($raw);
            if ($required && $value === '') return [false, null, 'est requis'];
            if (mb_strlen($value, 'UTF-8') > $rule['max']) return [false, null, "ne doit pas dépasser {$rule['max']} caractères"];
            return [true, $value, null];
        }
        case 'secret': {
            if (!is_string($raw)) return [false, null, 'doit être une chaîne de caractères'];
            if (strpos($raw, "\0") !== false) return [false, null, 'contient un caractère interdit'];
            if (mb_strlen($raw, 'UTF-8') < $rule['minChars']) return [false, null, "doit contenir au moins {$rule['minChars']} caractères"];
            if (strlen($raw) > $rule['maxBytes']) return [false, null, "ne doit pas dépasser {$rule['maxBytes']} octets"];
            return [true, $raw, null];
        }
        case 'email': {
            if (!is_string($raw)) return [false, null, 'doit être une adresse e-mail'];
            $value = trim($raw);
            if ($value === '') return [true, '', null];
            if (strlen($value) > 254 || !filter_var($value, FILTER_VALIDATE_EMAIL)) return [false, null, 'doit être une adresse e-mail valide'];
            return [true, $value, null];
        }
        case 'phone': {
            if (!is_string($raw)) return [false, null, 'doit être un numéro de téléphone'];
            $value = trim($raw);
            if ($value === '') return $required ? [false, null, 'est requis'] : [true, '', null];
            if (!preg_match(V_PHONE, $value)) return [false, null, 'doit être un numéro de téléphone valide'];
            return [true, $value, null];
        }
        case 'url': {
            if (!is_string($raw)) return [false, null, 'doit être une URL'];
            $value = trim($raw);
            if ($value === '') return [true, '', null];
            if (strlen($value) > 500 || preg_match(V_CONTROL_CHARS, $value)) return [false, null, 'URL invalide'];
            if (!empty($rule['allowPath']) && $value[0] === '/' && strpos($value, '//') !== 0) return [true, $value, null];
            $scheme = strtolower((string)parse_url($value, PHP_URL_SCHEME));
            $host = parse_url($value, PHP_URL_HOST);
            if (($scheme !== 'https' && $scheme !== 'http') || !$host) return [false, null, 'doit commencer par https:// ou http://'];
            return [true, $value, null];
        }
        case 'int': {
            if (is_int($raw)) $n = $raw;
            elseif (is_string($raw) && preg_match(V_INTEGER, trim($raw))) $n = (int)trim($raw);
            else return [false, null, 'doit être un nombre entier'];
            if ($n < $rule['min'] || $n > $rule['max']) return [false, null, "doit être compris entre {$rule['min']} et {$rule['max']}"];
            return [true, $n, null];
        }
        case 'bool': {
            if (!is_bool($raw)) return [false, null, 'doit être vrai ou faux'];
            return [true, $raw, null];
        }
        case 'enum': {
            if (!in_array($raw, $rule['values'], true)) return [false, null, 'doit être une de ces valeurs : ' . implode(', ', $rule['values'])];
            return [true, $raw, null];
        }
        case 'date': {
            if (!is_string($raw) || !preg_match(V_DATE, $raw)) return [false, null, 'doit être une date au format AAAA-MM-JJ'];
            [$y, $m, $d] = array_map('intval', explode('-', $raw));
            if (!checkdate($m, $d, $y)) return [false, null, 'doit être une date au format AAAA-MM-JJ'];
            return [true, $raw, null];
        }
        case 'time': {
            if (!is_string($raw) || !preg_match(V_TIME, $raw)) return [false, null, 'doit être une heure au format HH:MM'];
            return [true, $raw, null];
        }
        case 'array': {
            if (!is_array($raw) || array_values($raw) !== $raw) return [false, null, 'doit être une liste'];
            $count = count($raw);
            if ($count < $rule['min'] || $count > $rule['max']) return [false, null, "doit contenir entre {$rule['min']} et {$rule['max']} éléments"];
            $items = [];
            foreach ($raw as $i => $item) {
                [$ok, $value, $message] = v_check($item, $rule['item']);
                if (!$ok) return [false, null, 'élément ' . ($i + 1) . " : $message"];
                $items[] = $value;
            }
            return [true, $items, null];
        }
        case 'object': {
            if (!is_array($raw) || (array_values($raw) === $raw && $raw !== [])) return [false, null, 'doit être un objet'];
            [$value, $errors] = v_validate_fields($raw, $rule['shape']);
            if ($errors) {
                $parts = array_map(fn($e) => $e['field'] . ' ' . $e['message'], $errors);
                return [false, null, implode(' ; ', $parts)];
            }
            return [true, $value, null];
        }
    }
    throw new RuntimeException('unknown rule type ' . $rule['type']);
}

// Returns [cleaned, errors]. Only fields listed in the schema are kept.
function v_validate_fields(array $input, array $schema): array {
    $value = [];
    $errors = [];
    foreach ($schema as $field => $rule) {
        [$ok, $v, $message] = v_check($input[$field] ?? null, $rule);
        if (!$ok) {
            $errors[] = ['field' => $field, 'message' => $message];
        } elseif ($v !== null) {
            $value[$field] = $v;
        }
    }
    return [$value, $errors];
}

// Validates the request body against a schema. On failure sends 400 and exits; otherwise returns the cleaned body.
function validate_input($input, array $schema): array {
    $body = is_array($input) ? $input : [];
    [$value, $errors] = v_validate_fields($body, $schema);
    if ($errors) {
        http_response_code(400);
        echo json_encode([
            'code' => 'VALIDATION_FAILED',
            'message' => 'Certaines données sont invalides.',
            'errors' => $errors,
        ]);
        exit;
    }
    return $value;
}

// Checks one path or query value. Returns the cleaned value or sends 400 and exits.
function validate_param($raw, array $rule) {
    [$ok, $value, $message] = v_check($raw, $rule);
    if (!$ok) {
        http_response_code(400);
        echo json_encode(['code' => 'VALIDATION_FAILED', 'message' => 'Identifiant invalide.']);
        exit;
    }
    return $value;
}
