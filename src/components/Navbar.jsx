import {
  Flag,
  Keyboard,
  Logout,
  ReplayOutlined,
  Speed,
} from "@mui/icons-material";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
const Navbar = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // const navigate = useNavigate();

  const handleback = () => {
    console.log("going back");
    window.location.back();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      props.setflag(false);
      // handleback();
      // navigate("/signup");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "lavender",
        justifyContent: "space-between",
        minHeight: "60px",
        alignItems: "center",
        padding: "0px 30px",
        fontFamily: "cursive",
      }}
    >
      <div
        style={{
          backgroundColor: "",
          display: "flex",
          alignItems: "center",
        }}
      >
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
        <Tooltip title="start">
          <IconButton onClick={(e) => window.location.reload()}>
            <Speed sx={{ color: "red", fontSize: "40px" }} />
          </IconButton>
        </Tooltip>
      </div>

      <Tooltip title="logout">
        <IconButton onClick={(e) => handleLogout()}>
          <Logout sx={{ color: "grey", fontSize: "40px" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Navbar;
