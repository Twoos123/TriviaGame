import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Trivia = () => {
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState(null); // Store user's answer (true or false)
  const [feedback, setFeedback] = useState(''); // Display success or failure message

  useEffect(() => {
    // Function to fetch a question from the API
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean&category=9'
        );

        if (response.data.results.length > 0) {
          const fetchedQuestion = response.data.results[0].question;
          setQuestion(fetchedQuestion);
        } else {
          console.log('No questions found.');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    // Call the fetchQuestion function when the component mounts
    fetchQuestion();
  }, []);

  // Function to handle user's answer
  const handleAnswer = (answer) => {
    // Check if the user's answer is correct
    const isCorrect = answer === 'true'; // You may need to adjust this based on the API response format

    // Provide feedback to the user
    if (isCorrect) {
      setFeedback('Correct!'); // Display success message
    } else {
      setFeedback('Incorrect!'); // Display failure message
    }

    // Store the user's answer
    setUserAnswer(answer);
  };

  return (
    <div>
      <h1>Trivia Game</h1>
      <p>Question: {question}</p>

      {/* Display answer options */}
      <div>
        <button onClick={() => handleAnswer('true')}>True</button>
        <button onClick={() => handleAnswer('false')}>False</button>
      </div>

      {/* Display feedback */}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default Trivia;
