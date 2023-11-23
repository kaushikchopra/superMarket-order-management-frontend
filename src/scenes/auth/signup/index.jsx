// Signup.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Link as MuiLink,
  Grid,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const Signup = () => {
  const navigate = useNavigate();

  // Initializing Values
  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  };

  // Handle input validation
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3)
      .max(25)
      .required("Please enter your First Name"),
    lastName: Yup.string()
      .min(1)
      .max(25)
      .required("Please enter your Last Name"),
    username: Yup.string().email().required("Please enter your email"),
    password: Yup.string()
      .min(6)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        "Please use at least one upper, one lower case characters, one special character and one number"
      )
      .required("Please enter your password"),
  });

  // Handle Signup
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post("/api/auth/signup", values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // console.log(response);

      if (response && response.data) {
        toast.success(response.data.status, {
          autoClose: "2000",
        });

        // Reset form values after submitting
        resetForm();

        setTimeout(() => {
          navigate("/login"); // Redirect to Login page
        }, 3000);
      }
    } catch (errors) {
      // console.error(errors);
      if (!errors?.response) {
        // Handle no server error (i.e.) server is not running or responding
        toast.error("No Server Response", {
          autoClose: "2000",
        });
      } else if (errors.response && errors.response.data) {
        // Handle other errors
        toast.error(errors.response.data.error, {
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
            width: "35vw",
          },
          "@media (min-width: 1280px)": {
            width: "25vw",
          },
        },
      }}
      component="main"
      maxWidth="xs"
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1F2A40",
        }}
      >
        <Typography variant="h3">Signup</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            type="text"
            variant="outlined"
            fullWidth
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
            sx={{ marginY: "16px", fontSize: "1.2rem" }}
          />
          <TextField
            label="Last Name"
            type="text"
            variant="outlined"
            fullWidth
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
            sx={{ marginBottom: "16px", fontSize: "1.2rem" }}
          />
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
            sx={{ marginBottom: "16px", fontSize: "1.2rem" }}
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ fontSize: "1rem", marginBottom: "16px" }}
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
                <span>Signing up...</span>
              </>
            ) : (
              "Register"
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
            <MuiLink component={Link} to="/login" variant="body2">
              Login
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

export default Signup;
