import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Orders from "./scenes/orders";
import OrderList from "./scenes/orders/orderList/OrderList";
import AddOrder from "./scenes/orders/addOrder/AddOrder";
import OrderDetails from "./scenes/orders/orderDetails/OrderDetails";
import ErrorBoundary from "./error/ErrorBoundary";
import OrderSummary from "./scenes/orders/orderDetails/OrderSummary";
import Inventory from "./scenes/inventory";
import Customers from "./scenes/customers";
import FAQ from "./scenes/faq";
import PersistLogin from "./scenes/auth/PersistLogin";
import RequireAuth from "./scenes/auth/RequireAuth";
import Layout from "./scenes/auth/Layout";
import Login from "./scenes/auth/login";
import Signup from "./scenes/auth/signup";
import ForgotPassword from "./scenes/auth/forgot-password";
import ActivationSuccess from "./scenes/auth/activation";
import ResendActivation from "./scenes/auth/resend-activation";
import Missing from "./scenes/missing";
import ResetPassword from "./scenes/auth/reset-password";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>

              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="activation/:token" element={<ActivationSuccess />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="resend-activation" element={<ResendActivation />} />
              {/* Protected routes */}
              <Route element={<PersistLogin />} >
                <Route element={<RequireAuth />}>
                  {/* Dashboard Routes */}
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />

                    <Route path="/orders" element={<Orders />} >
                      <Route path="list" element={<OrderList />} />
                      <Route path="add" element={<AddOrder />} />
                      <Route path="details" element={<OrderDetails />} />
                      <Route path=":orderNum" element={<OrderSummary />} />
                    </Route>

                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/faq" element={<FAQ />} />

                  </Route>
                </Route>
              </Route>

              {/* catch all */}
              <Route path="*" element={<Missing />} />
            </Route>
          </Routes>

        </ErrorBoundary>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
