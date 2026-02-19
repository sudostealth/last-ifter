
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Check, ArrowRight, ArrowLeft, Loader2, Sparkles, Smartphone, Info } from 'lucide-react';
import { RegistrationData, Language, Theme } from '../types';
import { TRANSLATIONS, EVENT_CONFIG } from '../constants';
import { submitToGoogleSheet } from '../services/googleSheet';

interface RegistrationFormProps {
  lang: Language;
  theme: Theme;
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ lang, theme, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    batch: '231',
    dept: 'CSE',
    section: 'A',
    paymentMethod: 'bkash',
    senderNo: '',
    trxId: ''
  });

  const PAYMENT_NUMBER = "01875412504";

  const t = TRANSLATIONS[lang];

  const copyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    if (!formData.name) newErrors.name = t.required;
    if (!formData.studentId) newErrors.studentId = t.required;
    else if (!/^\d{9}$/.test(formData.studentId)) newErrors.studentId = t.invalidId;
    
    if (!formData.phone) newErrors.phone = t.required;
    else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) newErrors.phone = t.invalidPhone;
    
    if (formData.batch !== '231') newErrors.batch = t.batchWarning;
    if (formData.dept !== 'CSE') newErrors.dept = t.deptWarning;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderNo || !formData.trxId) return;
    setLoading(true);
    const result = await submitToGoogleSheet(formData);
    if (result) {
      setSuccess(true);
    } else {
      alert("Submission failed. Please check your connection.");
    }
    setLoading(false);
  };

  const updateField = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const isDark = theme === Theme.DARK;

  if (success) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className={`text-center p-6 sm:p-10 backdrop-blur-xl rounded-3xl border ${isDark ? 'bg-emerald-900/40 border-yellow-500/30' : 'bg-white/90 border-emerald-500/30'}`}
      >
        <div className="relative mb-6 inline-block">
          <CheckCircle2 size={64} className={`${isDark ? 'text-yellow-400' : 'text-emerald-600'} mx-auto`} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute -top-2 -right-2 ${isDark ? 'text-yellow-500' : 'text-emerald-500'}`}
          >
            <Sparkles size={20} />
          </motion.div>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-cinzel font-bold mb-4 ${isDark ? 'text-yellow-100' : 'text-emerald-900'}`}>{t.success}</h2>
        <p className={`mb-8 text-sm sm:text-base max-w-sm mx-auto ${isDark ? 'text-emerald-100/70' : 'text-emerald-800/70'}`}>
          {lang === 'en' 
            ? "Your seat at the table is confirmed. Check your email for details." 
            : "আপনার আসন নিশ্চিত করা হয়েছে। বিস্তারিত তথ্যের জন্য আপনার ইমেইল চেক করুন।"}
        </p>
        <button 
          onClick={onClose}
          className={`w-full sm:w-auto ${isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'} font-bold px-8 py-3.5 rounded-full transition-all`}
        >
          {lang === 'en' ? "Return Home" : "ফিরে যান"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full max-w-lg backdrop-blur-2xl border rounded-[2rem] shadow-2xl p-5 sm:p-8 md:p-10 ${
      isDark ? 'bg-emerald-900/50 border-white/10 text-white' : 'bg-white/95 border-emerald-100 text-emerald-950'
    }`}>
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h2 className={`text-xl sm:text-2xl font-cinzel font-bold ${isDark ? 'text-yellow-400' : 'text-emerald-700'}`}>{t.register}</h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-emerald-100/50' : 'text-emerald-800/50'}`}>{lang === 'en' ? `Step ${step} of 2` : `ধাপ ${step} / ২`}</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <div className={`h-1 sm:h-1.5 w-6 sm:w-8 rounded-full transition-all duration-500 ${step >= 1 ? (isDark ? 'bg-yellow-500' : 'bg-emerald-600') : 'bg-white/10'}`} />
          <div className={`h-1 sm:h-1.5 w-6 sm:w-8 rounded-full transition-all duration-500 ${step >= 2 ? (isDark ? 'bg-yellow-500' : 'bg-emerald-600') : 'bg-white/10'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Name</label>
              <input 
                type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)}
                placeholder="Full Name" 
                className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                }`}
              />
              {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">{t.studentId}</label>
                <input 
                  type="text" value={formData.studentId} onChange={(e) => updateField('studentId', e.target.value)}
                  placeholder="231XXXXXX" 
                  className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                />
                {errors.studentId && <p className="text-[10px] text-red-500 ml-1">{errors.studentId}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Phone</label>
                <input 
                  type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="017XXXXXXXX" 
                  className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Batch</label>
                <select 
                  value={formData.batch} onChange={(e) => updateField('batch', e.target.value)}
                  className={`w-full border rounded-xl px-2 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none ${
                    isDark ? 'bg-emerald-950 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                >
                  <option value="231">231</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Dept</label>
                <select 
                  value={formData.dept} onChange={(e) => updateField('dept', e.target.value)}
                  className={`w-full border rounded-xl px-2 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none ${
                    isDark ? 'bg-emerald-950 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                >
                  <option value="CSE">CSE</option>
                  <option value="EEE">EEE</option>
                  <option value="BBA">BBA</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Sec</label>
                <select 
                  value={formData.section} onChange={(e) => updateField('section', e.target.value)}
                  className={`w-full border rounded-xl px-2 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none ${
                    isDark ? 'bg-emerald-950 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleNext}
              className={`w-full font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 mt-4 sm:mt-6 transition-all ${
                isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400 shadow-lg' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
              }`}
            >
              {t.next} <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className={`border p-4 sm:p-5 rounded-3xl ${isDark ? 'bg-emerald-950/50 border-yellow-500/20 shadow-inner' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}>
              <h4 className={`text-sm sm:text-base font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-yellow-400' : 'text-emerald-700'}`}>
                <Smartphone size={18} /> {lang === 'en' ? "Payment Information" : "পেমেন্ট তথ্য"}
              </h4>
              
              <div className="space-y-4 mb-6">
                <div 
                  onClick={copyNumber}
                  className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border group relative active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/10 hover:border-yellow-500/30' : 'bg-white border-emerald-100 hover:border-emerald-500/30 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                       <Smartphone size={24} className={isDark ? 'text-yellow-400' : 'text-emerald-600'} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-50 tracking-wider">Send Money to</p>
                      <p className="text-xl font-mono font-black tracking-tight">{PAYMENT_NUMBER}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      copied ? 'bg-green-500 text-white' : (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-100 text-emerald-700')
                    }`}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </div>
                  
                  {/* Tooltip hint */}
                  {!copied && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-emerald-950 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Click to copy number
                    </motion.div>
                  )}
                </div>

                <div className={`flex items-start gap-3 p-3 rounded-2xl border ${isDark ? 'bg-yellow-500/5 border-yellow-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                  <Info size={16} className="mt-0.5 shrink-0 opacity-60" />
                  <p className="text-[11px] sm:text-xs leading-relaxed opacity-80">
                    {lang === 'en' 
                      ? `Use "Send Money" (Personal) to the number above. Amount: BDT ${EVENT_CONFIG.fee}.` 
                      : `উপরের নাম্বারে ৩০০/- টাকা "Send Money" (পার্সোনাল) করুন।`}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => updateField('paymentMethod', 'bkash')}
                  className={`relative flex-1 py-4 rounded-2xl transition-all border-2 overflow-hidden flex flex-col items-center justify-center gap-2 ${
                    formData.paymentMethod === 'bkash' 
                    ? 'bg-[#D12053] border-[#D12053] text-white shadow-xl shadow-[#D12053]/20 scale-[1.05] z-10' 
                    : 'bg-white/5 border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  <img src="https://raw.githubusercontent.com/Nayeem-231/icons/main/bkash.png" alt="bKash" className="w-12 h-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span className={`text-xs font-black uppercase ${formData.paymentMethod === 'bkash' ? 'block' : 'hidden'}`}>bKash</span>
                  {!formData.paymentMethod && <span className="text-xs font-black">bKash</span>}
                  {formData.paymentMethod === 'bkash' && <motion.div layoutId="payment-active" className="absolute top-2 right-2"><Check size={14} /></motion.div>}
                </button>
                <button 
                  onClick={() => updateField('paymentMethod', 'rocket')}
                  className={`relative flex-1 py-4 rounded-2xl transition-all border-2 overflow-hidden flex flex-col items-center justify-center gap-2 ${
                    formData.paymentMethod === 'rocket' 
                    ? 'bg-[#8C3494] border-[#8C3494] text-white shadow-xl shadow-[#8C3494]/20 scale-[1.05] z-10' 
                    : 'bg-white/5 border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  <img src="https://raw.githubusercontent.com/Nayeem-231/icons/main/rocket.png" alt="Rocket" className="w-12 h-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span className={`text-xs font-black uppercase ${formData.paymentMethod === 'rocket' ? 'block' : 'hidden'}`}>Rocket</span>
                  {!formData.paymentMethod && <span className="text-xs font-black">Rocket</span>}
                  {formData.paymentMethod === 'rocket' && <motion.div layoutId="payment-active" className="absolute top-2 right-2"><Check size={14} /></motion.div>}
                </button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Your BKash/Rocket Number</label>
                <input 
                  type="text" value={formData.senderNo} onChange={(e) => updateField('senderNo', e.target.value)}
                  placeholder="01XXXXXXXXX" 
                  className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider opacity-60 ml-1">Transaction ID (TrxID)</label>
                <input 
                  type="text" value={formData.trxId} onChange={(e) => updateField('trxId', e.target.value)}
                  placeholder="e.g. A9B8C7D6E5" 
                  className={`w-full border rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleBack}
                className={`flex-[1] font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
              >
                <ArrowLeft size={16} /> {t.back}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.senderNo || !formData.trxId}
                className={`flex-[2] font-bold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 ${
                  isDark ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-400 shadow-lg' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : t.submit}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationForm;
