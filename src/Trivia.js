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
  const [category, setCategory] = useState(9);
  const [lives, setLives] = useState(3);
  const [points, setPoints] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const difficultyOptions = ['easy', 'medium', 'hard'];
  const categoryOptions = [
    { id: 9, name: 'General Knowledge' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
  ];

  const fetchQuestion = async () => {
    setButtonsDisabled(false); // Enable buttons for the next question
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple&category=${category}`
      );

      const [result] = response.data.results;

      if (result) {
        const { question: fetchedQuestion, incorrect_answers: fetchedChoices, correct_answer: correct } = result;
        const shuffledChoices = [...fetchedChoices, correct].sort(() => Math.random() - 0.5);

        setQuestion(he.decode(fetchedQuestion));
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
  }, [difficulty, category]);

  const handleAnswer = (answer) => {
    setButtonsDisabled(true); // Disable buttons after selecting an answer
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setFeedback('Correct!');
      setShowNextButton(true);
      setPoints(points + 1);
    } else {
      setFeedback(`Incorrect. Correct answer: ${correctAnswer}`);
      setLives(lives - 1);
      setTimeout(fetchQuestion, 3000); // Wait for 3 seconds before fetching the next question
    }

    setUserAnswer(answer);
  };

  const handleNextQuestion = () => {
    fetchQuestion();
  };

  const handleRestart = () => {
    fetchQuestion();
    setDifficulty('easy');
    setUserAnswer(null);
    setFeedback('');
    setShowNextButton(false);
    setPoints(0);
    setLives(3);
  };

  return (
    <div className="main-container">
      <div className="question-container">
        <h1>Trivia Game</h1>
        <p className="question">Question: {question}</p>
        <div className="choices">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(choice)}
              disabled={buttonsDisabled} // Disable buttons based on state
            >
              {choice}
            </button>
          ))}
        </div>
        {feedback && (
          <p className={userAnswer === correctAnswer ? 'feedback success' : 'feedback'}>{feedback}</p>
        )}
        {showNextButton && (
          <div className="button-container">
            <button className="next" onClick={handleNextQuestion}>Next</button>
          </div>
        )}
        {!showNextButton && userAnswer !== null && lives === 0 && (
          <div className="button-container">
            <button className="restart" onClick={handleRestart}>Restart</button>
          </div>
        )}
      </div>
      <div className="settings-container">
        <h2>Game Settings</h2>
        <div className="setting">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="setting">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className="setting">
          <p>Lives: {lives}</p>
          <p>Points: {points}</p>
        </div>
      </div>
    </div>
  );
};

export default Trivia;
