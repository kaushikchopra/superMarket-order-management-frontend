export const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
        return total + product.quantity * product.unitPrice;
    }, 0);
};

export const generateOrderNumber = (latestOrderNumber) => {
    if (latestOrderNumber) {
        const lastOrderNumber = parseInt(latestOrderNumber.split("D")[1]);
        return `ORD${lastOrderNumber + 1}`;
    } else {
        return "ORD100000";
    }
};
