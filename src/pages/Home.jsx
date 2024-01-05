import { signOut } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Table from "../components/Table";
import TablePagination from "../components/TablePagination";

import "../firebase"; // Add this line prevent firebase not loading error
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";

import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import {
  AppsSharp,
  Assessment,
  Bolt,
  Drafts,
  Equalizer,
  ExpandLess,
  ExpandMore,
  GppBad,
  Inbox,
  NetworkCheck,
  Numbers,
  Poll,
  ReplayOutlined,
  Send,
  StarBorder,
  Timer,
  Timer10,
  WrongLocationSharp,
} from "@mui/icons-material";

import cat from "../assets/peekingcat.png";
import cat2 from "../assets/pcat2.png";

const getCloud = () =>
  `hello bro how are you doing see good nice people love jump animal nope sometimes nothing great work help cat not ok suffer happy well river water sudden false kitty`
    .split(" ")
    .sort(() => (Math.random() > 0.5 ? 1 : -1));

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }

  if (active) {
    return <span className="active">{text} </span>;
  }

  return <span>{text} </span>;
}

Word = React.memo(Word);

const Home = (props) => {
  // typing test

  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);

  const [userInput, setUserInput] = useState("");

  const cloud = useRef(getCloud());

  const [activeWordIndex, setactiveWordIndex] = useState(0);

  const [correctWordArray, setcorrectWordArray] = useState([]);

  const [startCounting, setstartCounting] = useState(false);

  const [disable, setdisable] = useState(false);

  const [wrong, setwrong] = useState(0);

  const [speeed, setspeeed] = useState(0);

  const [show, setshow] = useState(false);

  // data
  const [array, setArray] = useState([]);
  let records = [];

  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input element when the component mounts
    inputRef.current.focus();
  }, []);

  function processInput(value) {
    setstartCounting(true);
    setshow(true);

    if (value.endsWith(" ")) {
      setactiveWordIndex((index) => index + 1);
      setUserInput("");

      // correct word
      setcorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        if (word !== cloud.current[activeWordIndex]) {
          setwrong((e) => e + 1);
        }
        return newResult;
      });

      if (activeWordIndex === cloud.current.length - 1) {
        setstartCounting(false);
        setUserInput("Yay! Test Completed...!");
        setdisable(true);
        console.log("calling the firebase functions.");
        fetchDataFromFirestore();
        handleNewSpeedAchieved();
        return;
      }
    } else {
      setUserInput(value);
    }
  }

  // Timer
  // const { correctWords, startCounting } = props;
  const [timeElapsed, settimeElapsed] = useState(0);

  useEffect(() => {
    const minutes = timeElapsed / 60;
    const temp = (
      (correctWordArray.filter(Boolean).length || 0) / minutes || 0
    ).toFixed(1);
    setspeeed((e) => temp);
  }, [timeElapsed]);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        settimeElapsed((oldtime) => oldtime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  // Tab press logic
  const handleTabKeyPress = (event) => {
    if (event.key === "Tab") {
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("keydown", handleTabKeyPress);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleTabKeyPress);
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  // firebase firestore

  const db = getFirestore();

  const saveDataToFirestore = async (data) => {
    const userDocRef = doc(db, "users", data.uid);

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const previousSpeed = parseFloat(userData.speed) || 0; // Convert speed to number, default to 0

        const currentSpeed = parseFloat(data.speed); // Convert current speed to number

        if (!isNaN(currentSpeed) && currentSpeed > previousSpeed) {
          await setDoc(userDocRef, {
            uid: data.uid,
            username: data.username,
            speed: data.speed,
            accuracy: data.accuracy,
            date: data.date,
            time: data.time,
          });
          fetchDataFromFirestore();
          console.log(data);
          alert("Document updated in Database.");
        } else {
          alert("Current speed is not greater than previous speed.");
        }
      } else {
        await setDoc(userDocRef, {
          uid: data.uid,
          username: data.username,
          speed: data.speed,
          accuracy: data.accuracy,
          date: data.date,
          time: data.time,
        });
        fetchDataFromFirestore();
        alert("User record does not exist.");
      }
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const fetchDataFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      // console.log("query snapshot : ", querySnapshot);
      const temporaryArr = [];
      querySnapshot.forEach((doc) => {
        temporaryArr.push(doc.data());
      });
      // console.log("temp array : ", temporaryArr);
      records = temporaryArr;
      setArray(records);
      // console.log(records);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewSpeedAchieved = () => {
    // Calculate the speed, date, time, and get the user ID

    // Example data (replace with actual data)
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const finalspeed = (
      (correctWordArray.filter(Boolean).length || 0) / minutes || 0
    ).toFixed(1);
    const acc = (((30 - wrong) * 100) / 30).toFixed(1);

    const userdata = {
      uid: user.uid,
      username: user.displayName,
      speed: speeed, // New speed achieved
      accuracy: acc,
      date: currentDate, // Date
      time: currentTime, // Time
    };
    // Save the user record if a new highest speed is achieved
    saveDataToFirestore(userdata);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "50px",
        backgroundColor: "lavender",
      }}
    >
      <Navbar flag={props.flag} setflag={props.setflag} />

      <div>
        <Box
          sx={{
            backgroundColor: "white",
            margin: "20px",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <p
            style={{
              fontSize: "xx-large",
              color: "grey",
            }}
          >
            {cloud.current.map((word, index) => {
              return (
                <Word
                  key={index}
                  text={word}
                  active={index === activeWordIndex}
                  correct={correctWordArray[index]}
                />
              );
            })}
          </p>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <img
              src={cat}
              style={{
                width: "100px",
                position: "absolute",
                top: "-90px",
                left: "20px",
                zIndex: 2,
              }}
            ></img>
            <List
              sx={{
                width: "300px",
                bgcolor: "background.paper",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h4">stats</Typography>
                    <Equalizer fontSize="large" />
                  </Box>
                </ListSubheader>
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <Numbers />
                </ListItemIcon>
                <ListItemText primary="Total words" />
                <Chip label="30" color="success" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <GppBad />
                </ListItemIcon>
                <ListItemText primary="Misspelled" />
                <Chip label={wrong} color="warning" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <Bolt />
                </ListItemIcon>
                <ListItemText primary="Accuracy" />
                <Chip
                  label={
                    show
                      ? (((30 - wrong) * 100) / 30).toFixed(1) + " %"
                      : 0 + " %"
                  }
                  color="primary"
                ></Chip>
              </ListItemButton>
            </List>
          </Box>

          <Box>
            <h4>START TYPING HERE</h4>

            <TextField
              id="outlined-required"
              label="Hurry Up...!"
              variant="outlined"
              // focused={true}
              inputRef={inputRef}
              disabled={disable}
              value={userInput}
              onChange={(e) => processInput(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                boxShadow: 1,
              }}
            />
            <br />
            <br />
            <Tooltip title="replay">
              <IconButton onClick={(e) => window.location.reload()}>
                <ReplayOutlined />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ position: "relative" }}>
            <img
              src={cat2}
              alt="kitty"
              style={{
                position: "absolute",
                width: "100px",
                rotate: "90deg",
                top: "20px",
                right: "-85px",
              }}
            />
            <List
              sx={{
                width: "300px",
                bgcolor: "background.paper",
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="h4">speed</Typography>
                    <Poll fontSize="large" />
                  </Box>
                </ListSubheader>
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <Timer />
                </ListItemIcon>
                <ListItemText primary="Time (seconds)" />
                <Chip label={timeElapsed} color="success" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <NetworkCheck />
                </ListItemIcon>
                <ListItemText primary="Words per Minute" />
                <Chip
                  // label={(
                  //   (correctWordArray.filter(Boolean).length || 0) / minutes ||
                  //   0
                  // ).toFixed(1)}
                  label={speeed}
                  color="primary"
                ></Chip>
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </div>

      <div style={{ width: "800px", margin: " 0px auto" }}>
        <Typography variant="h4">LeaderBoard</Typography>
        {/* <Table records={array} /> */}
        <TablePagination records={array} />
      </div>
    </div>
  );
};

export default Home;
