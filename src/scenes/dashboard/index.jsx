import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useAppContext } from "../../context/AppContext";// eslint-disable-next-line
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-moment";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { state } = useAppContext();
  const orders = state.orders;
  const totalOrders = orders.length;
  const sortedOrders = [...orders]
    .sort((a, b) =>
      b.orderNumber.localeCompare(a.orderNumber, undefined, { numeric: true })
    )
    .slice(0, 5);

  const products = state.products;
  const lowStockItems = products.filter(
    (product) => product.stock <= 15
  ).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
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
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalOrders}
            subtitle="Total Orders"
            icon={
              <AddShoppingCartOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={products.length}
            subtitle="Total Products"
            icon={
              <Inventory2OutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={lowStockItems}
            subtitle="Low Stock Items"
            icon={
              <ProductionQuantityLimitsOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={outOfStock}
            subtitle="Out of Stocks Items"
            icon={
              <RemoveShoppingCartOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="15px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {calculateTotalRevenue(orders)}
              </Typography>
            </Box>
          </Box>
          <Box
            height="250px"
            m="-20px 0 0 0"
            display="flex"
            justifyContent="center"
          >
            <LineChart />
          </Box>
        </Box>
        {/* ROW 2 - Recent Orders */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Orders
            </Typography>
          </Box>
          {sortedOrders.map((order) => (
            <Box
              key={order._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {`${order.customer.firstName} ${order.customer.lastName}`}
                </Typography>
                <Typography color={colors.grey[100]}>
                  Order Amount: ${order.totalAmount.toFixed(2)}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>Order ID: {order.orderNumber}</Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Product Distribution in Categories
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="-25px"
          >
            <PieChart />
          </Box>
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Product Stock Level
          </Typography>
          <Box height="250px" display="flex" justifyContent="center">
            <BarChart />
          </Box>
        </Box>
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;

// Function to calculate total revenue
function calculateTotalRevenue(orders) {
  let totalRevenue = 0;

  orders.forEach((order) => {
    totalRevenue += order.totalAmount;
  });

  return `$ ${totalRevenue.toFixed(2)}`;
}
