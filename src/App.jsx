// src/App.jsx
import React from 'react';
import AiCopilotWidget from './AiCopilotWidget';

// This is our mock blog post text. We'll pass this to our widget.
const MOCK_ARTICLE_TEXT = `System design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. One of the most important non-functional requirements is scalability. Scalability is the system's ability to handle a growing amount of work by adding resources. A system can be scaled vertically (adding more power to an existing machine) or horizontally (adding more machines to the pool of resources). Horizontal scaling is often preferred for web applications due to its flexibility and fault tolerance.`;

function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto p-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">A Beginner's Guide to System Design</h1>
        <p className="text-gray-500 mb-8">Published on August 12, 2025</p>

        <div className="prose lg:prose-xl">
          <p>{MOCK_ARTICLE_TEXT}</p>
          <p>Understanding these fundamental concepts is the first step toward designing robust and efficient applications that can grow with user demand.</p>
        </div>
      </div>

      {/* Our AI Copilot Widget will live here */}
      <AiCopilotWidget articleText={MOCK_ARTICLE_TEXT} />
    </div>
  );
}

export default App;