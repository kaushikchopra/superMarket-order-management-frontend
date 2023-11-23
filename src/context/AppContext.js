import { createContext, useContext, useEffect, useReducer } from "react";
import combinedReducer from "./combinerReducer";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const initialState = {
    products: [],
    orders: [],
    customers: [],
    loading: true,
}

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const theme = useTheme();

    const [state, dispatch] = useReducer(combinedReducer, initialState);

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, orders, customers] = await Promise.all([
                    axiosPrivate.get("/api/products/", {
                        headers: {
                            Authorization: `Bearer ${auth?.accessToken}`,
                        },
                    }),
                    axiosPrivate.get("/api/orders/", {
                        headers: {
                            Authorization: `Bearer ${auth?.accessToken}`,
                        },
                    }),
                    axiosPrivate.get("/api/customers/", {
                        headers: {
                            Authorization: `Bearer ${auth?.accessToken}`,
                        },
                    }),
                ]);

                dispatch({ type: "SET_PRODUCTS", payload: products.data });
                dispatch({ type: "SET_ORDERS", payload: orders.data });
                dispatch({ type: "SET_CUSTOMERS", payload: customers.data });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch (error) {
                console.error("Error in fetching data:", error);
                toast.error("Error in fetching data", {
                    autoClose: "2000",
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };
        if (auth?.accessToken) { 
        fetchData();
        }
        // eslint-disable-next-line
    }, [auth?.accessToken, dispatch]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;

export const useAppContext = () => {
    return useContext(AppContext);
}
