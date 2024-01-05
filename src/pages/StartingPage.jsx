// StartingPage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp";

const StartingPage = () => {
  // const navigate = useNavigate();
  const [flag, setflag] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setflag((e) => true);
  }, []);

  return (
    <div style={{ margin: "0px", padding: "0px" }}>
      {flag ? (
        <Home flag={flag} setflag={setflag} />
      ) : (
        <SignUp flag={flag} setflag={setflag} />
      )}
    </div>
  );
};

export default StartingPage;
