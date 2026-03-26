import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchQuestions } from '../hooks/useFetchQuestions';
import { ArrowLeft, Play, Settings2 } from 'lucide-react';

export default function Filter() {
  const { ders } = useParams();
  const navigate = useNavigate();
  const { questions, loading } = useFetchQuestions();

  const [selectedYil, setSelectedYil] = useState('Hepsi');
  const [selectedSinav, setSelectedSinav] = useState('Hepsi');
  const [questionCount, setQuestionCount] = useState(20);
  const [orderMode, setOrderMode] = useState('Sıralı');
  const [isStudyMode, setIsStudyMode] = useState(false);

  const courseQuestions = useMemo(() => {
    if (!questions) return [];
    return questions.filter(q => q.ders === ders);
  }, [questions, ders]);

  const availableYil = useMemo(() => {
    return ['Hepsi', ...Array.from(new Set(courseQuestions.map(q => q.yil))).sort((a,b)=>b-a)];
  }, [courseQuestions]);

  const availableSinav = useMemo(() => {
    return ['Hepsi', ...Array.from(new Set(courseQuestions.map(q => q.sinav?.trim()))).sort()];
  }, [courseQuestions]);

  const filteredQuestions = useMemo(() => {
    let qList = courseQuestions;
    if (selectedYil !== 'Hepsi') {
      qList = qList.filter(q => q.yil === parseInt(selectedYil));
    }
    if (selectedSinav !== 'Hepsi') {
      qList = qList.filter(q => q.sinav?.trim() === selectedSinav);
    }
    return qList;
  }, [courseQuestions, selectedYil, selectedSinav]);

  const handleStart = () => {
    let finalQuestions = [...filteredQuestions];
    
    if (orderMode === 'Karışık') {
      finalQuestions = finalQuestions.sort(() => Math.random() - 0.5);
    }
    
    // limit question count
    if (questionCount !== 'Hepsi' && finalQuestions.length > questionCount) {
      finalQuestions = finalQuestions.slice(0, questionCount);
    }

    if (finalQuestions.length === 0) {
      alert("Bu filtrelere uygun soru bulunamadı!");
      return;
    }

    navigate('/quiz', { state: { questions: finalQuestions, ders, quizType: 'new', isStudyMode } });
  };

  if (loading) return null;

  return (
    <div className="p-6 max-w-lg mx-auto pb-32">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-auzef transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight line-clamp-1 flex-1">
          {ders}
        </h1>
      </div>

      <div className="glass rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-auzef/10 p-2 rounded-lg text-auzef">
            <Settings2 size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Sınav Ayarları</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Çalışma Modu</label>
            <div className="flex items-center justify-between gap-3 bg-white/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
               <div>
                <p className="text-[15px] font-bold text-gray-900">Cevapları Göster</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Doğru şıklar işaretli olarak gelir</p>
              </div>
              <div 
                onClick={() => setIsStudyMode(!isStudyMode)}
                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0 ${isStudyMode ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isStudyMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Yıl</label>
            <div className="flex flex-wrap gap-2">
              {availableYil.map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYil(y)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedYil === y ? 'bg-auzef text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-100 hover:border-auzef/30'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sınav Türü</label>
            <div className="flex flex-wrap gap-2">
              {availableSinav.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSinav(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedSinav === s ? 'bg-auzef text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Soru Sayısı <span className="text-xs font-normal text-gray-400">({filteredQuestions.length} soru)</span></label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 'Hepsi'].map(c => (
                <button
                  key={c}
                  onClick={() => setQuestionCount(c)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    questionCount === c ? 'bg-auzef text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Sıralama</label>
            <div className="grid grid-cols-2 gap-2">
              {['Sıralı', 'Karışık'].map(m => (
                <button
                  key={m}
                  onClick={() => setOrderMode(m)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    orderMode === m ? 'bg-gray-800 text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={filteredQuestions.length === 0}
        className="w-full bg-gradient-to-r from-auzef to-auzef-light text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-auzef/30 hover:shadow-auzef/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <Play fill="currentColor" size={20} />
        Sınava Başla
      </button>
    </div>
  );
}
