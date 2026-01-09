import React from "react";
import ReduxProvider from "./components/provider/ReduxProvider";
import Match from "./page/Match";
import Home from "./page/Home";
import { Routes, Route } from "react-router-dom";
import LoginEnable from "./components/loginEnable";
import Chat from "./page/Chat";
import Quiz from "./page/quiz";
import Result from "./page/Result";

const App = () => {
  return (
    <ReduxProvider>
      
      <LoginEnable />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/result" element={<Result />} />
      </Routes>
      
    </ReduxProvider>
  );
};

export default App;