import { createSlice } from "@reduxjs/toolkit";
import { compareObjects } from "src/utils/compareObjects";

const initialState = {
    name: "",
    phone: "",
    isLoading: false,
    cart: [],
    cartOfStoreId: "",
};

export const guestSlice = createSlice({
    name: "guest",
    initialState,
    reducers: {
        setGuestNameAndPhone: (state, action) => {
            state.name = action.payload.name;
            state.phone = action.payload.phone;
        },
        setStoreId: (state, action) => {
            state.cartOfStoreId = action.payload;
        },

        clearCart: (state) => {
            state.cart = [];
        },
        addToCart: (state, action) => {
            const sameProductInCart = state.cart.find(
                (el) => el.product.id === action.payload.product.id
            );
            if (sameProductInCart) {
                const { qty, product, ...PayloadVariants } = action.payload;
                const copyEl = JSON.parse(JSON.stringify(sameProductInCart));
                delete copyEl.qty;
                delete copyEl.product;
                const result = compareObjects(copyEl, PayloadVariants);
                console.log(result);
                if (result) {
                    // update qty
                    sameProductInCart.qty =
                        // sameProductInCart.qty +
                        action.payload.qty;
                }
                if (!result) {
                    //add new product to cart
                    state.cart = [action.payload, ...state.cart];
                }
            }
            if (!sameProductInCart) {
                state.cart = [action.payload, ...state.cart];
            }
        },
        removeFromCart: (state, action) => {
            const indexToRemove = action.payload;
            state.cart = state.cart.filter(
                (item, index) => index !== indexToRemove
            );
        },
        increaseQty: (state, action) => {
            state.cart[action.payload].qty = ++state.cart[action.payload].qty;
        },
        decreaseQty: (state, action) => {
            state.cart[action.payload].qty = --state.cart[action.payload].qty;
        },
        setQty: (state, action) => {
            state.cart[action.payload.index].qty = action.payload.value;
        },
    },
});
