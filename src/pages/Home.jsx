import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Loader2, ChevronRight } from 'lucide-react';
import { useFetchQuestions } from '../hooks/useFetchQuestions';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { questions, loading, error } = useFetchQuestions();
  const { completedTests } = useAppContext();
  const navigate = useNavigate();

  const courses = useMemo(() => {
    if (!questions) return [];
    const dersSet = new Set(questions.map(q => q.ders));
    return Array.from(dersSet).map(ders => {
      const tests = completedTests.filter(t => t.ders === ders);
      const totalScore = tests.reduce((acc, curr) => acc + curr.score, 0);
      const totalQuestions = tests.reduce((acc, curr) => acc + curr.totalQuestions, 0);
      const successRate = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      
      const examCount = tests.length;

      return {
        name: ders,
        successRate,
        examCount
      };
    });
  }, [questions, completedTests]);

  const todayQuestionsCount = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return completedTests
      .filter(t => new Date(t.date).toLocaleDateString() === today)
      .reduce((acc, curr) => acc + curr.totalQuestions, 0);
  }, [completedTests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-auzef animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">Veriler yüklenirken hata oluştu: {error}</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          AUZEF <span className="text-transparent bg-clip-text bg-gradient-to-r from-auzef to-auzef-light">Hazırlık</span>
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Hoş geldin. Bugün neler çalışıyoruz?</p>
      </header>

      <div className="glass rounded-3xl p-6 mb-10 overflow-hidden relative shadow-xl shadow-auzef/10 border-0 ring-1 ring-white/50">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-auzef-light/30 to-auzef/5 rounded-full blur-2xl"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Bugün Çözülen Soru</p>
            <p className="text-5xl font-black tracking-tighter text-gray-800">{todayQuestionsCount}</p>
          </div>
          <div className="bg-gradient-to-br from-auzef-light/20 to-auzef/10 p-4 rounded-2xl text-auzef">
            <Trophy size={36} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <BookOpen className="text-auzef" size={24} />
          Dersler
        </h2>
        <div className="space-y-4">
          {courses.map(course => (
            <div 
              key={course.name} 
              onClick={() => navigate(`/filter/${encodeURIComponent(course.name)}`)}
              className="glass rounded-2xl p-5 cursor-pointer hover:bg-white transition-all duration-300 active:scale-95 group relative overflow-hidden ring-1 ring-white/60"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold text-gray-800 mb-3 group-hover:text-auzef transition-colors line-clamp-2 leading-tight">
                  {course.name}
                </h3>
                <div className="bg-gray-100 p-2 rounded-full text-gray-400 group-hover:text-auzef group-hover:bg-auzef/10 transition-colors flex-shrink-0">
                  <ChevronRight size={18} />
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-2 text-[13px]">
                <span className="text-gray-500 font-medium">{course.examCount} Sınav Çözüldü</span>
                <span className="font-bold text-auzef">{course.successRate}% Başarı</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-auzef to-auzef-light h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${course.successRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
