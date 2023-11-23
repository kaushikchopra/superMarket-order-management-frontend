import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw"
    }}>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Paper  sx={{
          padding: (theme) => theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1F2A40",
        }}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Loading is in progress...
          </Typography>
          <CircularProgress sx={{ marginBottom: (theme) => theme.spacing(2), color: "white" }} />
        </Paper>
      ) : (
        <Outlet />
      )}
    </Box>
  );
};

export default PersistLogin;
