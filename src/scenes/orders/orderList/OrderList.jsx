import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import { tokens } from "../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { useAppContext } from "../../../context/AppContext";
import { LineWave } from "react-loader-spinner";

const OrderList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { state } = useAppContext();
  const orders = state.orders;

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    return dateB - dateA;
  });

  // Select the latest 15 orders
  const recentOrders = sortedOrders.slice(0, 20);

  const columns = [
    {
      field: "orderNumber",
      headerName: "Order Number",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      minWidth: 130,
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
      field: "products",
      headerName: "Products",
      minWidth: 200,
      flex: 1,
      valueGetter: (params) =>
        params.row.products.map((product) => product.name).join(", "),
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
      renderCell: (params) => (
        <Typography>$ {params.row.totalAmount}</Typography>
      ),
    },
    { field: "deliveryStatus", headerName: "Status", minWidth: 150, flex: 1 },
  ];

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
        <Header title="ORDER LIST" subtitle="Recent Orders - 20 Nos Only" />
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
          rows={recentOrders}
          columns={columns}
          getRowId={(row) => row._id}
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default OrderList;
