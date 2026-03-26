import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [completedTests, setCompletedTests] = useState(() => {
    const saved = localStorage.getItem('auzef_completed_tests');
    return saved ? JSON.parse(saved) : [];
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('auzef_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('auzef_completed_tests', JSON.stringify(completedTests));
  }, [completedTests]);

  useEffect(() => {
    localStorage.setItem('auzef_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  const saveTestResult = (result) => {
    setCompletedTests(prev => [...prev, { ...result, id: Date.now() }]);
  };

  const addMistake = (question) => {
    setMistakes(prev => {
      // Prevent duplicates based on ders and soru_no (and maybe yıl/sınav if needed, but ders+soru_no is usually unique)
      if (prev.find(q => q.ders === question.ders && q.soru_no === question.soru_no && q.yil === question.yil)) {
        return prev;
      }
      return [...prev, question];
    });
  };

  const removeMistake = (ders, soru_no, yil) => {
    setMistakes(prev => prev.filter(q => !(q.ders === ders && q.soru_no === soru_no && q.yil === yil)));
  };

  return (
    <AppContext.Provider value={{
      completedTests,
      saveTestResult,
      mistakes,
      addMistake,
      removeMistake
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
