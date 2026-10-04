// Schema validation for request bodies, path parameters and query strings.
//
// A schema maps field names to rules. Every field the server reads must have a rule, and each
// rule checks type, length, range or allowed values. Fields that aren't in the schema are dropped
// before the handler runs, so nothing unexpected reaches the database. A request that breaks a
// rule is refused with 400 VALIDATION_FAILED, listing every problem.
//
// Passwords go through Secret(), which never trims or otherwise changes the value.

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9 ()\-.]{6,25}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const INTEGER = /^-?\d+$/;

class Rule {
    constructor(type, options = {}) {
        this.type = type;
        this.options = options;
        this.isRequired = false;
        this.isNullable = false;
    }
    req() { this.isRequired = true; return this; }
    nullable() { this.isNullable = true; return this; }
}

const Text = (max, { multiline = false } = {}) => new Rule('text', { max, multiline });
const Secret = (maxBytes, { minChars = 0 } = {}) => new Rule('secret', { maxBytes, minChars });
const Email = () => new Rule('email');
const Phone = () => new Rule('phone');
const Url = ({ allowPath = false } = {}) => new Rule('url', { allowPath });
const Int = ({ min = -2147483648, max = 2147483647 } = {}) => new Rule('int', { min, max });
const Bool = () => new Rule('bool');
const Enum = (values) => new Rule('enum', { values });
const DateOnly = () => new Rule('date');
const Time = () => new Rule('time');
const Arr = (item, { min = 0, max = 100 } = {}) => new Rule('array', { item, min, max });
const Obj = (shape) => new Rule('object', { shape });

