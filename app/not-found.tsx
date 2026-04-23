export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4f9] p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-blue-50">
        <h2 className="text-2xl font-bold text-[#002D5C] mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-6">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a 
          href="/" 
          className="inline-block w-full py-3 bg-[#003d79] text-white rounded-xl font-bold text-sm hover:bg-[#002D5C] transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
