import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { ORIENTATION_PACKS } from '../constants/orientationPacks';
import { dataManager } from '../utils/dataManager';
import SEO from '../components/SEO';

const FILIERE_OPTIONS = ['Sciences (PC, SM, SVT, STE, STM…)', 'Économie (ECO, SGC…)', 'Autre'];
const BAC_YEAR_OPTIONS = ['2025', '2026', '2027', 'Année précédente'];

export const OrientationRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPack = (location.state as { pack?: string } | null)?.pack ?? null;

  const [selectedPack, setSelectedPack] = useState<string | null>(initialPack);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    filiere: FILIERE_OPTIONS[0],
    city: '',
    bacYear: BAC_YEAR_OPTIONS[1],
    regionalGrade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.phone || !formData.city) {
      setError('Merci de remplir toutes les informations requises.');
      return;
    }
    setIsSubmitting(true);
    try {
      await dataManager.saveOrientationRequest({
        name: formData.name,
        phone: formData.phone,
        filiere: formData.filiere,
        city: formData.city,
        bacYear: formData.bacYear,
        regionalGrade: formData.regionalGrade,
        pack: selectedPack || 'Non précisé',
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', filiere: FILIERE_OPTIONS[0], city: '', bacYear: BAC_YEAR_OPTIONS[1], regionalGrade: '' });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24 px-4">
      <SEO
        title="Inscription - Orientation Tilmid"
        description="Choisissez votre pack d'orientation Tilmid et remplissez le formulaire d'inscription."
        noindex={true}
      />
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/tawjih')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span>Retour aux packs d'orientation</span>
        </button>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] p-8 md:p-10">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Votre demande a bien été envoyée !</h3>
              <p className="text-slate-500 font-medium">Merci, notre équipe vous contactera très bientôt pour finaliser votre inscription.</p>
              <button onClick={() => navigate('/tawjih')} className="mt-6 text-emerald-600 font-bold hover:underline">Retour aux packs</button>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] ring-1 bg-emerald-50 text-emerald-600 ring-current/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Inscription
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 mb-2 tracking-tight">Choisissez votre pack</h1>
                <p className="text-slate-500 text-sm font-medium">Remplissez vos informations, nous vous recontactons rapidement.</p>
              </div>

              <div className="mb-6">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-2 text-center">Pack choisi</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {ORIENTATION_PACKS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPack(p.name)}
                      className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-bold border transition-all ${selectedPack === p.name
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400/40'
                        }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-[13px] font-bold text-slate-600 mb-1.5">Nom complet</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[13px] font-bold text-slate-600 mb-1.5">Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="06 XX XX XX XX"
                    dir="ltr"
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="filiere" className="block text-[13px] font-bold text-slate-600 mb-1.5">Filière</label>
                  <select
                    id="filiere"
                    name="filiere"
                    value={formData.filiere}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium bg-white"
                  >
                    {FILIERE_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className="block text-[13px] font-bold text-slate-600 mb-1.5">Ville</label>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Votre ville"
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="bacYear" className="block text-[13px] font-bold text-slate-600 mb-1.5">Année du Bac</label>
                  <select
                    id="bacYear"
                    name="bacYear"
                    value={formData.bacYear}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium bg-white"
                  >
                    {BAC_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="regionalGrade" className="block text-[13px] font-bold text-slate-600 mb-1.5">Note du régional</label>
                  <input
                    id="regionalGrade"
                    name="regionalGrade"
                    value={formData.regionalGrade}
                    onChange={handleInputChange}
                    placeholder="Ex : 14.5"
                    dir="ltr"
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] bg-emerald-600 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
