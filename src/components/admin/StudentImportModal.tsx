import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { readSheet } from 'read-excel-file/browser';
import { Coach, MouwakabaPackage, Student, StudentStatus } from '../../types';
import { dataManager } from '../../utils/dataManager';
import { passwordProblem } from './PasswordField';

type ImportStudent = Pick<Student, 'name' | 'username' | 'email' | 'grade' | 'status' | 'package' | 'coachId'> & { password: string };
type PreviewRow = { rowNumber: number; student: ImportStudent; errors: string[] };
type ImportResult = { imported: number; failed: { rowNumber: number; name: string }[] };

const ALIASES: Record<string, keyof ImportStudent | 'coach'> = {
  nom: 'name', nomcomplet: 'name', fullname: 'name', name: 'name',
  identifiant: 'username', utilisateur: 'username', username: 'username', login: 'username',
  email: 'email', courriel: 'email', niveau: 'grade', classe: 'grade', grade: 'grade',
  motdepasse: 'password', password: 'password', mdp: 'password',
  formule: 'package', package: 'package', pack: 'package', statut: 'status', status: 'status',
  coach: 'coach', coachid: 'coachId',
};
const PACKAGES: MouwakabaPackage[] = ['essentiel', 'boost', 'premium'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const text = (value: unknown) => String(value ?? '').trim();

const parseCsv = (source: string): string[][] => {
  const firstLine = source.split(/\r?\n/, 1)[0] || '';
  const separators = [',', ';', '\t'];
  const separator = separators.sort((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0];
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted;
    } else if (char === separator && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(cell); if (row.some((value) => value.trim())) rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  row.push(cell); if (row.some((value) => value.trim())) rows.push(row);
  return rows;
};

const matrixToRecords = (matrix: unknown[][]): Record<string, unknown>[] => {
  const [headers = [], ...dataRows] = matrix;
  return dataRows.filter((row) => row.some((value) => text(value))).map((row) =>
    headers.reduce<Record<string, unknown>>((record, header, index) => {
      record[text(header)] = row[index] ?? '';
      return record;
    }, {})
  );
};

const parseStatus = (value: unknown): StudentStatus | null => ({
  actif: 'active', active: 'active', attente: 'pending_activation', enattente: 'pending_activation',
  pending: 'pending_activation', pendingactivation: 'pending_activation', suspendu: 'suspended',
  suspended: 'suspended', termine: 'completed', completed: 'completed', archive: 'archived', archived: 'archived',
}[normalize(value)] as StudentStatus | undefined) ?? null;

const parsePackage = (value: unknown): MouwakabaPackage | null => {
  const normalized = normalize(value);
  if (!normalized || ['aucune', 'aucun', 'none', 'sansformule'].includes(normalized)) return null;
  return PACKAGES.find((item) => item === normalized) ?? null;
};

const parseRows = (rawRows: Record<string, unknown>[], students: Student[], coaches: Coach[]): PreviewRow[] => {
  const existingUsers = new Set(students.map((student) => student.username.toLowerCase()));
  const existingEmails = new Set(students.map((student) => student.email?.toLowerCase()).filter(Boolean));
  const seenUsers = new Set<string>();
  const seenEmails = new Set<string>();
  return rawRows.slice(0, 500).map((raw, index) => {
    const mapped: Record<string, unknown> = {};
    Object.entries(raw).forEach(([header, value]) => { const key = ALIASES[normalize(header)]; if (key) mapped[key] = value; });
    const name = text(mapped.name), username = text(mapped.username), email = text(mapped.email), password = text(mapped.password);
    const grade = text(mapped.grade) || '2ème Bac', rawStatus = text(mapped.status), rawPackage = text(mapped.package);
    const status = rawStatus ? parseStatus(rawStatus) : 'active', pkg = parsePackage(rawPackage);
    const coachText = text(mapped.coach), coachIdText = text(mapped.coachId);
    const coach = coaches.find((item) => (coachIdText && String(item.id) === coachIdText) || (coachText && normalize(item.name) === normalize(coachText)));
    const errors: string[] = [], userKey = username.toLowerCase(), emailKey = email.toLowerCase();
    if (!name) errors.push('Nom manquant');
    if (!username) errors.push('Identifiant manquant');
    else if (existingUsers.has(userKey)) errors.push('Identifiant déjà utilisé');
    else if (seenUsers.has(userKey)) errors.push('Identifiant dupliqué');
    if (!password) errors.push('Mot de passe manquant'); else { const problem = passwordProblem(password); if (problem) errors.push(problem.replace(/\.$/, '')); }
    if (email && !EMAIL.test(email)) errors.push('E-mail invalide');
    else if (email && existingEmails.has(emailKey)) errors.push('E-mail déjà utilisé');
    else if (email && seenEmails.has(emailKey)) errors.push('E-mail dupliqué');
    if (rawStatus && !status) errors.push('Statut inconnu');
    if (rawPackage && pkg === null && !['aucune', 'aucun', 'none', 'sansformule'].includes(normalize(rawPackage))) errors.push('Formule inconnue');
    if ((coachText || coachIdText) && !coach) errors.push('Coach introuvable');
    if (username) seenUsers.add(userKey); if (email) seenEmails.add(emailKey);
    return { rowNumber: index + 2, student: { name, username, email, password, grade, status: status ?? 'active', package: pkg, coachId: coach?.id ?? null }, errors };
  });
};

export const StudentImportModal: React.FC<{
  open: boolean; students: Student[]; coaches: Coach[]; onClose: () => void; onImported: () => Promise<void> | void;
}> = ({ open, students, coaches, onClose, onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const validRows = useMemo(() => rows.filter((row) => !row.errors.length), [rows]);
  if (!open) return null;

  const reset = () => { setFileName(''); setRows([]); setMessage(''); setProgress(0); setResult(null); if (inputRef.current) inputRef.current.value = ''; };
  const close = () => { if (!importing) { reset(); onClose(); } };
  const readFile = async (file: File) => {
    reset();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['csv', 'xlsx'].includes(extension)) { setMessage('Format non pris en charge. Choisissez un fichier CSV ou XLSX.'); return; }
    try {
      const matrix = extension === 'csv'
        ? parseCsv(await file.text())
        : (await readSheet(file) as unknown[][]);
      const parsed = matrixToRecords(matrix);
      if (!parsed.length) { setMessage('Le fichier ne contient aucun étudiant.'); return; }
      const preview = parseRows(parsed, students, coaches);
      if (preview.every((row) => !row.student.name && !row.student.username)) { setMessage('Colonnes introuvables. Utilisez le modèle proposé.'); return; }
      setFileName(file.name); setRows(preview);
      if (parsed.length > 500) setMessage('Seules les 500 premières lignes pourront être importées.');
    } catch (error) { console.error(error); setMessage('Impossible de lire ce fichier. Vérifiez qu’il n’est pas endommagé.'); }
  };
  const downloadTemplate = () => {
    const csv = '\uFEFFNom complet;Identifiant;E-mail;Niveau;Mot de passe;Formule;Statut;Coach\r\nSara El Amrani;sara.elamrani;sara@exemple.com;2ème Bac;Exemple2026;essentiel;actif;';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'modele-import-etudiants.csv'; link.click(); URL.revokeObjectURL(url);
  };
  const runImport = async () => {
    setImporting(true); setProgress(0); const failed: ImportResult['failed'] = []; let imported = 0;
    for (let index = 0; index < validRows.length; index += 1) {
      const row = validRows[index];
      try { await dataManager.saveStudent(row.student as Student); imported += 1; }
      catch (error) { console.error(error); failed.push({ rowNumber: row.rowNumber, name: row.student.name }); }
      setProgress(index + 1);
    }
    await onImported(); setResult({ imported, failed }); setImporting(false);
  };

  return <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[75] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="student-import-title">
    <div className="bg-white rounded-[22px] w-full max-w-3xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
        <div><h3 id="student-import-title" className="text-[18px] font-black text-slate-900 flex items-center gap-2"><FileSpreadsheet size={20} className="text-emerald-600" /> Importer des étudiants</h3><p className="text-[12.5px] text-slate-500 font-medium mt-1">Ajoutez plusieurs comptes depuis un fichier Excel ou CSV.</p></div>
        <button onClick={close} disabled={importing} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 disabled:opacity-50" aria-label="Fermer"><X size={18} /></button>
      </div>
      <div className="p-5 sm:p-6 overflow-y-auto">
        {result ? <div className="text-center py-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} /></div>
          <h4 className="text-xl font-black text-slate-900">Import terminé</h4><p className="mt-2 text-[13.5px] font-medium text-slate-500">{result.imported} étudiant{result.imported !== 1 ? 's' : ''} ajouté{result.imported !== 1 ? 's' : ''}{result.failed.length ? `, ${result.failed.length} échec${result.failed.length > 1 ? 's' : ''}` : ''}.</p>
          {result.failed.length > 0 && <div className="mt-5 max-h-40 overflow-y-auto text-start rounded-xl bg-rose-50 p-3">{result.failed.map((failure) => <p key={failure.rowNumber} className="text-[12px] font-bold text-rose-700">Ligne {failure.rowNumber} — {failure.name}: échec de l’enregistrement</p>)}</div>}
          <button onClick={close} className="mt-6 h-11 px-8 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary">Terminé</button>
        </div> : <>
          <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) readFile(file); }} className={`rounded-2xl border-2 border-dashed p-7 text-center transition-colors ${dragging ? 'border-primary bg-blue-50' : 'border-slate-200 bg-slate-50/70'}`}>
            <input ref={inputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) readFile(file); }} />
            <Upload size={26} className="mx-auto text-primary mb-3" /><p className="font-black text-slate-800 text-[14px]">Glissez votre fichier ici</p><p className="text-[12px] text-slate-400 font-medium my-2">CSV ou XLSX · 500 lignes maximum</p>
            <button onClick={() => inputRef.current?.click()} className="h-10 px-4 rounded-xl bg-white border border-slate-200 font-bold text-[12.5px] text-slate-700 hover:border-primary hover:text-primary">Choisir un fichier</button>
          </div>
          <div className="flex items-center justify-between gap-3 mt-3"><p className="text-[11.5px] text-slate-500 font-medium">Colonnes requises : nom, identifiant et mot de passe.</p><button onClick={downloadTemplate} className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline"><Download size={14} /> Télécharger le modèle</button></div>
          {message && <p className="mt-4 flex items-start gap-2 text-[12.5px] font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2.5"><AlertCircle size={16} className="shrink-0 mt-0.5" />{message}</p>}
          {rows.length > 0 && <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2 mb-3"><span className="font-black text-slate-800 text-[13.5px] flex-1 truncate">{fileName}</span><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11.5px] font-black">{validRows.length} valide{validRows.length !== 1 ? 's' : ''}</span>{rows.length > validRows.length && <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[11.5px] font-black">{rows.length - validRows.length} à corriger</span>}</div>
            <div className="border border-slate-100 rounded-xl overflow-auto max-h-64"><table className="w-full text-[12px] min-w-[650px]"><thead className="sticky top-0 bg-slate-50 text-slate-500"><tr><th className="p-2.5 text-start">Ligne</th><th className="p-2.5 text-start">Étudiant</th><th className="p-2.5 text-start">Identifiant</th><th className="p-2.5 text-start">Niveau</th><th className="p-2.5 text-start">Résultat</th></tr></thead><tbody>{rows.map((row) => <tr key={row.rowNumber} className="border-t border-slate-50"><td className="p-2.5 text-slate-400 font-bold">{row.rowNumber}</td><td className="p-2.5 font-bold text-slate-800">{row.student.name || '—'}<span className="block font-medium text-[10.5px] text-slate-400">{row.student.email}</span></td><td className="p-2.5 text-slate-600">{row.student.username || '—'}</td><td className="p-2.5 text-slate-600">{row.student.grade}</td><td className="p-2.5">{row.errors.length ? <span className="text-rose-600 font-bold">{row.errors.join(' · ')}</span> : <span className="text-emerald-600 font-bold inline-flex items-center gap-1"><CheckCircle2 size={13} /> Prêt</span>}</td></tr>)}</tbody></table></div>
          </div>}
        </>}
      </div>
      {!result && <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center gap-3"><button onClick={close} disabled={importing} className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-50">Annuler</button><button onClick={runImport} disabled={!validRows.length || importing} className="flex-[2] h-11 rounded-xl bg-slate-900 text-white font-bold text-[13px] hover:bg-primary disabled:opacity-50 flex items-center justify-center gap-2">{importing ? <><Loader2 size={16} className="animate-spin" /> Importation {progress}/{validRows.length}</> : <><Upload size={16} /> Importer {validRows.length || ''} étudiant{validRows.length > 1 ? 's' : ''}</>}</button></div>}
    </div>
  </div>;
};
