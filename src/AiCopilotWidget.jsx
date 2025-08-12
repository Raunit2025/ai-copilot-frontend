// src/AiCopilotWidget.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AiCopilotWidget({ articleText }) {
  // State variables to manage the widget's behavior
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Function to call our backend API
  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null); // Reset previous quiz
    setShowResults(false);
    setUserAnswers({});

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
    setShowResults(true);
  };

  // --- Render Logic ---
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-2xl rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
      <h3 className="font-bold text-lg text-slate-800">Learning Copilot</h3>
      
      {/* Initial State: Show Generate Button */}
      {!isLoading && !quiz && (
        <>
          <p className="text-sm text-gray-600">Test your knowledge on this article!</p>
          <button
            onClick={handleGenerateQuiz}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate a Mini-Quiz
          </button>
        </>
      )}

      {/* Loading State */}
      {isLoading && <p className="text-gray-500">Generating your quiz...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Quiz Display State */}
      {quiz && !showResults && (
        <div className="flex flex-col gap-4">
          {quiz.map((q, index) => (
            <div key={index}>
              <p className="font-semibold">{index + 1}. {q.question}</p>
              <div className="flex flex-col gap-2 mt-2">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`text-left p-2 rounded-lg border ${userAnswers[index] === option ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Show Results
          </button>
        </div>
      )}

      {/* Results Display State */}
      {quiz && showResults && (
        <div className="flex flex-col gap-4">
          <h4 className="font-bold">Your Results:</h4>
          {quiz.map((q, index) => (
            <div key={index}>
              <p className="font-semibold">{q.question}</p>
              <p className={`p-2 rounded mt-1 ${
                userAnswers[index] === q.correctAnswer 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
              }`}>
                Your answer: {userAnswers[index] || "Not answered"}. <br/>
                Correct answer: {q.correctAnswer}
              </p>
            </div>
          ))}
           <button
            onClick={handleGenerateQuiz}
            className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors mt-2"
          >
            Try a New Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default AiCopilotWidget;