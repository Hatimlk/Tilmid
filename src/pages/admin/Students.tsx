import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, UserPlus, MoreHorizontal, Eye, Edit, Ban, Unlock, Archive, X, Users,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminOutletContext } from '../../components/admin/AdminLayout';
import {
  AdminCard, AdminPageHeader, StudentStatusBadge, PackageBadge, AdminEmptyState,
  AdminErrorState, Avatar, ConfirmDialog,
} from '../../components/admin/primitives';
import { Student, StudentStatus } from '../../types';
import { dataManager } from '../../utils/dataManager';

const STATUS_FILTERS: { value: StudentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'pending_activation', label: "En attente d'activation" },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'completed', label: 'Programme terminé' },
  { value: 'archived', label: 'Archivé' },
];

export const AdminStudents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { students, refreshStudents } = useAdminData();
  const { openStudentModal } = useAdminOutletContext();

  const initialPackageFilter = (location.state as { packageFilter?: string } | null)?.packageFilter;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [packageFilter, setPackageFilter] = useState<string>(initialPackageFilter || 'all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmArchive, setConfirmArchive] = useState<Student | null>(null);

  const grades = useMemo(() => Array.from(new Set(students.data.map((s) => s.grade))).sort(), [students.data]);

  const filtered = students.data.filter((s) => {
    const q = search.trim().toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.username.toLowerCase().includes(q) && !(s.email || '').toLowerCase().includes(q)) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (packageFilter !== 'all' && (s.package || 'none') !== packageFilter) return false;
    if (gradeFilter !== 'all' && s.grade !== gradeFilter) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.id)));
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const changeStatus = async (student: Student, status: StudentStatus) => {
    await dataManager.saveStudent({ ...student, status });
    await refreshStudents();
    setOpenMenuId(null);
  };

  const bulkArchive = async () => {
    await Promise.all(Array.from(selected).map((id) => {
      const s = students.data.find((st) => st.id === id);
      return s ? dataManager.saveStudent({ ...s, status: 'archived' }) : Promise.resolve();
    }));
    setSelected(new Set());
    await refreshStudents();
  };

  const activeFilterChips = [
    statusFilter !== 'all' && { key: 'status', label: STATUS_FILTERS.find((s) => s.value === statusFilter)?.label, clear: () => setStatusFilter('all') },
    packageFilter !== 'all' && { key: 'package', label: packageFilter === 'none' ? 'Sans formule' : packageFilter.charAt(0).toUpperCase() + packageFilter.slice(1), clear: () => setPackageFilter('all') },
    gradeFilter !== 'all' && { key: 'grade', label: gradeFilter, clear: () => setGradeFilter('all') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  if (students.error) {
    return (
      <div>
        <AdminPageHeader title="Étudiants" breadcrumb="Administration / Étudiants" />
        <AdminCard><AdminErrorState onRetry={refreshStudents} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Étudiants"
        breadcrumb="Administration / Étudiants"
        description={`${students.data.length} étudiant${students.data.length > 1 ? 's' : ''} au total`}
        action={
          <button onClick={() => openStudentModal(null)} className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors">
            <UserPlus size={16} /> Ajouter un étudiant
          </button>
        }
      />

      <AdminCard className="p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un étudiant..."
              className="w-full h-11 ps-10 pe-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-primary focus:bg-white font-medium text-[13.5px] transition-colors"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'all')} className="h-11 px-3 rounded-xl border border-slate-200 bg-white font-bold text-[13px] text-slate-600 outline-none focus:border-primary">
            {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={packageFilter} onChange={(e) => setPackageFilter(e.target.value)} className="h-11 px-3 rounded-xl border border-slate-200 bg-white font-bold text-[13px] text-slate-600 outline-none focus:border-primary">
            <option value="all">Toutes les formules</option>
            <option value="essentiel">Essentiel</option>
            <option value="boost">Boost</option>
            <option value="premium">Premium</option>
            <option value="none">Sans formule</option>
          </select>
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="h-11 px-3 rounded-xl border border-slate-200 bg-white font-bold text-[13px] text-slate-600 outline-none focus:border-primary">
            <option value="all">Tous les niveaux</option>
            {grades.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {activeFilterChips.map((chip) => (
              <span key={chip.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-[11.5px] font-bold">
                {chip.label}
                <button onClick={chip.clear} aria-label="Retirer le filtre"><X size={12} /></button>
              </span>
            ))}
            <button onClick={() => { setStatusFilter('all'); setPackageFilter('all'); setGradeFilter('all'); }} className="text-[11.5px] font-bold text-slate-400 hover:text-slate-600">Réinitialiser</button>
          </div>
        )}
      </AdminCard>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-slate-900 text-white">
          <span className="text-[13px] font-bold flex-1">{selected.size} sélectionné{selected.size > 1 ? 's' : ''}</span>
          <button onClick={bulkArchive} className="text-[12.5px] font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Archiver la sélection</button>
          <button onClick={() => setSelected(new Set())} className="text-[12.5px] font-bold text-white/60 hover:text-white">Annuler</button>
        </div>
      )}

      <AdminCard className="overflow-hidden">
        {students.loading ? (
          <div className="p-4 space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-50 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState icon={Users} title={students.data.length === 0 ? 'Aucun étudiant pour le moment' : 'Aucun résultat'} description={students.data.length === 0 ? 'Ajoutez votre premier étudiant pour commencer.' : 'Essayez un autre terme de recherche ou réinitialisez les filtres.'} cta={students.data.length === 0 ? { label: 'Ajouter un étudiant', onClick: () => openStudentModal(null) } : undefined} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 sticky top-0 bg-white">
                  <th className="p-3.5 w-10"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded accent-primary" /></th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Étudiant</th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Niveau</th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Formule</th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Coach</th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Inscription</th>
                  <th className="p-3.5 text-start font-black text-slate-500 text-[11.5px] uppercase tracking-wide">Statut</th>
                  <th className="p-3.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 group">
                    <td className="p-3.5"><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded accent-primary" /></td>
                    <td className="p-3.5">
                      <button onClick={() => navigate(`/admin/students/${s.id}`)} className="flex items-center gap-3 text-start">
                        <Avatar name={s.name} src={s.avatar} size={36} />
                        <span>
                          <span className="block font-black text-slate-800 group-hover:text-primary transition-colors">{s.name}</span>
                          <span className="block text-[11.5px] font-medium text-slate-400" dir="ltr">{s.username}</span>
                        </span>
                      </button>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600">{s.grade}</td>
                    <td className="p-3.5"><PackageBadge pkg={s.package} /></td>
                    <td className="p-3.5 font-medium text-slate-500">{s.coachName || '—'}</td>
                    <td className="p-3.5 font-medium text-slate-500">{new Date(s.joinDate).toLocaleDateString('fr-FR')}</td>
                    <td className="p-3.5"><StudentStatusBadge status={s.status} /></td>
                    <td className="p-3.5 relative">
                      <button onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === s.id && (
                        <div className="absolute end-3 top-full mt-1 w-52 bg-white rounded-xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-1.5 z-20 text-start">
                          <button onClick={() => { navigate(`/admin/students/${s.id}`); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50"><Eye size={14} /> Voir le dossier</button>
                          <button onClick={() => { openStudentModal(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50"><Edit size={14} /> Modifier</button>
                          {s.status === 'active' ? (
                            <button onClick={() => changeStatus(s, 'suspended')} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-amber-600 hover:bg-amber-50"><Ban size={14} /> Suspendre</button>
                          ) : s.status === 'suspended' ? (
                            <button onClick={() => changeStatus(s, 'active')} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-emerald-600 hover:bg-emerald-50"><Unlock size={14} /> Réactiver</button>
                          ) : null}
                          {s.status !== 'archived' && (
                            <button onClick={() => { setConfirmArchive(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-bold text-rose-600 hover:bg-rose-50"><Archive size={14} /> Archiver</button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!confirmArchive}
        title="Archiver cet étudiant ?"
        description={`${confirmArchive?.name} n'apparaîtra plus dans les listes actives. Son dossier reste accessible et peut être réactivé à tout moment.`}
        confirmLabel="Archiver"
        tone="danger"
        onCancel={() => setConfirmArchive(null)}
        onConfirm={async () => { if (confirmArchive) await changeStatus(confirmArchive, 'archived'); setConfirmArchive(null); }}
      />
    </div>
  );
};
