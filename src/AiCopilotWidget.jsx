// src/AiCopilotWidget.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AiCopilotWidget({ articleText }) {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in animation once the component is mounted
    setIsVisible(true);
  }, []);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setShowResults(false);
    setUserAnswers({});
    setEmail('');
    setIsEmailSubmitted(false);
    setScore(0);

    try {
      const response = await axios.post('http://localhost:3001/api/generate-quiz', {
        articleText: articleText,
      });
      setQuiz(response.data.quiz);
    } catch (err) {
      setError('Failed to generate quiz. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log(`Email captured: ${email}`);

    try {
      await axios.post('http://localhost:3001/api/capture-lead', {
        email: email,
        score: score,
        totalQuestions: quiz.length,
        articleText: articleText,
      });
      console.log('Lead data successfully sent to backend.');
    } catch (err) {
      console.error('Failed to send lead data to the backend:', err);
    }

    setIsEmailSubmitted(true);
  };

  return (
    <div className={`widget-container ${isVisible ? 'fade-in' : ''}`}>
      <h3 className="font-bold text-lg text-slate-800 flex-shrink-0">Learning Copilot</h3>

      {!isLoading && !quiz && (
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600">Test your knowledge on this article!</p>
          <button
            onClick={handleGenerateQuiz}
            className="button-primary"
          >
            Generate a Mini-Quiz
          </button>
        </div>
      )}

      {isLoading && <div className="loader"></div>}

      {error && <p className="text-red-500">{error}</p>}

      {quiz && !showResults && (
        <>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex flex-col gap-4">
              {quiz.map((q, index) => (
                <div key={index} className="quiz-question">
                  <p className="font-semibold">{index + 1}. {q.question}</p>
                  <div className="flex flex-col gap-2 mt-2">
                    {q.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(index, option)}
                        className={`button-option ${userAnswers[index] === option ? 'selected' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleSubmitQuiz}
              className="button-submit"
            >
              Submit Quiz
            </button>
          </div>
        </>
      )}

      {quiz && showResults && !isEmailSubmitted && (
        <div className="flex-shrink-0">
          <h4 className="font-bold">Get Your Results!</h4>
          <p className="text-sm text-gray-600">Enter your email to see your score and get a free System Design cheatsheet.</p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-email"
              required
            />
            <button
              type="submit"
              className="button-submit"
            >
              Get My Results
            </button>
          </form>
        </div>
      )}


      {quiz && showResults && isEmailSubmitted && (
        <>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold">Your Score: {score} / {quiz.length}</h4>
              {quiz.map((q, index) => (
                <div key={index} className="quiz-question">
                  <p className="font-semibold">{q.question}</p>
                  <p className={`result ${
                    userAnswers[index] === q.correctAnswer
                    ? 'correct'
                    : 'incorrect'
                  }`}>
                    Your answer: {userAnswers[index] || "Not answered"}. <br/>
                    Correct answer: {q.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
           <div className="flex-shrink-0">
            <p className="text-sm text-center text-gray-600">A personalized email with more resources is on its way to you!</p>
            <button
              onClick={handleGenerateQuiz}
              className="button-secondary"
            >
              Try a New Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AiCopilotWidget;