import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveTestResult, addMistake } = useAppContext();
  
  const stateData = location.state;
  const questions = stateData?.questions || [];
  const ders = stateData?.ders || 'Bilinmeyen Ders';
  const isStudyMode = stateData?.isStudyMode || false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswerHint, setShowAnswerHint] = useState(isStudyMode);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/');
    }
  }, [questions, navigate]);

  useEffect(() => {
    setShowAnswerHint(isStudyMode);
  }, [currentIndex, isStudyMode]);

  if (!questions || questions.length === 0) return null;

  const question = questions[currentIndex];
  // Ensure we sort options alphabetically just in case, but usually they are A B C D E
  const options = ['A', 'B', 'C', 'D', 'E'].filter(opt => question[opt]);

  const handleSelect = (opt) => {
    if (selectedAnswer) return;
    setSelectedAnswer(opt);
    
    const isCorrect = opt === question.cevap;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      addMistake(question);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setCurrentIndex(c => c + 1);
    } else {
      saveTestResult({
        dersAdi: ders, // Map from internal "ders" to requested "dersAdi"
        puan: Math.round((score / questions.length) * 100),
        dogruSayisi: score,
        toplamSoru: questions.length,
        tarih: new Date().toISOString()
      });
      setIsFinished(true);
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };
  const confirmExit = () => {
    navigate('/');
  };
  const cancelExit = () => {
    setShowExitModal(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center bg-gray-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-3xl p-8 max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-500/20 shadow-lg">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sınav Tamamlandı!</h2>
          <p className="text-gray-500 mb-6 font-medium">{questions.length} soruda {score} doğru yaptınız.</p>
          <div className="text-5xl font-black text-auzef mb-8 tracking-tighter">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white font-black py-4 rounded-xl shadow-xl hover:-translate-y-1 transition-transform"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto h-[100dvh] flex flex-col overflow-hidden relative bg-gray-50/50">
      
      {/* Exit Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <X size={32} strokeWidth={2.5}/>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Sınavdan Çıkış</h3>
              <p className="text-gray-500 font-medium mb-8">Sınavdan çıkmak istediğine emin misin? Seçtiğin cevaplar kaydedilmeyecek.</p>
              <div className="flex flex-col gap-3">
                <button onClick={confirmExit} className="w-full py-4 rounded-2xl font-extrabold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors">Çıkış Yap</button>
                <button onClick={cancelExit} className="w-full py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">İptal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-4 py-3 flex-none shrink-0 relative z-10 flex items-center gap-4 bg-white/60 backdrop-blur-md border-b border-gray-100">
        <button 
          onClick={handleExit} 
          className="p-2.5 bg-white rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          <X size={20} strokeWidth={3} />
        </button>
        <div className="flex-1 pr-2">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-auzef text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm tracking-wide shrink-0">
              SORU {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-gray-600 text-[13px] font-bold truncate ml-2 max-w-[140px]">{ders}</span>
          </div>
          <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-auzef to-auzef-light h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable but highly compacted */}
      <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col relative z-0 hide-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: '100%', opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '-100%', opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="flex flex-col w-full h-full justify-center"
          >
            {/* Question Box */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 mb-4 border-b-4 flex-1 overflow-y-auto flex items-center justify-center min-h-[100px] max-h-[40vh] hide-scrollbar">
              <h2 className={`font-bold text-gray-800 leading-snug font-sans text-center ${question.soru.length > 200 ? 'text-sm' : 'text-base sm:text-lg'}`}>
                {question.soru}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5 w-full flex-shrink-0">
              {options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectAnswer = opt === question.cevap;
                
                let btnStyle = "bg-white border-white text-gray-700 hover:border-gray-200 shadow-sm border-2";
                let animationClass = "";

                if (selectedAnswer) {
                  if (isSelected && isCorrectAnswer) {
                    btnStyle = "bg-green-500 border-green-500 text-white shadow-xl shadow-green-500/20 z-10 relative";
                    animationClass = "scale-[1.02]";
                  } else if (isSelected && !isCorrectAnswer) {
                    btnStyle = "bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/20 z-10 relative";
                    animationClass = "animate-[shake_0.4s_ease-in-out]";
                  } else if (isCorrectAnswer || showAnswerHint) {
                    btnStyle = "bg-green-50 border-green-400 text-green-700 ring-1 ring-green-400";
                  } else {
                    btnStyle = "bg-white border-gray-50 text-gray-300 opacity-60";
                  }
                } else if (isStudyMode && isCorrectAnswer) {
                   btnStyle = "bg-green-500 border-green-500 text-white shadow-xl shadow-green-500/20 z-10 relative";
                   animationClass = "scale-[1.02]";
                } else if (showAnswerHint && isCorrectAnswer) {
                   btnStyle = "bg-green-50 border-green-500 text-green-700 shadow-md ring-2 ring-green-500 ring-offset-2 scale-[1.01] z-10 relative";
                }

                return (
                  <motion.button
                    key={opt}
                    disabled={!!selectedAnswer}
                    onClick={() => handleSelect(opt)}
                    whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                    className={`w-full text-left py-3 px-4 sm:py-3.5 sm:px-4 rounded-2xl transition-all duration-300 flex items-center gap-3 ${btnStyle} ${animationClass}`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[15px] flex-shrink-0 transition-colors shadow-sm ${
                      (isSelected || (selectedAnswer && isCorrectAnswer) || (isStudyMode && isCorrectAnswer) || (showAnswerHint && isCorrectAnswer)) ? 'bg-white/25 text-white shadow-none' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {((selectedAnswer || showAnswerHint || isStudyMode) && isCorrectAnswer) ? <Check size={20} className={(isSelected || isStudyMode) ? "text-white" : "text-green-500"} strokeWidth={3} /> : opt}
                    </div>
                    <span className="font-semibold text-[14px] sm:text-[15px] flex-1 leading-snug break-words">
                      {question[opt]}
                    </span>
                    
                    {selectedAnswer && isSelected && !isCorrectAnswer && (
                      <X size={24} className="text-white shrink-0" strokeWidth={3} />
                    )}
                  </motion.button>
                );
              })}

              {!selectedAnswer && !showAnswerHint && (
                <button 
                  onClick={() => setShowAnswerHint(true)} 
                  className="mt-6 w-full py-4 rounded-2xl bg-blue-50/70 text-blue-600 font-extrabold text-[15px] active:bg-blue-100 transition-colors border border-blue-100 flex justify-center items-center gap-2"
                >
                  Cevabı Gör
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Next Button */}
      <AnimatePresence>
        {(selectedAnswer || isStudyMode) && (
          <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={`absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] flex-none pb-safe z-50 rounded-t-[30px] ${isStudyMode && !selectedAnswer ? 'py-3' : 'py-4'}`}
          >
            <button
              onClick={handleNext}
              className="w-full bg-gray-900 text-white font-extrabold text-[16px] py-[14px] rounded-[16px] shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all"
            >
              {currentIndex < questions.length - 1 ? "Sonraki Soru" : "Testi Bitir"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
