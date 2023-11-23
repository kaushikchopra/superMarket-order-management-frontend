// Customers.js
import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function EditToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Customers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { state, dispatch } = useAppContext();

  const customers = state.customers;

  const [rowModesModel, setRowModesModel] = useState({});

  const axiosPrivate = useAxiosPrivate();

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
      await axiosPrivate.delete(`/api/customers/${id}`);

      // Dispatch an action to remove the deleted product from the context state
      dispatch({
        type: "DELETE_CUSTOMER",
        payload: id,
      });

      toast.success("Customer data deleted successfully");
    } catch (error) {
      // Handle the error (e.g., show an error message to the user)
      console.error("Error deleting customer data:", error);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (updatedRow, originalRow) => {
    // Make an HTTP request to update the Product details
    // console.log(updatedRow, originalRow);
    try {
      const response = await axiosPrivate.put(
        `/api/customers/${updatedRow._id}`,
        updatedRow
      );

      if (response.status === 200) {
        toast.success("Cusomter data updated successfully!", {
          autoClose: 2000,
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });

        // Dispatch an action to update the product in the context state
        dispatch({
          type: "UPDATE_CUSTOMER",
          payload: updatedRow,
        });
        return updatedRow;
      }
    } catch (error) {
      toast.error("Customer data updation failed", {
        autoClose: "2000",
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      });
      console.error("Update Customer Error", error.message);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 140,
      flex: 1,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 210,
      flex: 1,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Contact",
      minWidth: 120,
      flex: 1,
      editable: true,
    },
    {
      field: "address.street",
      headerName: "Street",
      minWidth: 120,
      flex: 1,
      editable: true,
      valueGetter: getSubField,
      valueSetter: setSubField("street"),
    },
    {
      field: "address.city",
      headerName: "City",
      minWidth: 120,
      flex: 1,
      editable: true,
      valueGetter: getSubField,
      valueSetter: setSubField("city"),
    },
    {
      field: "address.state",
      headerName: "State",
      minWidth: 120,
      flex: 1,
      editable: true,
      valueGetter: getSubField,
      valueSetter: setSubField("state"),
    },
    {
      field: "address.country",
      headerName: "Country",
      minWidth: 120,
      flex: 1,
      editable: true,
      valueGetter: getSubField,
      valueSetter: setSubField("country"),
    },
    {
      field: "address.zipCode",
      headerName: "Zip Code",
      minWidth: 120,
      flex: 1,
      editable: true,
      valueGetter: getSubField,
      valueSetter: setSubField("zipCode"),
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

  return (
    <Box m="20px">
      <Header title="CUSTOMERS" subtitle="Customer Details" />

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
          rows={customers}
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
          disableRowSelectionOnClick
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={(updatedRow, originalRow) =>
            processRowUpdate(updatedRow, originalRow)
          }
        />
      </Box>
    </Box>
  );
};

export default Customers;

function setSubField(subFieldName) {
  // The setSubField function updates a nested field with a new value
  return (params) => {
    const field = { ...params.row.address };
    field[subFieldName] = params.value;
    return { ...params.row, address: field };
  };
}

function getSubField(params) {
  // The getSubField function extracts the value of a nested field
  const [fieldName, subFieldName] = params?.field?.toString().split(".");
  const field = params?.row[fieldName];
  return field ? field[subFieldName] : null;
}
