import React, { useEffect, useState } from 'react';
import axios from 'axios';
import he from 'he';
import './App.css';

const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState(9); // Default category: General Knowledge
  const [lives, setLives] = useState(3); // Initialize with 3 lives
  const [points, setPoints] = useState(0); // Initialize with 0 points

  const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Books' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 13, name: 'Musicals & Theatres' },
    { id: 14, name: 'Television' },
    { id: 15, name: 'Video Games' },
    { id: 16, name: 'Board Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Computers' },
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple&category=${category}`
      );

      if (response.data.results.length > 0) {
        const fetchedQuestion = he.decode(response.data.results[0].question);
        const fetchedChoices = response.data.results[0].incorrect_answers;
        const correct = response.data.results[0].correct_answer;

        const shuffledChoices = [...fetchedChoices, correct].sort(
          () => Math.random() - 0.5
        );

        setQuestion(fetchedQuestion);
        setChoices(shuffledChoices);
        setCorrectAnswer(correct);

        setUserAnswer(null);
        setFeedback('');
        setShowNextButton(false);
      } else {
        console.log('No questions found.');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [category, difficulty]);

  const handleAnswer = (answer) => {
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setFeedback('Correct!');
      setShowNextButton(true);
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}.`);
      setUserAnswer(answer);

      // Disable choices temporarily for 3 seconds on incorrect answer
      setTimeout(() => {
        setUserAnswer(null);
        setFeedback('');
        setShowNextButton(false);
        fetchQuestion(); // Fetch the next question
      }, 3000);
    }
  };

  const handleNextQuestion = () => {
    fetchQuestion();
  };

  return (
    <div className="container">
      <div className="settings-box">
        <h2 className="settings-header">Game Settings</h2>
        <div className="settings-item">
          <label>Category:</label>
          <select
            className="settings-dropdown"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="settings-item">
          <label>Difficulty:</label>
          <select
            className="settings-dropdown"
            onChange={(e) => setDifficulty(e.target.value)}
            value={difficulty}
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
        <div className="settings-item">
          <label>Lives:</label>
          <span>{lives}</span>
        </div>
        <div className="settings-item">
          <label>Points:</label>
          <span>{points}</span>
        </div>
      </div>
      <div className="main-content">
        <h1>Trivia Game</h1>
        <p className="question">Question: {question}</p>
        <div className="choices">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(choice)}
              disabled={userAnswer !== null}
            >
              {choice}
            </button>
          ))}
        </div>

        {feedback && (
          <p
            className={userAnswer === correctAnswer ? 'feedback success' : 'feedback'}
          >
            {feedback}
          </p>
        )}

        {showNextButton && (
          <div className="button-container">
            <button className="next" onClick={handleNextQuestion}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trivia;
