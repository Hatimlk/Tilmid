<?php
/**
 * Request schemas, one per route that reads a body. Mirrors server/schemas.js: the same fields, types,
 * limits and allowed values. Update routes reuse the create schema, so fields are optional unless
 * creation needs them.
 */

function R_text(int $max, bool $required = false): array { return ['type' => 'text', 'max' => $max, 'required' => $required]; }
function R_secret(int $maxBytes, int $minChars = 0, bool $required = false): array { return ['type' => 'secret', 'maxBytes' => $maxBytes, 'minChars' => $minChars, 'required' => $required]; }
function R_email(bool $required = false): array { return ['type' => 'email', 'required' => $required]; }
function R_phone(bool $required = false): array { return ['type' => 'phone', 'required' => $required]; }
function R_url(bool $allowPath = false, bool $nullable = false): array { return ['type' => 'url', 'allowPath' => $allowPath, 'nullable' => $nullable]; }
function R_int(int $min = -2147483648, int $max = 2147483647, bool $required = false, bool $nullable = false): array { return ['type' => 'int', 'min' => $min, 'max' => $max, 'required' => $required, 'nullable' => $nullable]; }
function R_bool(bool $nullable = false): array { return ['type' => 'bool', 'nullable' => $nullable]; }
function R_enum(array $values, bool $nullable = false, bool $required = false): array { return ['type' => 'enum', 'values' => $values, 'nullable' => $nullable, 'required' => $required]; }
function R_date(bool $required = false): array { return ['type' => 'date', 'required' => $required]; }
function R_time(): array { return ['type' => 'time']; }
function R_array(array $item, int $min = 0, int $max = 100, bool $required = false): array { return ['type' => 'array', 'item' => $item, 'min' => $min, 'max' => $max, 'required' => $required]; }
function R_object(array $shape): array { return ['type' => 'object', 'shape' => $shape]; }

// Nullable wrappers, so a field can be sent as null (for example, "no package").
function R_nullable(array $rule): array { $rule['nullable'] = true; return $rule; }

$PACKAGE = ['essentiel', 'boost', 'premium'];
$STUDENT_STATUS = ['active', 'pending_activation', 'suspended', 'completed', 'archived'];
$GOAL_STATUS = ['a_demarrer', 'en_cours', 'a_revoir', 'atteint'];
$WEEKDAY = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
$RESOURCE_TYPE = ['summary', 'video', 'document', 'link', 'exercise'];
$SESSION_STATUS = ['scheduled', 'completed', 'cancelled'];
$APPOINTMENT_STATUS = ['confirmed', 'pending', 'cancelled', 'completed'];

$PLAN_ACTION = R_object(['id' => R_text(60, true), 'text' => R_text(500), 'label' => R_text(500), 'done' => R_bool()]);
$HABIT = R_object(['id' => R_text(60), 'name' => R_text(100), 'days' => R_array(R_bool(), 7, 7)]);
$NEW_PASSWORD = fn(bool $required = false) => R_secret(72, 8, $required);

