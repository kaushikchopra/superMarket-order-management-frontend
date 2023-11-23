const orderReducer = (state, action) => {
    switch (action.type) {
        case "SET_ORDERS":
            return action.payload;
        case "ADD_ORDER":
            return [...state, action.payload];
        case "DELETE_ORDER":
            return state.filter(order => order._id !== action.payload)

        default:
            return state;
    }
}


export default orderReducer;