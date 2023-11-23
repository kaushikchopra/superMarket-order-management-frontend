// Inventory.js
import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import ProductForm from "../../components/ProductForm";
import { useAppContext } from "../../context/AppContext";
import { LineWave } from "react-loader-spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function EditToolbar(props) {
  const { onAddProductClick } = props;

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddProductClick}
      >
        Add Product
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Inventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useAppContext();

  const products = state.products;

  const [rowModesModel, setRowModesModel] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleAddProductClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    // Exit edit mode
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    try {
      // Make an HTTP DELETE request to delete the product
      await axiosPrivate.delete(`/api/products/${id}`);

      // Dispatch an action to remove the deleted product from the context state
      dispatch({
        type: "DELETE_PRODUCT",
        payload: id,
      });

      toast.success("Product deleted successfully");
    } catch (error) {
      // Handle the error (e.g., show an error message to the user)
      console.error("Error deleting product:", error);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow) => {
    // Make an HTTP request to update the Product details
    try {
      const response = await axiosPrivate.put(`/api/products/${newRow._id}`, newRow);

      if (response.status === 200) {
        toast.success("Product updated successfully!", {
          autoClose: 2000,
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });

        // Dispatch an action to update the product in the context state
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: newRow,
        });
        return newRow;
      }
    } catch (error) {
      toast.error("Product updation failed", {
        autoClose: "2000",
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      });
      console.error("Update Product Error", error.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "name",
      headerName: "Product",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "unitPrice",
      headerName: "Unit Price",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const { id } = params;

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: colors.greenAccent[400],
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              sx={{ color: colors.redAccent[500] }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            sx={{
              color: colors.greenAccent[400],
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{ color: colors.redAccent[500] }}
          />,
        ];
      },
    },
  ];

  const getRowClassName = (params) => {
    // Check if the stock is zero (out of stock)
    const isOutOfStock = params.row.stock === 0;

    // Apply a CSS class conditionally based on the stock status
    return isOutOfStock ? "out-of-stock-row" : "";
  };

  if (state.loading) {
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

  return (
    <Box m="20px">
      <Header
        title="INVENTORY"
        subtitle="Effortless product management for streamlined operations"
      />

      <ProductForm open={openModal} handleClose={handleCloseModal} />
      <Box
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .customer-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-cell--editing": {
            backgroundColor: `${colors.greenAccent[600]} !important`,
          },
          "& .out-of-stock-row": {
            color: colors.redAccent[500],
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row._id}
          editMode="row"
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 20, 30]}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { onAddProductClick: handleAddProductClick },
          }}
          disableRowSelectionOnClick
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          getRowClassName={getRowClassName}
        />
      </Box>
    </Box>
  );
};

export default Inventory;
