const customerReducer = (state, action) => {
    switch (action.type) {
        case "SET_CUSTOMERS":
            return action.payload;
        case "ADD_CUSTOMER":
            return [...state, action.payload];
        case "UPDATE_CUSTOMER":
            return state.map(customer =>
                customer._id === action.payload._id ? { ...customer, ...action.payload } : customer);
        case "DELETE_CUSTOMER":
            return state.filter(customer => customer._id !== action.payload);
        default:
            return state;
    }
}


export default customerReducer;