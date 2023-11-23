import ProductReducer from "./ProductReducer"
import OrderReducer from "./orderReducer"
import CustomerReducer from "./customerReducer"

const combinedReducer = (state, action) => ({
    products: ProductReducer(state.products, action),
    orders: OrderReducer(state.orders, action),
    customers: CustomerReducer(state.customers, action),
    loading: action.type === "SET_LOADING" ? action.payload : state.loading,
});

export default combinedReducer;