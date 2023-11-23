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
    }}>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Paper  sx={{
          padding: (theme) => theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Loading is in progress...
          </Typography>
          <CircularProgress sx={{ marginBottom: (theme) => theme.spacing(2) }} />
        </Paper>
      ) : (
        <Outlet />
      )}
    </Box>
  );
};

export default PersistLogin;
