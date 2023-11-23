// Login.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Paper, Typography, Box } from "@mui/material";
import axios from "../../../api/axios";

const Login = () => {
  const { token } = useParams();
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.patch(`/api/auth/activation/${token}`);

        if (response.status === 200) {
          const data = response.data;
          // console.error("data:", data);
          setMessage(data.message); // Set the activation status message
        }
      } catch (error) {
        // console.error(error);
        if (error.response.status === 400) {
          const errorData = error.response.data;
          // console.error("errorData", errorData);
          setMessage(errorData.message);
        } else {
          setMessage("An error occurred during activation.");
        }
      }
    };

    activateAccount();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "@media (min-width: 821px)": {
          flexDirection: "row",
        },
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        background: "linear-gradient( #141B2D, #3c5486, #141B2D)",
        "& .MuiInputLabel-root.Mui-focused": {
          color: "white",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff",
        },
        "& .css-wxl1jl-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#fff !important",
          },
        "& .MuiButtonBase-root": {
          backgroundColor: "white",
          color: "black",
        },
        "& .MuiButtonBase-root:hover": {
          backgroundColor: "#c0c0c0",
          color: "black",
        },
        "& .MuiPaper-root": {
          "@media (max-width: 600px)": {
            width: "80vw",
          },
          "@media (min-width: 600px)": {
            width: "50vw",
          },
          "@media (min-width: 960px)": {
            width: "30vw",
          },
          "@media (min-width: 1280px)": {
            width: "25vw",
          },
        },
      }}
      component="main"
    >
      <Typography
        variant="h2"
        sx={{
          marginBottom: "30px",
          color: "#fff",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          fontSize: "2rem",
          fontWeight: "bold",
          "@media (min-width: 600px)": {
            fontSize: "2.5rem",
          },
          "@media (min-width: 768px)": {
            fontSize: "3rem",
          },
          "@media (min-width: 960px)": {
            padding: "25px 25px 25px 0",
            fontSize: "1.75rem",
          },
          "@media (min-width: 1028px)": {
            padding: "25px 25px 25px 0",
            fontSize: "2rem",
          },
        }}
      >
        Welcome to{" "}
        <span
          style={{
            color: "#FFD700",
          }}
        >
          Supermarket Order Management
        </span>
        <span
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "1.2rem",
            display: "block",
            lineHeight: "1.5",
          }}
        >
          Streamline supermarket billing for managers{" "}
          <span style={{ display: "block" }}>
            with our effortless Order Management App
          </span>{" "}
          – <span>simplifying the process with a click.</span>
        </span>
      </Typography>
      <Paper
        variant="outlined"
        style={{
          padding: "20px",
          marginBottom: "50px",
          display: "flex",
          order: 2,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1F2A40",
          "@media (minWidth: 769px)": {
            width: "50%",
          },
        }}
      >
        <Typography variant="h3" style={{ margin: "20px 0" }}>
          Account Activation
        </Typography>
        <Typography
          variant="h4"
          style={{
            margin: "10px 0",
            textAlign: "center",
            color:
              message === "User is already activated" ||
              message === "Account activated successfully"
                ? "#4CAF50"
                : "#F44336",
          }}
        >
          {" "}
          {message}
        </Typography>
        <Typography
          variant="h4"
          style={{
            margin: "20px 0",
            display: message
              ? message === "User is already activated" ||
                message === "Account activated successfully"
                ? "block"
                : "none"
              : "none",
          }}
        >
          Click here to login.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{
            fontSize: "1rem",
            marginBottom: "16px",
            display: message
              ? message === "User is already activated" ||
                message === "Account activated successfully"
                ? "block"
                : "none"
              : "none",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
