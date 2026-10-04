// Request schemas, one per route that accepts a body. Each field the handler reads is listed here
// with its type and limits. Field names match the frontend (camelCase) and the handlers.
// Update routes reuse the create schema, so every field is optional unless creation needs it.

const v = require('./validation');
const { Text, Secret, Email, Phone, Url, Int, Bool, Enum, DateOnly, Time, Arr, Obj } = v;

const PACKAGE = Enum(['essentiel', 'boost', 'premium']);
const STUDENT_STATUS = Enum(['active', 'pending_activation', 'suspended', 'completed', 'archived']);
const GOAL_STATUS = Enum(['a_demarrer', 'en_cours', 'a_revoir', 'atteint']);
const WEEKDAY = Enum(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
const MODULE_VIDEO_SOURCE = Enum(['link', 'upload']);
const RESOURCE_TYPE = Enum(['summary', 'video', 'document', 'link', 'exercise']);
const SESSION_STATUS = Enum(['scheduled', 'completed', 'cancelled']);
const APPOINTMENT_STATUS = Enum(['confirmed', 'pending', 'cancelled', 'completed']);

// Passwords: 8 to 72 bytes (bcrypt ignores anything past 72), never trimmed.
const NEW_PASSWORD = () => Secret(72, { minChars: 8 });

const PLAN_ACTION = Obj({ id: Text(60).req(), text: Text(500), label: Text(500), done: Bool() });
const HABIT = Obj({ id: Text(60), name: Text(100), days: Arr(Bool(), { min: 7, max: 7 }) });

module.exports = {
    // Auth
    login: { email: Email().req(), password: Secret(200).req() },
    studentLogin: { username: Text(255).req(), password: Secret(200).req() },
    register: { username: Text(100).req(), email: Email().req(), password: NEW_PASSWORD().req() },

    // Admin: settings, users, students
    settings: {
        contactPhone: Phone(), contactEmail: Email(), whatsappNumber: Url(), instagramUrl: Url(),
        tiktokUrl: Url(), facebookUrl: Url(), youtubeUrl: Url(),
    },
    user: {
        id: Int({ min: 1 }).nullable(), username: Text(100), email: Email(), password: NEW_PASSWORD(),
        role: Enum(['user', 'admin']),
    },
    student: {
        id: Int({ min: 1 }).nullable(), name: Text(255), username: Text(100), email: Email(),
        grade: Text(100), status: STUDENT_STATUS, avatar: Url({ allowPath: true }).nullable(),
        password: NEW_PASSWORD(), package: PACKAGE.nullable(), coachId: Int({ min: 1 }).nullable(),
        coachName: Text(255).nullable(),
    },
    notification: {
        title: Text(150).req(), message: Text(2000).req(),
        target: Obj({ studentId: Int({ min: 1 }), package: PACKAGE, all: Bool() }),
    },
    toolOption: {
        id: Int({ min: 1 }).nullable(), category: Enum(['subject', 'technique']).req(),
        label: Text(120).req(), position: Int({ min: 0, max: 10000 }),
    },
    coach: {
        id: Int({ min: 1 }).nullable(), name: Text(255).req(), email: Email(), phone: Phone(),
        specialty: Text(255), status: Enum(['active', 'inactive']),
    },
    appointment: {
        id: Int({ min: 1 }).nullable(), studentName: Text(255), title: Text(255), date: DateOnly(),
        time: Text(50), status: APPOINTMENT_STATUS, type: Enum(['live', 'online']),
        studentId: Int({ min: 1 }).nullable(), category: Enum(['coaching']).nullable(),
        notes: Text(2000).nullable(),
    },
    story: {
        studentName: Text(255), grade: Text(100), storyText: Text(2000), avatar: Url({ allowPath: true }),
    },
    courseModuleVideo: { videoUrl: Url({ allowPath: true }).nullable(), videoSource: MODULE_VIDEO_SOURCE.nullable() },
    courseModule: { title: Text(255).req(), description: Text(500) },
    resource: {
        title: Text(255).req(), type: RESOURCE_TYPE, url: Url({ allowPath: true }), subject: Text(100),
        fileSize: Text(50), iconName: Text(50),
    },
    collectiveSession: {
        id: Int({ min: 1 }).nullable(), title: Text(255).req(), description: Text(500),
        date: DateOnly().req(), time: Text(50).req(), capacity: Int({ min: 1, max: 100000 }).nullable(),
        meetingLink: Url().nullable(), status: SESSION_STATUS,
    },
    attendance: { studentId: Int({ min: 1 }).req(), attended: Bool().nullable() },
    feedback: {
        studentId: Int({ min: 1 }).req(), appointmentId: Int({ min: 1 }).nullable(),
        checkinId: Int({ min: 1 }).nullable(), message: Text(2000).req(),
    },
    adminPlan: {
        objective: Text(500).req(), startDate: Text(50), obstacles: Text(2000),
        actions: Arr(PLAN_ACTION, { min: 1, max: 100 }).req(), habits: Arr(HABIT, { max: 50 }),
    },
    courseProgress: {
        watchedSeconds: Int({ min: 0, max: 14400 }), durationSeconds: Int({ min: 0, max: 14400 }),
    },

    // Public forms
    message: {
        name: Text(100).req(), email: Email(), phone: Phone().req(), type: Text(100),
        goal: Text(100), message: Text(2000),
    },
    coachingRequest: { name: Text(100).req(), phone: Phone().req(), grade: Text(50).req() },
    orientationRequest: {
        name: Text(100).req(), phone: Phone().req(), filiere: Text(150).req(),
        schoolType: Text(100).req(), city: Text(100).req(), bacYear: Text(10).req(),
        regionalGrade: Text(50), pack: Text(50).req(),
    },

    // Student self-service
    plan: {
        objective: Text(500), startDate: Text(50), obstacles: Text(2000),
        actions: Arr(PLAN_ACTION, { max: 100 }), habits: Arr(HABIT, { max: 50 }),
    },
    planProgress: {
        actions: Arr(Obj({ id: Text(60).req(), done: Bool().req() }), { max: 100 }),
        studentNote: Text(2000),
    },
    goal: {
        id: Int({ min: 1 }).nullable(), title: Text(255).req(), category: Text(50),
        targetDate: Text(50).nullable(), progress: Int({ min: 0, max: 100 }).nullable(),
        status: GOAL_STATUS.nullable(), nextAction: Text(255).nullable(),
    },
    revision: {
        subject: Text(100).req(), chapter: Text(255), durationMin: Int({ min: 0, max: 1440 }),
        technique: Text(100), understanding: Int({ min: 1, max: 5 }),
    },
    habit: { id: Int({ min: 1 }).nullable(), name: Text(100).req(), days: Arr(Bool(), { min: 7, max: 7 }) },
    checkin: {
        adherence: Int({ min: 1, max: 10 }).req(), daysRespected: Int({ min: 0, max: 7 }).req(),
        obstacle: Text(500), concentration: Int({ min: 1, max: 5 }).req(), success: Text(2000),
        needsAdjustment: Bool(),
    },
    timetable: { subject: Text(100).req(), day: WEEKDAY, startTime: Time(), endTime: Time() },
    emptyBody: {},

    post: {
        title: Text(255).req(), content: Text(100000), excerpt: Text(1000), category: Text(100),
        image: Url({ allowPath: true }), file_url: Url({ allowPath: true }),
        content_type: Enum(['html', 'file', 'text']),
    },
};
