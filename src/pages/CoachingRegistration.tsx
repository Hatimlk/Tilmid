import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { PACKS, GRADE_OPTIONS } from '../constants/mouwakabaPacks';
import { dataManager } from '../utils/dataManager';
import SEO from '../components/SEO';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwjkIdjHjdglElwR73th4W2F24FOAonO2Lk958jQ-dxKLfTX4BeKPEsDewAGh-vE2t3/exec';

export const CoachingRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPack = (location.state as { pack?: string } | null)?.pack ?? null;

  const [selectedPack, setSelectedPack] = useState<string | null>(initialPack);
  const [formData, setFormData] = useState({ name: '', phone: '', grade: GRADE_OPTIONS[2] });
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
    if (!formData.name || !formData.phone) {
      setError('Merci de remplir toutes les informations requises.');
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, grade: formData.grade, pack: selectedPack || 'Non précisé' }),
      });

      await dataManager.saveCoachingRequest({ name: formData.name, phone: formData.phone, grade: formData.grade });

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', grade: GRADE_OPTIONS[2] });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError('Une erreur est survenue lors de l’envoi. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24 px-4 text-start">
      <SEO
        title="Inscription - Offre d'accompagnement Mouwakaba"
        description="Choisissez votre formule Mouwakaba et remplissez le formulaire d'inscription."
        noindex={true}
      />
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/coaching-offer')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span>Retour aux formules</span>
        </button>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] p-8 md:p-10">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Inscription envoyée !</h3>
              <p className="text-slate-500 font-medium">Merci, notre équipe vous contactera très bientôt pour finaliser votre inscription.</p>
              <button onClick={() => navigate('/coaching-offer')} className="mt-6 text-primary font-bold hover:underline">Retour aux formules</button>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] ring-1 bg-blue-50 text-primary ring-primary/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Réservation
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 mb-2 tracking-tight">Finalisez votre inscription</h1>
                <p className="text-slate-500 text-sm font-medium">Laissez-nous vos coordonnées, nous vous recontactons rapidement.</p>
              </div>

              <div className="mb-6">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-2 text-center">Formule choisie</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {PACKS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setSelectedPack(p.label)}
                      className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-bold border transition-all ${selectedPack === p.label
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                        }`}
                    >
                      {p.label}
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
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium"
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
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-[13px] font-bold text-slate-600 mb-1.5">Niveau scolaire</label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium bg-white"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[52px] bg-primary text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:bg-[#0875E8] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  <span>Confirmer mon inscription</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
