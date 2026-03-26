import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Stats() {
  const { completedTests } = useAppContext();

  const stats = useMemo(() => {
    const totalExams = completedTests.length;
    const totalQuestions = completedTests.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    const totalCorrect = completedTests.reduce((acc, curr) => acc + curr.score, 0);
    const overallSuccess = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const recentTests = [...completedTests].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-7);
    const chartData = recentTests.map((t, index) => ({
      name: `Sınav ${index + 1}`,
      basari: Math.round((t.score / t.totalQuestions) * 100),
      ders: t.ders
    }));

    return { totalExams, totalQuestions, overallSuccess, chartData };
  }, [completedTests]);

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
      </div>

      <div className="glass rounded-3xl p-6 mb-8 ring-1 ring-white/60">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-gray-400" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Son Sınavların (Başarı %)</h2>
        </div>
        
        {stats.chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Bar dataKey="basari" radius={[6, 6, 6, 6]} barSize={32}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.basari > 70 ? '#4ade80' : entry.basari > 40 ? '#fbbf24' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 font-medium text-sm text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            Henüz yeterli veri yok.<br/>Sınav çözdükçe grafik burada belirecek.
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
    </div>
  );
}
