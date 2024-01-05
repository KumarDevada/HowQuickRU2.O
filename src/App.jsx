import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import StartingPage from "./pages/StartingPage";

function App() {
  return (
    <div className="App">
      {/* <Outlet /> */}
      <StartingPage />
    </div>
  );
}

export default App;
