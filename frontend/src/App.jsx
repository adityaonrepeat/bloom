import React from "react";
import ReduxProvider from "./components/provider/ReduxProvider";
import Match from "./page/Match";
import Home from "./page/Home";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginEnable from "./components/loginEnable";

const App = () => {
  return (
    <ReduxProvider>
      
      <Navbar />
      <LoginEnable />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
      </Routes>
      
    </ReduxProvider>
  );
};

export default App;