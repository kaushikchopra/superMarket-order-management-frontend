import React from "react";
import { Link } from "react-router-dom";
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

const ForgotPassword = () => {

  // Initializing Values
  const initialValues = {
    email: "",
  };

  // Handle input validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Please enter an email address"),
  });

  // Handle Login
  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { email } = values;
      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });

      toast.success(response?.data?.status, {
        autoClose: "2000",
      }); // Success Message of Password reset email
    } catch (error) {
      if (error?.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;

        // display all validation errors to the user
        const errorMessages = validationErrors.map((error) => error.msg);

        setErrors(errorMessages.toString());
      } else {
        // Handle other error scenarios
        toast.error(error.response.data.error, {
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
        <Typography variant="h3">Forgot Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            sx={{ marginY: "16px", fontSize: "1.2rem" }}
          />

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
                <span>Sending link...</span>
              </>
            ) : (
              "Submit"
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
            <MuiLink component={Link} to="/signup" variant="body2">
              Sign up
            </MuiLink>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