// Returns { ok: true, value } or { ok: false, message }. Absent optional values come back as
// undefined, so handlers keep their existing defaults.
function checkRule(raw, rule) {
    if (raw === undefined || raw === null) {
        if (rule.isRequired && !rule.isNullable) return { ok: false, message: 'est requis' };
        return { ok: true, value: raw === null && rule.isNullable ? null : undefined };
    }

    const o = rule.options;
    switch (rule.type) {
        case 'text': {
            if (typeof raw !== 'string') return { ok: false, message: 'doit être une chaîne de caractères' };
            // Tabs and line breaks are fine in every text field; other control characters are not.
            if (CONTROL_CHARS.test(raw)) return { ok: false, message: 'contient des caractères de contrôle interdits' };
            const value = raw.trim();
            if (rule.isRequired && value === '') return { ok: false, message: 'est requis' };
            if (value.length > o.max) return { ok: false, message: `ne doit pas dépasser ${o.max} caractères` };
            return { ok: true, value };
        }
        case 'secret': {
            if (typeof raw !== 'string') return { ok: false, message: 'doit être une chaîne de caractères' };
            if (raw.includes('\u0000')) return { ok: false, message: 'contient un caractère interdit' };
            if (raw.length < o.minChars) return { ok: false, message: `doit contenir au moins ${o.minChars} caractères` };
            if (Buffer.byteLength(raw, 'utf8') > o.maxBytes) return { ok: false, message: `ne doit pas dépasser ${o.maxBytes} octets` };
            return { ok: true, value: raw };
        }
        case 'email': {
            if (typeof raw !== 'string') return { ok: false, message: 'doit être une adresse e-mail' };
            const value = raw.trim();
            if (value === '') return { ok: true, value: '' };
            if (value.length > 254 || !EMAIL.test(value)) return { ok: false, message: 'doit être une adresse e-mail valide' };
            return { ok: true, value };
        }
        case 'phone': {
            if (typeof raw !== 'string') return { ok: false, message: 'doit être un numéro de téléphone' };
            const value = raw.trim();
            if (value === '') return rule.isRequired ? { ok: false, message: 'est requis' } : { ok: true, value: '' };
            if (!PHONE.test(value)) return { ok: false, message: 'doit être un numéro de téléphone valide' };
            return { ok: true, value };
        }
        case 'url': {
            if (typeof raw !== 'string') return { ok: false, message: 'doit être une URL' };
            const value = raw.trim();
            if (value === '') return { ok: true, value: '' };
            if (value.length > 500 || CONTROL_CHARS.test(value)) return { ok: false, message: 'URL invalide' };
            if (o.allowPath && value.startsWith('/') && !value.startsWith('//')) return { ok: true, value };
            try {
                const url = new URL(value);
                if (url.protocol !== 'https:' && url.protocol !== 'http:') return { ok: false, message: 'doit commencer par https:// ou http://' };
                return { ok: true, value };
            } catch {
                return { ok: false, message: 'URL invalide' };
            }
        }
        case 'int': {
            const n = typeof raw === 'number' ? raw : (typeof raw === 'string' && INTEGER.test(raw.trim()) ? Number(raw.trim()) : NaN);
            if (!Number.isSafeInteger(n)) return { ok: false, message: 'doit être un nombre entier' };
            if (n < o.min || n > o.max) return { ok: false, message: `doit être compris entre ${o.min} et ${o.max}` };
            return { ok: true, value: n };
        }
        case 'bool': {
            if (typeof raw !== 'boolean') return { ok: false, message: 'doit être vrai ou faux' };
            return { ok: true, value: raw };
        }
        case 'enum': {
            if (!o.values.includes(raw)) return { ok: false, message: `doit être une de ces valeurs : ${o.values.join(', ')}` };
            return { ok: true, value: raw };
        }
        case 'date': {
            if (typeof raw !== 'string' || !DATE.test(raw) || Number.isNaN(Date.parse(raw))) return { ok: false, message: 'doit être une date au format AAAA-MM-JJ' };
            return { ok: true, value: raw };
        }
        case 'time': {
            if (typeof raw !== 'string' || !TIME.test(raw)) return { ok: false, message: 'doit être une heure au format HH:MM' };
            return { ok: true, value: raw };
        }
        case 'array': {
            if (!Array.isArray(raw)) return { ok: false, message: 'doit être une liste' };
            if (raw.length < o.min || raw.length > o.max) return { ok: false, message: `doit contenir entre ${o.min} et ${o.max} éléments` };
            const items = [];
            for (let i = 0; i < raw.length; i++) {
                const r = checkRule(raw[i], o.item);
                if (!r.ok) return { ok: false, message: `élément ${i + 1} : ${r.message}` };
                items.push(r.value);
            }
            return { ok: true, value: items };
        }
        case 'object': {
            if (typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, message: 'doit être un objet' };
            const { value, errors } = validateObject(raw, o.shape);
            if (errors.length) return { ok: false, message: errors.map((e) => `${e.field} ${e.message}`).join(' ; ') };
            return { ok: true, value };
        }
        default:
            throw new Error(`unknown rule type ${rule.type}`);
    }
}

function validateObject(input, schema) {
    const value = {};
    const errors = [];
    for (const [field, rule] of Object.entries(schema)) {
        const r = checkRule(input[field], rule);
        if (!r.ok) errors.push({ field, message: r.message });
        else if (r.value !== undefined) value[field] = r.value;
    }
    return { value, errors };
}

// Express middleware for request bodies. Replaces req.body with the cleaned copy.
function validateBody(schema) {
    return (req, res, next) => {
        const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
        const { value, errors } = validateObject(body, schema);
        if (errors.length) {
            return res.status(400).json({
                code: 'VALIDATION_FAILED',
                message: 'Certaines données sont invalides.',
                errors,
            });
        }
        req.body = value;
        next();
    };
}

// Checks a single value (path or query parameter). Returns the cleaned value or throws.
function parseParam(raw, rule) {
    const r = checkRule(raw, rule);
    if (!r.ok) throw Object.assign(new Error(r.message), { status: 400 });
    return r.value;
}

module.exports = {
    Text, Secret, Email, Phone, Url, Int, Bool, Enum, DateOnly, Time, Arr, Obj,
    validateBody,
    validateObject,
    parseParam,
};
