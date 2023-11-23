// AddOrder.jsx
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { useAppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import {
  calculateTotalAmount,
  generateOrderNumber,
} from "../../../utils/orderUtils";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";


const AddOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useAppContext();

  const productsData = state.products;

  // Handling the Place Order
  const handlePlaceOrder = async (values, actions) => {
    try {
      // Calculate total amount
      const totalAmount = calculateTotalAmount(values.products).toFixed(2);

      // Replace the product names with their corresponding _id
      const products = values.products.map((product) => {
        const matchingProduct = productsData.find(
          (p) => p.name === product.name
        );
        if (matchingProduct) {
          const { name, ...otherProps } = product;
          return { ...otherProps, product: matchingProduct._id };
        }
        return product;
      });

      // Update values object with totalAmount
      const updatedValues = { ...values, products, totalAmount };

      // Make an HTTP request to create or update the customer details in the database
      const customerResponse = await axiosPrivate.post(
        "/api/customers/",
        updatedValues.customer
      );

      dispatch({
        type: "ADD_CUSTOMER",
        payload: customerResponse.data,
      });

      const customerId = customerResponse.data._id;

      // Make an HTTP request to get the last order number
      let orderNumber;

      try {
        const orderNumberResponse = await axiosPrivate.get(
          "/api/orders/latestOrderNumber"
        );
        orderNumber = generateOrderNumber(
          orderNumberResponse.data.latestOrderNumber
        );
      } catch (orderNumberError) {
        orderNumber = generateOrderNumber();
      }

      // For adding order details to the database
      const orderData = {
        ...updatedValues,
        orderNumber,
        customer: customerId,
      };

      const dispatchData = {
        ...values,
        totalAmount,
        orderNumber,
      };

      // Make an HTTP request to create an order in the database
      // const orderResponse =
      await axiosPrivate.post("/api/orders/", orderData);
      // console.log("Order created:", orderResponse);

      // Adding order data to the local state
      dispatch({
        type: "ADD_ORDER",
        payload: dispatchData,
      });

      const updatedProductData = await axiosPrivate.get("/api/products/");
      dispatch({
        type: "SET_PRODUCTS",
        payload: updatedProductData.data,
      });

      // Reset the form to its initial values
      actions.resetForm({ values: initialValues });

      toast.success("Order has been placed", {
        autoClose: "2000",
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error(`Error adding product: ${error.response.data.details}`, {
          autoClose: "2000",
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });
      } else {
        toast.error("Error in placing the order", {
          autoClose: "2000",
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });
      }
    }
  };

  return (
    <Box m="20px">
      <Formik
        onSubmit={handlePlaceOrder}
        initialValues={initialValues}
        validationSchema={orderSchema}
      >
        {({
          values,
          setValues,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* Customer Information Section */}
            <Typography variant="h3" my={2}>
              Customer Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.firstName}
                  name="customer.firstName"
                  error={
                    !!touched.customer?.firstName &&
                    !!errors.customer?.firstName
                  }
                  helperText={
                    touched.customer?.firstName && errors.customer?.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.lastName}
                  name="customer.lastName"
                  error={
                    !!touched.customer?.lastName && !!errors.customer?.lastName
                  }
                  helperText={
                    touched.customer?.lastName && errors.customer?.lastName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.email}
                  name="customer.email"
                  error={!!touched.customer?.email && !!errors.customer?.email}
                  helperText={touched.customer?.email && errors.customer?.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.phone}
                  name="customer.phone"
                  error={!!touched.customer?.phone && !!errors.customer?.phone}
                  helperText={touched.customer?.phone && errors.customer?.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Street"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.address.street}
                  name="customer.address.street"
                  error={
                    !!touched.customer?.address?.street &&
                    !!errors.customer?.address?.street
                  }
                  helperText={
                    touched.customer?.address?.street &&
                    errors.customer?.address?.street
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="City"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.address.city}
                  name="customer.address.city"
                  error={
                    !!touched.customer?.address?.city &&
                    !!errors.customer?.address?.city
                  }
                  helperText={
                    touched.customer?.address?.city &&
                    errors.customer?.address?.city
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="State"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.address.state}
                  name="customer.address.state"
                  error={
                    !!touched.customer?.address?.state &&
                    !!errors.customer?.address?.state
                  }
                  helperText={
                    touched.customer?.address?.state &&
                    errors.customer?.address?.state
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Country"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.address.country}
                  name="customer.address.country"
                  error={
                    !!touched.customer?.address?.country &&
                    !!errors.customer?.address?.country
                  }
                  helperText={
                    touched.customer?.address?.country &&
                    errors.customer?.address?.country
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Zip Code"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.customer.address.zipCode}
                  name="customer.address.zipCode"
                  error={
                    !!touched.customer?.address?.zipCode &&
                    !!errors.customer?.address?.zipCode
                  }
                  helperText={
                    touched.customer?.address?.zipCode &&
                    errors.customer?.address?.zipCode
                  }
                />
              </Grid>
            </Grid>

            {/* Product Information Section */}
            <Typography variant="h3" my={2}>
              Product Information
            </Typography>
            {values.products.map((product, index) => (
              <Grid container sx={{ mb: "20px" }} spacing={2} key={index}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={productsData}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    fullWidth
                    value={product}
                    onChange={(event, selectedProduct) => {
                      if (selectedProduct) {
                        const updatedProducts = [...values.products];
                        updatedProducts[index] = {
                          ...updatedProducts[index],
                          name: selectedProduct.name,
                          quantity: 1, // Initialize quantity to 1
                          unit: selectedProduct.unit || "", // Adding the unit according to the product
                          unitPrice: selectedProduct.unitPrice || 0, // Ensure a default value for unitPrice
                          totalPrice: selectedProduct.unitPrice || 0, // Initialize totalPrice
                        };

                        setValues({
                          ...values,
                          products: updatedProducts,
                        });
                      } else {
                        // Handle the case when the user clears the selection (newValue is null)
                        const updatedProducts = [...values.products];
                        updatedProducts[index] = {
                          name: "", // Reset the name to an empty string
                          quantity: 1, // Initialize quantity to 1
                          unit: "", // Reset the unit of the product to an empty string
                          unitPrice: 0, // Reset unitPrice to 0
                          totalPrice: 0, // Reset totalPrice to 0
                        };
                      }
                    }}
                    getOptionDisabled={(option) => option.stock === 0}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product"
                        variant="filled"
                        error={
                          productsData.find((p) => p.name === product.name)
                            ?.stock === 0 &&
                          !!touched.products?.[index]?.quantity
                        }
                        helperText={
                          productsData.find((p) => p.name === product.name)
                            ?.stock === 0
                            ? "This product is out of stock and cannot be added"
                            : touched.products?.[index]?.quantity &&
                              errors.products?.[index]?.quantity
                        }
                        sx={{
                          "& .MuiFormHelperText-root": {
                            color:
                              productsData.find((p) => p.name === product.name)
                                ?.stock === 0
                                ? theme.palette.error.main
                                : undefined,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="Quantity"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      const updatedProducts = [...values.products];
                      updatedProducts[index] = {
                        ...updatedProducts[index],
                        quantity: parseInt(event.target.value, 10), // Parse the quantity as an integer
                        totalPrice:
                          parseInt(event.target.value, 10) * product.unitPrice, // Update totalPrice based on the new quantity
                      };

                      setValues({
                        ...values,
                        products: updatedProducts,
                      });
                    }}
                    value={product.quantity}
                    name={`products[${index}].quantity`}
                    error={
                      !!touched.products?.[index]?.quantity &&
                      !!errors.products?.[index]?.quantity
                    }
                    helperText={
                      touched.products?.[index]?.quantity &&
                      errors.products?.[index]?.quantity
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h5">
                    Unit Price:{" "}
                    <span style={{ color: colors.greenAccent[300] }}>
                      {`$ ${product.unitPrice.toFixed(2)}`} per {product.unit}
                    </span>
                  </Typography>
                  <TextField
                    type="hidden"
                    name={`products[${index}].unitPrice`}
                    value={product.unitPrice}
                    sx={{ display: "none" }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h5">
                    Stock:{" "}
                    <span style={{ color: colors.greenAccent[300] }}>
                      {`${
                        productsData.find((p) => p.name === product.name)
                          ?.stock || 0
                      }`}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h5">
                    Total Price:{" "}
                    <span style={{ color: colors.greenAccent[300] }}>
                      {`$ ${(product.quantity * product.unitPrice).toFixed(2)}`}
                    </span>
                  </Typography>
                  <TextField
                    type="hidden"
                    name={`products[${index}].totalPrice`}
                    value={product.quantity * product.unitPrice}
                    sx={{ display: "none" }}
                  />
                </Grid>

                {/* Remove Product Button */}
                <Grid item xs={12} sm={1}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const updatedProducts = [...values.products];
                      updatedProducts.splice(index, 1);
                      setValues({
                        ...values,
                        products: updatedProducts,
                      });
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            {/* Add Product Button */}
            <Button
              type="button"
              variant="outlined"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
              }}
              onClick={() => {
                setValues({
                  ...values,
                  products: [
                    ...values.products,
                    { name: "", quantity: 0, unitPrice: 0 },
                  ],
                });
              }}
            >
              Add Product
            </Button>

            {/* Total Price Section */}
            <Box display="flex" alignItems="center">
              <Typography variant="h3" my={2}>
                Total Amount:{" "}
                <span style={{ color: colors.greenAccent[300] }}>
                  {`$ ${calculateTotalAmount(values.products).toFixed(2)}`}
                </span>
              </Typography>
            </Box>

            {/* Payment Method */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  label="Payment Method"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.paymentMethod}
                  name="paymentMethod"
                  error={!!touched.paymentMethod && !!errors.paymentMethod}
                  helperText={touched.paymentMethod && errors.paymentMethod}
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </TextField>
              </Grid>

              {/* Delivery Status */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  label="Delivery Status"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.deliveryStatus}
                  name="deliveryStatus"
                  error={!!touched.deliveryStatus && !!errors.deliveryStatus}
                  helperText={touched.deliveryStatus && errors.deliveryStatus}
                >
                  <MenuItem value="In-Store Pickup">In-Store Pickup</MenuItem>
                  <MenuItem value="Home Delivery">Home Delivery</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="outlined"
              sx={{
                mt: "20px",
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
              }}
            >
              Place Order
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOrder;

// Initializing the values of the form
const initialValues = {
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  },
  products: [
    { name: "", quantity: 0, unit: "", unitPrice: 0, totalPrice: "0.00" },
  ],
  paymentMethod: "",
  deliveryStatus: "",
};

// Validation Schema
const orderSchema = Yup.object({
  customer: Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.object({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("ZIP Code is required"),
      country: Yup.string().required("Country is required"),
    }),
  }),
  products: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Product is required"),
      quantity: Yup.number()
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      unit: Yup.string(),
      unitPrice: Yup.number(),
      totalPrice: Yup.number(),
    })
  ),
  paymentMethod: Yup.string().required("Select a Payment Method"),
  deliveryStatus: Yup.string().required("Select a Delivery Status"),
});
