import React, { useEffect, useState } from 'react';
import axios from 'axios';
import he from 'he'; // Import the 'he' library for decoding HTML entities
import './App.css'; 

const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showNextButton, setShowNextButton] = useState(false); // Control visibility of "Next" button
  const [choices, setChoices] = useState([]); // Store multiple-choice options
  const [correctAnswer, setCorrectAnswer] = useState(''); // Store the correct answer

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(
        'https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple&category=9'
      );

      if (response.data.results.length > 0) {
        const fetchedQuestion = he.decode(response.data.results[0].question); // Decode HTML-encoded characters
        const fetchedChoices = response.data.results[0].incorrect_answers;
        const correct = response.data.results[0].correct_answer;

        // Shuffle the choices and include the correct answer
        const shuffledChoices = [...fetchedChoices, correct].sort(() => Math.random() - 0.5);

        setQuestion(fetchedQuestion);
        setChoices(shuffledChoices);
        setCorrectAnswer(correct);

        // Reset userAnswer and feedback when a new question is fetched
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
    fetchQuestion(); // Fetch the initial question when the component mounts
  }, []);

  const handleAnswer = (answer) => {
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setFeedback('Correct!');
      setShowNextButton(true); // Show the "Next" button when the answer is correct
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}.`); // Provide the correct answer
      setShowNextButton(false); // Hide the "Next" button for incorrect answers
    }

    setUserAnswer(answer);
  };

  const handleNextQuestion = () => {
    fetchQuestion(); // Fetch the next question
  };

  const handleRestart = () => {
    fetchQuestion(); // Fetch the initial question to restart the game
  };

  return (
    <div className="container">
      <h1>Trivia Game</h1>
      <p className="question">Question: {question}</p>
  
      <div className="choices">
        {choices.map((choice, index) => (
          <button key={index} onClick={() => handleAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
  
      {feedback && <p className={userAnswer === correctAnswer ? 'feedback success' : 'feedback'}>
        {feedback}
      </p>}
  
      {showNextButton && <div className="button-container">
        <button className="next" onClick={handleNextQuestion}>Next</button>
      </div>}
      {!showNextButton && userAnswer !== null && (
        <div className="button-container">
        <button className="restart" onClick={handleRestart}> Restart</button>
  </div>
)}
    </div>
  );
};

export default Trivia;
