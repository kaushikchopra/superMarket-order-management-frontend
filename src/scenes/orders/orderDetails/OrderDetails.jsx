import { Link, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useAppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { LineWave } from "react-loader-spinner";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const {auth} = useAuth();
  const { state, dispatch } = useAppContext();
  const orders = state.orders;

  const axiosPrivate = useAxiosPrivate();
  const ClickableCell = styled("div")({
    cursor: "pointer",
    "&:hover": {
      backgroundColor: colors.blueAccent[700],
    },
  });

  const handleDeleteClick = (orderId) => {
    // Make an API call to delete the order by ID
    axiosPrivate
      .delete(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        toast.success("Order deleted successfully", {
          autoClose: "2000",
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });

        // Update the local state by removing the deleted row
        dispatch({ type: "DELETE_ORDER", payload: orderId });
      })
      .catch((error) => {
        // Handle error
        console.error("Error deleting order:", error);
        toast.error("Error deleting order. Please try again.");
      });
  };

  const columns = [
    {
      field: "orderNumber",
      headerName: "Order Number",
      minWidth: 150,
      flex: 1,
      // Add the onClick handler for the Order Number cell
      renderCell: (params) => (
        <ClickableCell
          onClick={() => handleOrderNumberClick(params.row.orderNumber)}
        >
          {params.row.orderNumber}
        </ClickableCell>
      ),
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      minWidth: 180,
      flex: 1,
      valueGetter: (params) => params.row.orderDate.split("T")[0],
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 200,
      flex: 1,
      cellClassName: "customer-column--cell",
      renderCell: (params) =>
        `${params.row.customer.firstName} ${params.row.customer.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) => params.row.customer.email,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 120,
      flex: 1,
      valueGetter: (params) => params.row.customer.phone,
    },
    {
      field: "totalAmount",
      headerName: "Total Price",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => `$ ${params.value.toFixed(2)}`,
    },
    { field: "deliveryStatus", headerName: "Status", minWidth: 150, flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="error"
          onClick={() => handleDeleteClick(params.row._id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Function to handle the click on Order Number
  const handleOrderNumberClick = (orderNumber) => {
    // Navigate to the separate page with the order details
    navigate(`/orders/${orderNumber}`);
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
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Header
          title="ORDER DETAILS"
          subtitle="Click on the ORDER NUMBER for detail summary"
        />
        <Button
          component={Link}
          to="/orders/add"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Add Order
        </Button>
      </Box>
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
        }}
      >
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default OrderDetails;
