'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4f9] p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-blue-50">
        <h2 className="text-2xl font-bold text-[#dc3545] mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-500 text-sm mb-6">Maaf, terjadi kendala teknis. Silakan coba lagi.</p>
        <button
          onClick={() => reset()}
          className="w-full py-3 bg-[#003d79] text-white rounded-xl font-bold text-sm hover:bg-[#002D5C] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
