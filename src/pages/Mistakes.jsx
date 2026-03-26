import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, Play, Inbox } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Mistakes() {
  const { mistakes } = useAppContext();
  const navigate = useNavigate();

  const mistakesByCourse = useMemo(() => {
    const grouped = {};
    mistakes.forEach(m => {
      if (!grouped[m.ders]) grouped[m.ders] = [];
      grouped[m.ders].push(m);
    });
    return grouped;
  }, [mistakes]);

  const handleStartMistakesQuiz = (ders) => {
    const dersMistakes = mistakesByCourse[ders];
    navigate('/quiz', { state: { questions: dersMistakes, ders: `${ders} (Yanlışlar)` } });
  };

  const handleStartAllMistakes = () => {
    navigate('/quiz', { state: { questions: mistakes, ders: 'Tüm Yanlışlarım' } });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <XCircle className="text-red-500" size={32} />
          Yanlışlarım
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Hatalarından öğrenerek başarıya ulaş!</p>
      </header>

      {mistakes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Inbox size={64} className="mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-500">Henüz hiç yanlışınız yok.</p>
          <p className="text-sm">Harika gidiyorsunuz!</p>
        </div>
      ) : (
        <>
          <div className="glass rounded-3xl p-6 mb-8 text-center relative overflow-hidden ring-1 ring-red-500/10">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Toplam Yanlış</p>
            <p className="text-5xl font-black text-gray-800 mb-6">{mistakes.length}</p>
            <button 
              onClick={handleStartAllMistakes}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 relative z-10"
            >
              <Play size={18} fill="currentColor" />
              Tüm Yanlışları Tekrar Çöz
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Derslere Göre Dağılım</h2>
            {Object.entries(mistakesByCourse).map(([ders, qs]) => (
              <div key={ders} className="glass rounded-2xl p-5 ring-1 ring-white/60 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight mb-1">{ders}</h3>
                  <p className="text-sm font-medium text-red-500">{qs.length} soru</p>
                </div>
                <button 
                  onClick={() => handleStartMistakesQuiz(ders)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 p-3 rounded-xl transition-colors shrink-0"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
