// Login.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  // Initializing Values
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  // Handle input validation
  const validationSchema = Yup.object({
    newPassword: Yup.string().required("Please enter a password"),
    confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match").required("Please enter a password"),
  });

  // Handle Login
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        `/api/auth/reset-password/${token}`,
        values
      );

      toast.success(response.data.status, {
        autoClose: "2000",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;

        // display all validation errors to the user
        validationErrors.map((error) =>
          toast.error(error.msg, { autoClose: "2000" })
        );
      } else {
        // Handle other error scenarios
        toast.error(error.response.data.error, {
          autoClose: "2000"
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
        <Typography variant="h3">Reset Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.newPassword && Boolean(errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
            sx={{ marginY: "16px", fontSize: "1.2rem" }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
            sx={{ marginBottom: "16px", fontSize: "1.2rem" }}
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
                <span>Resetting Password...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
