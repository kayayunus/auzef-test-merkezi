import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Stats() {
  const { completedTests } = useAppContext();

  const stats = useMemo(() => {
    const totalExams = completedTests.length;
    const totalQuestions = completedTests.reduce((acc, curr) => acc + (curr.totalQuestions || curr.toplamSoru || 0), 0);
    const totalCorrect = completedTests.reduce((acc, curr) => acc + (curr.score ?? curr.dogruSayisi ?? 0), 0);
    const totalWrong = totalQuestions > 0 ? totalQuestions - totalCorrect : 0;
    const overallSuccess = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const recentTests = [...completedTests]
      .sort((a,b) => new Date(a.date || a.tarih || 0) - new Date(b.date || b.tarih || 0))
      .slice(-7)
      .reverse(); // Show newest at the top

    return { totalExams, totalQuestions, totalCorrect, totalWrong, overallSuccess, recentTests };
  }, [completedTests]);

  const handleResetProgress = () => {
    if (window.confirm("Tüm ilerlemen, başarı puanların ve yanlış cevapladığın sorular silinecek. Emin misin?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-32">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="text-auzef" size={32} />
          Analiz
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Gelişimini buradan takip et.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-5 ring-1 ring-white/50 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-auzef/10 rounded-full blur-xl"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Çözülen Sınav</p>
          <div className="flex items-end gap-2 text-gray-800">
            <span className="text-4xl font-black">{stats.totalExams}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 ring-1 ring-white/50 relative overflow-hidden bg-gradient-to-br from-auzef to-auzef-dark border-0">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2">Ortalama Başarı</p>
          <div className="flex items-end gap-1 text-white z-10 relative">
            <span className="text-4xl font-black">{stats.overallSuccess}</span>
            <span className="text-xl font-bold mb-1">%</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 ring-1 ring-white/50 col-span-2 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Doğru / Yanlış</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-black text-green-500">{stats.totalCorrect} D</span>
              <span className="text-gray-300 font-light text-xl">|</span>
              <span className="text-2xl font-black text-red-500">{stats.totalWrong} Y</span>
            </div>
          </div>
          <Target className="text-gray-100" size={48} strokeWidth={1} />
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-8 ring-1 ring-white/60">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Son Sınavlar</h2>
        </div>
        
        {stats.recentTests.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTests.map((test, i) => {
               const ders = test.ders || test.dersAdi || 'Bilinmeyen Ders';
               const puan = test.puan !== undefined ? test.puan : (test.totalQuestions ? Math.round(((test.score || 0) / test.totalQuestions) * 100) : 0);
               const dogru = test.dogruSayisi ?? test.score ?? 0;
               const toplam = test.toplamSoru ?? test.totalQuestions ?? 0;
               const dateStr = new Date(test.tarih || test.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

               return (
                 <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-white hover:bg-white transition-colors shadow-sm">
                   <div className="flex items-center gap-3">
                     <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${puan > 70 ? 'bg-green-100 text-green-600 ring-1 ring-green-200' : puan > 40 ? 'bg-yellow-100 text-yellow-600 ring-1 ring-yellow-200' : 'bg-red-100 text-red-600 ring-1 ring-red-200'}`}>
                       {puan}
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-800 text-[14px] leading-tight line-clamp-1 mb-1">{ders}</h4>
                       <p className="text-[12px] font-semibold text-gray-500">{dateStr} • {dogru}/{toplam} Doğru</p>
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 font-medium text-sm text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            Henüz yeterli veri yok.<br/>Sınav çözdükçe liste burada belirecek.
          </div>
        )}
      </div>
      
      <div className="glass rounded-3xl p-6 ring-1 ring-white/60 flex items-start gap-4">
        <div className="bg-auzef/10 p-3 rounded-2xl text-auzef mt-1 shrink-0">
          <Target size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-1">Motivasyon</h3>
          <p className="text-sm font-medium text-gray-500 leading-relaxed">
            {stats.overallSuccess > 70 ? 'Harika gidiyorsun! Bu tempoyla devam edersen sınavları rahatlıkla geçersin.' : 
             stats.overallSuccess > 40 ? 'İyi yoldasın ama biraz daha gayret! Yanlışlarına tekrar dönüp bakmayı unutma.' :
             'Başlangıçlar hep zordur. Yanlışların senin en iyi öğretmenin, pes etme!'}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200/60 pb-4">
        <button 
          onClick={handleResetProgress}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors shadow-sm active:scale-[0.98]"
        >
          <Trash2 size={20} />
          İlerlemeyi Sıfırla
        </button>
      </div>
    </div>
  );
}
