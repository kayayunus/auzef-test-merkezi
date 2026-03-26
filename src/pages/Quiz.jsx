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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/');
    }
  }, [questions, navigate]);

  if (!questions || questions.length === 0) return null;

  const question = questions[currentIndex];
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
        ders: ders,
        score,
        totalQuestions: questions.length,
        date: new Date().toISOString()
      });
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-3xl p-8 max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sınav Tamamlandı!</h2>
          <p className="text-gray-500 mb-6">{questions.length} soruda {score} doğru yaptınız.</p>
          <div className="text-5xl font-black text-auzef mb-8">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-[100dvh] flex flex-col pt-4 overflow-hidden relative">
      <div className="px-6 mb-6 shrink-0 relative z-10">
        <div className="flex justify-between items-center text-sm font-semibold text-gray-500 mb-2">
          <span>Soru {currentIndex + 1} / {questions.length}</span>
          <span className="text-auzef truncate max-w-[150px]">{ders}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="bg-auzef h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col relative z-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: '100%', opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '-100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass rounded-3xl p-6 sm:p-8 flex-1 flex flex-col shadow-sm w-full"
            style={{ minHeight: '400px', marginBottom: '120px' }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-relaxed mb-6 flex-1 break-words">
              {question.soru}
            </h2>

            <div className="space-y-3">
              {options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectAnswer = opt === question.cevap;
                
                let btnStyle = "bg-white border-gray-100 text-gray-700 hover:border-auzef/40 hover:bg-gray-50/50";
                let animationClass = "";

                if (selectedAnswer) {
                  if (isSelected && isCorrectAnswer) {
                    btnStyle = "bg-green-500 border-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10 relative";
                    animationClass = "scale-[1.02]";
                  } else if (isSelected && !isCorrectAnswer) {
                    btnStyle = "bg-red-500 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] z-10 relative";
                    animationClass = "animate-[shake_0.4s_ease-in-out]";
                  } else if (isCorrectAnswer) {
                    btnStyle = "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500 ring-offset-2";
                  } else {
                    btnStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={opt}
                    disabled={!!selectedAnswer}
                    onClick={() => handleSelect(opt)}
                    whileTap={!selectedAnswer ? { scale: 0.97 } : {}}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${btnStyle} ${animationClass}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                      (isSelected || (selectedAnswer && isCorrectAnswer)) ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {opt}
                    </div>
                    <span className="font-medium flex-1 leading-snug break-words">{question[opt]}</span>
                    
                    {selectedAnswer && isCorrectAnswer && (
                      <Check size={20} className={isSelected ? "text-white" : "text-green-500"} strokeWidth={3} />
                    )}
                    {selectedAnswer && isSelected && !isCorrectAnswer && (
                      <X size={20} className="text-white" strokeWidth={3} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedAnswer && (
          <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe z-50 max-w-xl mx-auto"
          >
            <button
              onClick={handleNext}
              className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-black transition-colors"
            >
              {currentIndex < questions.length - 1 ? "Sonraki Soru" : "Testi Bitir"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
