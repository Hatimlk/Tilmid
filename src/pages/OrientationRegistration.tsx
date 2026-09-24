import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowLeft, Sparkles, UserRound, GraduationCap } from 'lucide-react';
import { ORIENTATION_PACKS } from '../constants/orientationPacks';
import { dataManager } from '../utils/dataManager';
import SEO from '../components/SEO';

const FILIERE_OPTIONS = [
  'Sciences Mathématiques A / علوم رياضية أ',
  'Sciences Mathématiques B / علوم رياضية ب',
  'Sciences Physiques / علوم فيزيائية',
  'Sciences de la Vie et de la Terre / علوم الحياة والأرض',
  'Sciences et Technologies Électriques / علوم وتكنولوجيات كهربائية',
  'Sciences et Technologies Mécaniques / علوم وتكنولوجيات ميكانيكية',
  'Sciences Économiques / علوم اقتصادية',
  'Sciences de Gestion Comptable / علوم التدبير المحاسباتي',
  'Lettres / آداب',
  'Sciences Humaines / علوم إنسانية',
  'Arts Appliqués / فنون تطبيقية',
  'Baccalauréat Professionnel / بكالوريا مهنية',
  'Autre / أخرى',
];
const SCHOOL_TYPE_OPTIONS = ['Public / عمومي', 'Privé / خصوصي'];
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
    schoolType: SCHOOL_TYPE_OPTIONS[0],
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
        schoolType: formData.schoolType,
        city: formData.city,
        bacYear: formData.bacYear,
        regionalGrade: formData.regionalGrade,
        pack: selectedPack || 'Non précisé',
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', phone: '', filiere: FILIERE_OPTIONS[0], schoolType: SCHOOL_TYPE_OPTIONS[0], city: '', bacYear: BAC_YEAR_OPTIONS[1], regionalGrade: '' });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,143,245,0.10),_transparent_32%),#f8fafc] py-10 md:py-16 px-4">
      <SEO
        title="Inscription - Orientation Tilmid"
        description="Choisissez votre pack d'orientation Tilmid et remplissez le formulaire d'inscription."
        noindex={true}
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/tawjih')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span>Retour aux packs d'orientation</span>
        </button>

        <div className="bg-white rounded-[2rem] border border-blue-100/70 shadow-[0_24px_70px_-24px_rgba(8,117,232,0.28)] overflow-hidden">
          {isSuccess ? (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Votre demande a bien été envoyée !</h3>
              <p className="text-slate-500 font-medium">Merci, notre équipe vous contactera très bientôt pour finaliser votre inscription.</p>
              <button onClick={() => navigate('/tawjih')} className="mt-6 text-primary font-bold hover:underline">Retour aux packs</button>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden bg-gradient-to-br from-[#071a3b] via-[#0b2d62] to-[#0875e8] px-6 py-10 md:px-10 md:py-12 text-center text-white">
                <div className="absolute -top-20 -end-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-28 -start-16 w-72 h-72 rounded-full bg-cyan-400/10 blur-2xl" />
                <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] ring-1 bg-white/10 text-blue-100 ring-white/20">
                  <Sparkles size={13} />
                  Inscription
                </span>
                <h1 className="relative text-3xl md:text-4xl font-black mt-4 mb-2 tracking-tight">Construisons votre orientation</h1>
                <p className="relative text-blue-100/80 text-sm md:text-base font-medium">Choisissez votre pack et partagez-nous votre profil scolaire.</p>
              </div>

              <div className="p-6 md:p-10 pb-0 md:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black text-sm">1</span>
                  <div><h2 className="font-black text-slate-900">Choisissez votre pack</h2><p className="text-xs font-medium text-slate-400">Vous pourrez le confirmer avec notre conseiller.</p></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                  {ORIENTATION_PACKS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPack(p.name)}
                      className={`relative px-3 py-3.5 min-h-[58px] rounded-2xl text-[12px] leading-tight font-black border transition-all ${selectedPack === p.name
                        ? 'bg-blue-50 text-primary border-primary ring-2 ring-primary/10 shadow-sm'
                        : 'bg-slate-50/70 text-slate-600 border-slate-100 hover:border-primary/40 hover:bg-blue-50/50'
                        }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
                <div className="flex items-center gap-3 border-t border-slate-100 pt-7">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center"><UserRound size={17} /></span>
                  <div><h2 className="font-black text-slate-900">Vos informations</h2><p className="text-xs font-medium text-slate-400">Les champs essentiels pour vous recontacter.</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[13px] font-bold text-slate-600 mb-1.5">Nom complet</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium"
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
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                </div>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-7">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center"><GraduationCap size={18} /></span>
                  <div><h2 className="font-black text-slate-900">Votre profil scolaire</h2><p className="text-xs font-medium text-slate-400">Pour préparer des recommandations plus pertinentes.</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="filiere" className="block text-[13px] font-bold text-slate-600 mb-1.5">Filière</label>
                  <select
                    id="filiere"
                    name="filiere"
                    value={formData.filiere}
                    onChange={handleInputChange}
                    className="w-full h-[50px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-900 font-medium bg-white"
                  >
                    {FILIERE_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="schoolType" className="block text-[13px] font-bold text-slate-600 mb-1.5">Type d’école</label>
                  <select id="schoolType" name="schoolType" value={formData.schoolType} onChange={handleInputChange} className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium bg-white">
                    {SCHOOL_TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
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
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="bacYear" className="block text-[13px] font-bold text-slate-600 mb-1.5">Année du Bac</label>
                  <select
                    id="bacYear"
                    name="bacYear"
                    value={formData.bacYear}
                    onChange={handleInputChange}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium bg-white"
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
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-slate-900 font-medium"
                  />
                </div>
                </div>

                {error && (
                  <p className="text-rose-600 text-sm font-semibold text-center bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[56px] bg-gradient-to-r from-primary to-[#0875E8] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:translate-y-0"
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
