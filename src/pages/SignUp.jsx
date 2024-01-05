import { signInWithPopup } from "firebase/auth";
import React from "react";
import GoogleButton from "react-google-button";
import { auth, googleAuthProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import signup from "../assets/signup.png";
import login from "../assets/login.jpg";
import logo from "../assets/reactfirebase 1.png";
const SignUp = (props) => {
  // const navigate = useNavigate();

  const handleSignUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // console.log(result);

      localStorage.setItem("token", result.user.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      // navigate("/");
      props.setflag((e) => true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{
          position: "absolute",
          top: "-130px",
          left: "-70px",
          opacity: "0.7",
          display: "inline-block",
          animation: "spin 15s linear infinite",
        }}
      />
      <Box
        sx={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          marginTop: "40px",
          padding: "20px 0px",
          borderRadius: "10px",
          boxShadow: 1,
          zIndex: 1,
        }}
      >
        <Box>
          <Typography
            color="darkblue"
            fontFamily="cursive"
            variant="h4"
            component="span"
          >
            HowQuick
          </Typography>
          <Typography
            color="black"
            fontFamily="tahoma"
            variant="h4"
            component="span"
          >
            .
          </Typography>
          <Typography
            color="dodgerblue"
            fontFamily="cursive"
            variant="h4"
            component="span"
          >
            ru
          </Typography>
        </Box>

        <div
          style={{
            width: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "",
          }}
        >
          <img
            src={login}
            style={{
              width: "200px",
            }}
            alt=""
          />
          <Typography variant="p">
            Sign up effortlessly with
            <br></br>{" "}
            <a href="https://firebase.google.com/docs/auth/web/google-signin?hl=en&authuser=0">
              Google Authentication
            </a>
          </Typography>
        </div>
        <br />

        <GoogleButton onClick={handleSignUpWithGoogle} />
      </Box>

      <Box
        sx={{
          width: "450px",
          position: "absolute",
          top: "190px",
          right: "10px",
          backgroundColor: "",
          padding: "0px",
        }}
      >
        <Typography margin={0} variant="h1" color="grey" fontFamily="tahoma">
          Made with
        </Typography>
        <Typography margin={0} variant="h1" color="grey" fontFamily="tahoma">
          <span style={{ color: "dodgerblue" }}>React</span> &{" "}
        </Typography>
        <Typography margin={0} variant="h1" color="grey" fontFamily="tahoma">
          <span style={{ color: "orange" }}>Firebase</span>
        </Typography>
      </Box>
    </div>
  );
};

export default SignUp;
