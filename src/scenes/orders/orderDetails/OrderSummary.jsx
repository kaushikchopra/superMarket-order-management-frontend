import React, { useEffect, useState } from "react";
import { Typography, Divider, Box, Grid, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { LineWave } from "react-loader-spinner";
import { toast } from "react-toastify";

const OrderSummary = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [orderData, setOrderData] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const { orderNum } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosPrivate.get(`/api/orders/${orderNum}`);
        setOrderData(data);
      } catch (error) {
        toast.error("Error fetching order:", {
          autoClose: "2000",
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });
      }
    };
    fetchOrder();
    // eslint-disable-next-line
  }, [orderNum]);

  if (!orderData) {
    return (
      <Box
        m="20px"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <LineWave
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          firstLineColor=""
          middleLineColor=""
          lastLineColor=""
        />
        <span>Loading...</span>
      </Box>
    );
  }

  const {
    orderNumber,
    orderDate,
    customer,
    products,
    totalAmount,
    paymentMethod,
    deliveryStatus,
  } = orderData;

  return (
    <Box
      m="20px"
      sx={{
        "& .sub-heading": {
          fontWeight: "bold",
        },
        "& .sub-heading-data": {
          display: "block",
          mt: "5px",
        },
      }}
    >
      <Header title="ORDER SUMMARY" subtitle={`Order Number: ${orderNumber}`} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Order Date:</span>
                <span className="sub-heading-data">
                  {new Date(orderDate).toLocaleString()}
                </span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Customer:</span>
                <span className="sub-heading-data">
                  {customer.firstName} {customer.lastName}
                </span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Email:</span>{" "}
                <span className="sub-heading-data">{customer.email}</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Contact:</span>{" "}
                <span className="sub-heading-data">{customer.phone}</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Address:</span>
                <span className="sub-heading-data">
                  {customer.address.street} {customer.address.city}{" "}
                </span>
                <span style={{ display: "block" }}>
                  {customer.address.state} - {customer.address.zipCode}{" "}
                </span>
                {customer.address.country}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Vertically dividing line */}
        {!isSmallScreen && (
          <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
        )}

        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Total Amount:</span>{" "}
                <span
                  className="sub-heading-data"
                  style={{ color: colors.greenAccent[300] }}
                >
                  ${totalAmount}
                </span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Payment Method:</span>{" "}
                <span className="sub-heading-data">{paymentMethod}</span>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                <span className="sub-heading">Status:</span>
                <span className="sub-heading-data">{deliveryStatus}</span>
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Horizontally dividing line */}
        {!isSmallScreen && (
          <Grid item xs={12}>
            <Divider flexItem />
          </Grid>
        )}

        {/* Products */}
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Products:
            </Typography>
          </Box>
          {/* Each Product Detail */}
          {products.map((product, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6} mt={2}>
                <Box>
                  <Typography variant="h5">
                    {product.quantity} x{" "}
                    <span style={{ fontWeight: "bold" }}>{product.name}</span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "14px",
                        color: colors.greenAccent[300],
                      }}
                    >
                      ${product.unitPrice} per {product.unit}
                    </span>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} mt={2}>
                <Box>
                  <Typography variant="h5">
                    $
                    {(product.quantity * parseFloat(product.unitPrice)).toFixed(
                      2
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSummary;
