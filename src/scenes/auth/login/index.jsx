// Login.js
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Link as MuiLink,
  Grid,
  Box,
} from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  // Initializing Values
  const initialValues = {
    username: "",
    password: "",
  };

  // Handle input validation
  const validationSchema = Yup.object({
    username: Yup.string().required("Please enter an email"),
    password: Yup.string().required("Please enter a password"),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Handle Login
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/api/auth/login", values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response?.data) {
        const { username } = values;
        const accessToken = response?.data?.accessToken;

        setAuth({ username, accessToken });

        // Redirect to the page from where the user came
        navigate(from, { replace: true });
      }
    } catch (errors) {
      // console.error("Error:", errors);
      if (!errors?.response) {
        // Handle no server error (i.e.) server is not running or responding
        toast.error("No Server Response", {
          autoClose: "2000",
        });
      } else if (errors?.response?.data) {
        // Set formik errors based on server response
        toast.error(errors.response.data.error, {
          autoClose: "2000",
        });
      } else {
        toast.error("Login failed", {
          autoClose: "2000",
        });
      }
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema,
    onSubmit,
  });

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
        <Typography variant="h3">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="email"
            variant="outlined"
            fullWidth
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
            sx={{ marginY: "16px", fontSize: "1.2rem" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            sx={{ marginBottom: "16px", fontSize: "1.2rem" }}
          />
          <Box sx={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist" style={{ marginRight: "8px" }}>
              {" "}
              Trust this device
            </label>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              fontSize: "1rem",
              marginBottom: "16px",
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
                <span>Logging In...</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{
            "& .MuiLink-underlineAlways": {
              fontSize: "1rem",
              color: "white",
              textDecoration: "none",
            },
            "& .MuiLink-underlineAlways:hover": {
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "5px",
              padding: "2px",
            },
          }}
        >
          <Grid item>
            <MuiLink component={Link} to="/signup" variant="body2">
              Sign Up
            </MuiLink>
          </Grid>

          <Grid item>
            <MuiLink component={Link} to="/forgot-password" variant="body2">
              Forgot Password
            </MuiLink>
          </Grid>

          <Grid item>
            <MuiLink component={Link} to="/resend-activation" variant="body2">
              Resend Activation
            </MuiLink>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
