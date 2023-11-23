import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProductForm = ({ open, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const { dispatch } = useAppContext();

  // Initial State
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    unitPrice: 0,
    unit: "",
    stock: 0,
  });

  // Validation state
  const [validation, setValidation] = useState({
    name: { error: false, helperText: "" },
    category: { error: false, helperText: "" },
    unit: { error: false, helperText: "" },
    unitPrice: { error: false, helperText: "" },
    stock: { error: false, helperText: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validate the form
    const formIsValid = validateForm();

    if (formIsValid) {
      try {
        // Make an HTTP POST request to create a new product
        const { data } = await axiosPrivate.post("/api/products", productData);

        // Dispatch an action to add the new product to the context state
        dispatch({
          type: "ADD_PRODUCT",
          payload: data,
        });

        // Close the modal
        handleClose();

        toast.success("Product added successfully", {
          autoClose: "2000",
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(`Error adding product: ${error.response.data.details}`, {
            autoClose: "2000",
            theme: theme.palette.mode === "dark" ? "dark" : "light",
          });
        } else {
          toast.error("Error adding product", {
            autoClose: "2000",
            theme: theme.palette.mode === "dark" ? "dark" : "light",
          });
        }
      }
    }
  };

  // Function to validate the form
  const validateForm = () => {
    const updatedValidation = { ...validation };
    let formIsValid = true;

    // Validate each field
    for (const field in productData) {
      if (!productData[field]) {
        updatedValidation[field] = {
          error: true,
          helperText: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        };
        formIsValid = false;
      } else {
        updatedValidation[field] = { error: false, helperText: "" };
      }
    }

    setValidation(updatedValidation);
    return formIsValid;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .css-1qxadfk-MuiPaper-root-MuiDialog-paper": {
          backgroundColor: colors.blueAccent[600],
        },
        "& .MuiFormControl-root": {
          my: "10px",
        },
      }}
    >
      <DialogTitle variant="h4">Add Product</DialogTitle>
      <DialogContent>
        {/* Form fields for Name, Category, Unit, Unit Price, and Stock */}
        <TextField
          label="Name"
          name="name"
          value={productData.name}
          onChange={handleChange}
          fullWidth
          error={validation.name.error}
          helperText={validation.name.helperText}
        />
        <TextField
          label="Category"
          name="category"
          value={productData.category}
          onChange={handleChange}
          fullWidth
          error={validation.category.error}
          helperText={validation.category.helperText}
        />
        <TextField
          label="Unit"
          name="unit"
          value={productData.unit}
          onChange={handleChange}
          fullWidth
          error={validation.unit.error}
          helperText={validation.unit.helperText}
        />
        <TextField
          label="Unit Price"
          name="unitPrice"
          value={productData.unitPrice}
          onChange={handleChange}
          fullWidth
          error={validation.unitPrice.error}
          helperText={validation.unitPrice.helperText}
        />
        <TextField
          label="Stock"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          fullWidth
          error={validation.stock.error}
          helperText={validation.stock.helperText}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
