import React from 'react';
import Chatbot from './chatbotArea/ChatBotArea'
import './App.css';

function App({ settings }) {
  console.log(settings)
  return (
    <div className="App">
      <Chatbot userId={parseInt(settings.user)} modelId={parseInt(settings.model)}/>
    </div>
  );
}

export default App;
