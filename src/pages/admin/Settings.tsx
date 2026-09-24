import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { AdminCard, AdminPageHeader, AdminErrorState } from '../../components/admin/primitives';
import { dataManager } from '../../utils/dataManager';
import { PlatformSettings } from '../../types';

type FormState = {
  contactPhone: string; contactEmail: string; whatsappNumber: string;
  instagramUrl: string; tiktokUrl: string; facebookUrl: string; youtubeUrl: string;
};

const fromSettings = (s: PlatformSettings): FormState => ({
  contactPhone: s.contact_phone || '',
  contactEmail: s.contact_email || '',
  whatsappNumber: s.whatsapp_number || '',
  instagramUrl: s.instagram_url || '',
  tiktokUrl: s.tiktok_url || '',
  facebookUrl: s.facebook_url || '',
  youtubeUrl: s.youtube_url || '',
});

const FIELDS: { key: keyof FormState; label: string; placeholder: string }[] = [
  { key: 'contactPhone', label: 'Téléphone de contact', placeholder: '+212778104220' },
  { key: 'contactEmail', label: 'E-mail de contact', placeholder: 'contact@tilmide.ma' },
  { key: 'whatsappNumber', label: 'Lien WhatsApp', placeholder: 'https://wa.me/...' },
  { key: 'instagramUrl', label: 'Instagram', placeholder: 'https://www.instagram.com/...' },
  { key: 'tiktokUrl', label: 'TikTok', placeholder: 'https://www.tiktok.com/@...' },
  { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://web.facebook.com/...' },
  { key: 'youtubeUrl', label: 'YouTube', placeholder: 'https://www.youtube.com/@...' },
];

export const AdminSettings: React.FC = () => {
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setError(false);
    try {
      setForm(fromSettings(await dataManager.getSettings()));
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaved(false);
    try {
      await dataManager.saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Paramètres"
        breadcrumb="Administration / Administration"
        description="Coordonnées et réseaux sociaux affichés publiquement sur le site (pied de page)."
      />

      {error ? (
        <AdminCard><AdminErrorState onRetry={load} /></AdminCard>
      ) : !form ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : (
        <AdminCard className="p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-[13px] font-bold text-slate-700 mb-1.5 block">{f.label}</label>
                <input
                  dir="ltr"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full h-12 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary font-medium text-[14px]"
                />
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-slate-900 text-white font-bold text-[13.5px] hover:bg-primary transition-colors disabled:opacity-70">
                <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                  <CheckCircle2 size={15} /> Enregistré
                </span>
              )}
            </div>
          </form>
        </AdminCard>
      )}
    </div>
  );
};
