import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TabBar from './components/TabBar';

// Pages
import Home from './pages/Home';
import Filter from './pages/Filter';
import Quiz from './pages/Quiz';
import Mistakes from './pages/Mistakes';
import Stats from './pages/Stats';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen text-gray-800 font-sans">
          <main className="flex-grow pb-20 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/filter/:ders" element={<Filter />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/mistakes" element={<Mistakes />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
          
          <Routes>
            <Route path="/" element={<TabBar />} />
            <Route path="/mistakes" element={<TabBar />} />
            <Route path="/stats" element={<TabBar />} />
            <Route path="*" element={null} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