return [
    // Auth
    'login' => ['email' => R_email(true), 'password' => R_secret(200, 0, true)],
    'studentLogin' => ['username' => R_text(255, true), 'password' => R_secret(200, 0, true)],
    'register' => ['username' => R_text(100, true), 'email' => R_email(true), 'password' => $NEW_PASSWORD(true)],

    // Admin: settings, users, students
    'settings' => [
        'contactPhone' => R_phone(), 'contactEmail' => R_email(), 'whatsappNumber' => R_url(),
        'instagramUrl' => R_url(), 'tiktokUrl' => R_url(), 'facebookUrl' => R_url(), 'youtubeUrl' => R_url(),
    ],
    'user' => [
        'id' => R_int(1, 2147483647, false, true), 'username' => R_text(100), 'email' => R_email(),
        'password' => $NEW_PASSWORD(), 'role' => R_enum(['user', 'admin']),
    ],
    'student' => [
        'id' => R_int(1, 2147483647, false, true), 'name' => R_text(255), 'username' => R_text(100), 'email' => R_email(),
        'grade' => R_text(100), 'status' => R_enum($STUDENT_STATUS), 'avatar' => R_url(true, true),
        'password' => $NEW_PASSWORD(), 'package' => R_enum($PACKAGE, true), 'coachId' => R_int(1, 2147483647, false, true),
        'coachName' => R_nullable(R_text(255)),
    ],
    'notification' => [
        'title' => R_text(150, true), 'message' => R_text(2000, true),
        'target' => R_object(['studentId' => R_int(1), 'package' => R_enum($PACKAGE), 'all' => R_bool()]),
    ],
    'toolOption' => [
        'id' => R_int(1, 2147483647, false, true), 'category' => R_enum(['subject', 'technique'], false, true),
        'label' => R_text(120, true), 'position' => R_int(0, 10000),
    ],
    'coach' => [
        'id' => R_int(1, 2147483647, false, true), 'name' => R_text(255, true), 'email' => R_email(),
        'phone' => R_phone(), 'specialty' => R_text(255), 'status' => R_enum(['active', 'inactive']),
    ],
    'appointment' => [
        'id' => R_int(1, 2147483647, false, true), 'studentName' => R_text(255), 'title' => R_text(255),
        'date' => R_date(), 'time' => R_text(50), 'status' => R_enum($APPOINTMENT_STATUS),
        'type' => R_enum(['live', 'online']), 'studentId' => R_int(1, 2147483647, false, true),
        'category' => R_enum(['coaching'], true), 'notes' => R_nullable(R_text(2000)),
    ],
    'story' => [
        'studentName' => R_text(255), 'grade' => R_text(100), 'storyText' => R_text(2000),
        'avatar' => R_url(true),
    ],
    'courseModuleVideo' => ['videoUrl' => R_url(true, true), 'videoSource' => R_enum(['link', 'upload'], true)],
    'courseModule' => ['title' => R_text(255, true), 'description' => R_text(500)],
    'resource' => [
        'title' => R_text(255, true), 'type' => R_enum($RESOURCE_TYPE), 'url' => R_url(true),
        'subject' => R_text(100), 'fileSize' => R_text(50), 'iconName' => R_text(50),
    ],
    'collectiveSession' => [
        'id' => R_int(1, 2147483647, false, true), 'title' => R_text(255, true), 'description' => R_text(500),
        'date' => R_date(true), 'time' => R_text(50, true), 'capacity' => R_int(1, 100000, false, true),
        'meetingLink' => R_url(false, true), 'status' => R_enum($SESSION_STATUS),
    ],
    'attendance' => ['studentId' => R_int(1, 2147483647, true), 'attended' => R_bool(true)],
    'feedback' => [
        'studentId' => R_int(1, 2147483647, true), 'appointmentId' => R_int(1, 2147483647, false, true),
        'checkinId' => R_int(1, 2147483647, false, true), 'message' => R_text(2000, true),
    ],
    'adminPlan' => [
        'objective' => R_text(500, true), 'startDate' => R_text(50), 'obstacles' => R_text(2000),
        'actions' => R_array($PLAN_ACTION, 1, 100, true), 'habits' => R_array($HABIT, 0, 50),
    ],
    'courseProgress' => ['watchedSeconds' => R_int(0, 14400), 'durationSeconds' => R_int(0, 14400)],

    // Public forms
    'message' => [
        'name' => R_text(100, true), 'email' => R_email(), 'phone' => R_phone(true), 'type' => R_text(100),
        'goal' => R_text(100), 'message' => R_text(2000),
    ],
    'coachingRequest' => ['name' => R_text(100, true), 'phone' => R_phone(true), 'grade' => R_text(50, true)],
    'orientationRequest' => [
        'name' => R_text(100, true), 'phone' => R_phone(true), 'filiere' => R_text(150, true),
        'schoolType' => R_text(100, true), 'city' => R_text(100, true), 'bacYear' => R_text(10, true),
        'regionalGrade' => R_text(50), 'pack' => R_text(50, true),
    ],

    // Student self-service
    'plan' => [
        'objective' => R_text(500), 'startDate' => R_text(50), 'obstacles' => R_text(2000),
        'actions' => R_array($PLAN_ACTION, 0, 100), 'habits' => R_array($HABIT, 0, 50),
    ],
    'planProgress' => [
        'actions' => R_array(R_object(['id' => R_text(60, true), 'done' => R_bool()]), 0, 100),
        'studentNote' => R_text(2000),
    ],
    'goal' => [
        'id' => R_int(1, 2147483647, false, true), 'title' => R_text(255, true), 'category' => R_text(50),
        'targetDate' => R_nullable(R_text(50)), 'progress' => R_int(0, 100, false, true),
        'status' => R_enum($GOAL_STATUS, true), 'nextAction' => R_nullable(R_text(255)),
    ],
    'revision' => [
        'subject' => R_text(100, true), 'chapter' => R_text(255), 'durationMin' => R_int(0, 1440),
        'technique' => R_text(100), 'understanding' => R_int(1, 5),
    ],
    'habit' => [
        'id' => R_int(1, 2147483647, false, true), 'name' => R_text(100, true), 'days' => R_array(R_bool(), 7, 7),
    ],
    'checkin' => [
        'adherence' => R_int(1, 10, true), 'daysRespected' => R_int(0, 7, true), 'obstacle' => R_text(500),
        'concentration' => R_int(1, 5, true), 'success' => R_text(2000), 'needsAdjustment' => R_bool(),
    ],
    'timetable' => ['subject' => R_text(100, true), 'day' => R_enum($WEEKDAY), 'startTime' => R_time(), 'endTime' => R_time()],

    // Posts
    'post' => [
        'title' => R_text(255, true), 'content' => R_text(100000), 'excerpt' => R_text(1000), 'category' => R_text(100),
        'image' => R_url(true), 'file_url' => R_url(true), 'content_type' => R_enum(['html', 'file', 'text']),
    ],
];
