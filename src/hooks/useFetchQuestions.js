import { useState, useEffect } from 'react';

const DATA_URL = 'https://raw.githubusercontent.com/kayayunus/auzef-test-merkezi/main/data/questions.json';

export function useFetchQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetching questions failed:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { questions, loading, error };
}
