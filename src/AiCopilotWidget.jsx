import React, { useState } from 'react';
import axios from 'axios';

function AiCopilotWidget({ articleText }) {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null); 
    setShowResults(false);
    setUserAnswers({});
    setEmail('');
    setIsEmailSubmitted(false);

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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log(`Email captured: ${email}`);
    
    try {
      await axios.post('http://localhost:3001/api/capture-lead', {
        email: email,
        quizResults: userAnswers, 
        articleText: articleText, 
      });
      console.log('Lead data successfully sent to backend.');
    } catch (err) {
      console.error('Failed to send lead data to the backend:', err);
    }

    setIsEmailSubmitted(true); 
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white shadow-2xl rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
      <h3 className="font-bold text-lg text-slate-800 flex-shrink-0">Learning Copilot</h3>

      {!isLoading && !quiz && (
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600">Test your knowledge on this article!</p>
          <button
            onClick={handleGenerateQuiz}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate a Mini-Quiz
          </button>
        </div>
      )}

      {isLoading && <p className="text-gray-500">Generating your quiz...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {quiz && !showResults && (
        <>
          <div className="flex-grow overflow-y-auto pr-2">
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
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
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
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
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
            </div>
          </div>
           <div className="flex-shrink-0">
            <button
              onClick={handleGenerateQuiz}
              className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors mt-2"
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